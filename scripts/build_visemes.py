#!/usr/bin/env python3
"""
Build the avatar mouth frames from the source memoji video.

The character moves continuously through the source clip, so naively sampling
frames by mouth-openness gives you 24 different *poses*, not 24 mouth shapes —
measured across the whole set, the eyes varied ~2x more than the mouth and the
shoulders more than either. Swapping between those reads as a slideshow.

So: find the largest run of frames that share a head pose (everything outside
the mouth band is near-identical), and pick the mouth shapes from inside that
cluster only. Head, eyes and shoulders stay locked; just the mouth moves. This
is the same 8-12 viseme approach used for hand-animated 2D lip sync.

Emits one image per shape rather than a sprite sheet — a sheet needs
background-position math that silently shows two half-faces when it drifts.

Usage:  python3 scripts/build_visemes.py
Writes: public/avatar/viseme-NN.webp  and  src/components/fun/visemes.ts
"""

import glob
import json
import os
import shutil
import subprocess
import tempfile

import numpy as np
from PIL import Image

SRC = "assets/final_memojis.webm"
OUT_DIR = "public/avatar"
TABLE = "src/components/fun/visemes.ts"

FPS = 24
LEVELS = 12          # mouth shapes to emit, closed -> widest
TILE = 256
CONTENT = (280, 0, 1000, 720)   # strips pillarbox + watermark

MOUTH_TOP, MOUTH_BOT = 0.52, 0.74   # band that is allowed to differ
SIG = 72                            # signature resolution for pose comparison


def analyse(path: str):
    """Return (pose signature outside the mouth, mouth openness, mouth width).

    Width separates a closed *smile* from a closed *pout* — both are near-zero
    openness, but a smile is much wider. Without it the resting face ends up
    being whichever frame happens to be most shut, which looked sullen.
    """
    im = Image.open(path).crop(CONTENT).convert("L")
    small = np.asarray(im.resize((SIG, SIG), Image.BILINEAR), dtype=np.float32)
    top, bot = int(SIG * MOUTH_TOP), int(SIG * MOUTH_BOT)
    pose = np.concatenate([small[:top].ravel(), small[bot:].ravel()])

    # Keep this crop tight to the lips. Widening it makes the dark region
    # span the whole band on nearly every frame, and `width` stops telling a
    # smile apart from a pout.
    w, h = im.size
    band = np.asarray(
        im.crop((int(w * 0.40), int(h * 0.55), int(w * 0.60), int(h * 0.72)))
    )
    dark = band < 90
    openness = float(dark.mean())
    cols = np.where(dark.any(axis=0))[0]
    width = float((cols.max() - cols.min()) / band.shape[1]) if len(cols) else 0.0
    return pose, openness, width


def main() -> None:
    tmp = tempfile.mkdtemp()
    try:
        subprocess.run(
            ["ffmpeg", "-v", "error", "-i", SRC, "-vf", f"fps={FPS}",
             os.path.join(tmp, "%04d.png"), "-y"],
            check=True,
        )
        frames = sorted(glob.glob(os.path.join(tmp, "*.png")))
        if not frames:
            raise SystemExit("no frames extracted")

        poses, opens, widths = zip(*(analyse(f) for f in frames))
        poses = np.stack(poses)
        opens = np.array(opens)
        widths = np.array(widths)
        print(f"{len(frames)} frames, openness {opens.min():.4f}..{opens.max():.4f}")

        full_span = opens.max() - opens.min()

        # Tightest pose tolerance that still yields enough *distinct* mouth
        # shapes over a decent range. Scoring on span alone just picks the
        # loosest tolerance, which defeats the point.
        best = None
        for tol in (4, 5, 6, 7, 8, 9, 10, 12, 14, 16):
            for a in range(len(frames)):
                same = np.where(np.abs(poses - poses[a]).mean(axis=1) < tol)[0]
                if len(same) < 4:
                    continue
                span = opens[same].max() - opens[same].min()
                distinct = len(np.unique(np.round(opens[same], 3)))
                if span < 0.6 * full_span or distinct < 6:
                    continue
                if best is None or span > best[0]:
                    best = (span, tol, a, same, distinct)
            if best is not None:
                break   # ascending tol: first hit is the tightest that works
        if best is None:
            raise SystemExit("no stable-pose cluster found")

        span, tol, anchor, members, distinct = best
        print(f"cluster: anchor {anchor}, pose tol {tol}, {len(members)} frames, "
              f"{distinct} distinct mouth shapes, span {span/full_span*100:.0f}% "
              "of full range")

        m_lo, m_hi = opens[members].min(), opens[members].max()

        # Resting face: the friendliest of the near-closed frames, not simply
        # the most closed. This is the image the whole site sits on, so a
        # closed smile beats a neutral pout even though both read as "shut".
        quiet = members[opens[members] <= m_lo + 0.4 * (m_hi - m_lo)]
        idle = int(quiet[np.argmax(widths[quiet])])
        print(f"resting frame {idle}: openness {opens[idle]:.4f}, "
              f"mouth width {widths[idle]:.3f} "
              f"(most-closed was {int(members[np.argmin(opens[members])])} at "
              f"width {widths[members[np.argmin(opens[members])]]:.3f})")

        # The speaking ramp starts from the most *neutral* closed mouth, not
        # from the smile. Holding one grin and just opening it looks like a
        # single expression being puppeted; resting on a smile and relaxing
        # into a neutral face to speak is what people actually do. Both come
        # from the same pose cluster, so the swap does not move the head.
        lo, hi = m_lo, m_hi
        chosen: list[int] = []
        for i in range(LEVELS):
            target = lo + (hi - lo) * i / (LEVELS - 1)
            order = members[np.argsort(np.abs(opens[members] - target))]
            for cand in order:
                if int(cand) not in chosen and int(cand) != idle:
                    chosen.append(int(cand))
                    break
        chosen.sort(key=lambda idx: opens[idx])

        shutil.rmtree(OUT_DIR, ignore_errors=True)
        os.makedirs(OUT_DIR, exist_ok=True)

        def emit(src_idx: int, name: str) -> int:
            tile = Image.open(frames[src_idx]).crop(CONTENT).resize(
                (TILE, TILE), Image.LANCZOS
            )
            path = os.path.join(OUT_DIR, name)
            tile.save(path, "WEBP", quality=86, method=6)
            return os.path.getsize(path)

        total = emit(idle, "viseme-idle.webp")
        for i, idx in enumerate(chosen):
            total += emit(idx, f"viseme-{i:02d}.webp")

        print(f"{len(chosen)} frames -> {OUT_DIR}: {total/1024:.0f} KB total")

        # Prove the head actually holds still: the mouth must move more than
        # the eyes do. Before this clustering it was the other way round.
        sel = np.stack([
            np.asarray(
                Image.open(frames[i]).crop(CONTENT).convert("L")
                .resize((SIG, SIG), Image.BILINEAR), dtype=np.float32)
            for i in chosen
        ])
        def band(a, b):
            r = sel[:, int(SIG * a):int(SIG * b)]
            return float(np.abs(r - r[0]).mean())
        eyes, mouth_v, body = band(0.30, 0.50), band(0.55, 0.72), band(0.80, 1.0)
        print(f"variation across chosen frames — eyes {eyes:.1f}  "
              f"mouth {mouth_v:.1f}  body {body:.1f}")
        if mouth_v <= max(eyes, body):
            print("  WARNING: mouth is not the dominant motion; head is not stable")

        norm = [round(float((opens[i] - lo) / (hi - lo)) if hi > lo else 0.0, 4)
                for i in chosen]
        with open(TABLE, "w") as fh:
            fh.write(
                "// GENERATED by scripts/build_visemes.py — do not edit by hand.\n"
                "// Mouth shapes from a single stable head pose, closed -> widest.\n"
                f"export const VISEME_COUNT = {LEVELS};\n"
                "export const VISEME_SRCS: string[] = Array.from(\n"
                f"  {{ length: {LEVELS} }},\n"
                "  (_, i) => `/avatar/viseme-${String(i).padStart(2, '0')}.webp`\n"
                ");\n"
                "/**\n"
                " * Resting face: a smile. Deliberately NOT part of the speech\n"
                " * ramp, which starts from a neutral mouth — holding one grin\n"
                " * and only opening it reads as a single puppeted expression.\n"
                " * Same pose cluster, so swapping does not move the head.\n"
                " */\n"
                "export const VISEME_IDLE = '/avatar/viseme-idle.webp';\n"
                "// Normalized openness of each frame (0 = closed, 1 = widest).\n"
                f"export const VISEME_OPENNESS: number[] = {json.dumps(norm)};\n"
            )
        print(f"{TABLE} written")
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


if __name__ == "__main__":
    main()
