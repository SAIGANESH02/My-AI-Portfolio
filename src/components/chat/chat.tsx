'use client';
import { useChat } from '@ai-sdk/react';
import { AnimatePresence, motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

// Component imports
import ChatBottombar from '@/components/chat/chat-bottombar';
import ChatLanding from '@/components/chat/chat-landing';
import ChatMessageContent from '@/components/chat/chat-message-content';
import { SimplifiedChatView } from '@/components/chat/simple-chat-view';
import {
  ChatBubble,
  ChatBubbleMessage,
} from '@/components/ui/chat/chat-bubble';
import AvatarFace from '@/components/fun/AvatarFace';
import ExtrasMenu from '@/components/fun/ExtrasMenu';
import PerfMeter, { usePerfMeter } from '@/components/fun/PerfMeter';
import VoiceBar from '@/components/fun/VoiceBar';
import { useRealtimeVoice } from '@/components/fun/useRealtimeVoice';
import WelcomeModal from '@/components/welcome-modal';
import { Home, Info } from 'lucide-react';
import Link from 'next/link';
import HelperBoost from './HelperBoost';

// ClientOnly component for client-side rendering
//@ts-ignore
const ClientOnly = ({ children }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <>{children}</>;
};

const MOTION_CONFIG = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: {
    duration: 0.3,
    ease: 'easeOut',
  },
};

const Chat = () => {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('query');
  const autoVoice = searchParams.get('voice') === '1';
  const [autoSubmitted, setAutoSubmitted] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const perf = usePerfMeter();

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
    setMessages,
    setInput,
    reload,
    addToolResult,
    append,
  } = useChat({
    onResponse: (response) => {
      if (response) {
        perf.onResponseHeaders(response);
        setLoadingSubmit(false);
        setIsTalking(true);
      }
    },
    onFinish: (_message, { usage }) => {
      perf.onDone(usage);
      setLoadingSubmit(false);
      setIsTalking(false);
    },
    onError: (error) => {
      setLoadingSubmit(false);
      setIsTalking(false);
      console.error('Chat error:', error.message, error.cause);
      toast.error(`Error: ${error.message}`);
    },
    onToolCall: (tool) => {
      const toolName = tool.toolCall.toolName;
      console.log('Tool call:', toolName);
    },
  });

  // --- Voice ---------------------------------------------------------------
  // Spoken turns land in the same message list as typed ones, so the history
  // is continuous no matter how the visitor chose to talk.
  const setMessagesRef = useRef(setMessages);
  setMessagesRef.current = setMessages;

  const voice = useRealtimeVoice({
    onTurnComplete: (turn) => {
      setMessagesRef.current((prev) => [
        ...prev,
        {
          id: turn.id,
          role: turn.role,
          content: turn.text,
          // Marks it as spoken so the transcript can be styled differently.
          annotations: [{ via: 'voice' }],
        } as never,
      ]);
    },
    onTool: (toolName) => {
      // Render the same card the text chat would, from the voice call.
      setMessagesRef.current((prev) => [
        ...prev,
        {
          id: `voice-tool-${toolName}-${Date.now()}`,
          role: 'assistant',
          content: '',
          parts: [
            {
              type: 'tool-invocation',
              toolInvocation: {
                state: 'result',
                toolCallId: `voice-${toolName}-${Date.now()}`,
                toolName,
                args: {},
                result: '',
              },
            },
          ],
        } as never,
      ]);
    },
  });

  const voiceLive = voice.phase === 'live';

  // One-click "talk to me" from the home page.
  const voiceStart = voice.start;
  const [voiceAutoStarted, setVoiceAutoStarted] = useState(false);
  useEffect(() => {
    if (autoVoice && !voiceAutoStarted) {
      setVoiceAutoStarted(true);
      voiceStart();
    }
  }, [autoVoice, voiceAutoStarted, voiceStart]);

  const { currentAIMessage, latestUserMessage, hasActiveTool } = useMemo(() => {
    const latestAIMessageIndex = messages.findLastIndex(
      (m) => m.role === 'assistant'
    );
    const latestUserMessageIndex = messages.findLastIndex(
      (m) => m.role === 'user'
    );

    const result = {
      currentAIMessage:
        latestAIMessageIndex !== -1 ? messages[latestAIMessageIndex] : null,
      latestUserMessage:
        latestUserMessageIndex !== -1 ? messages[latestUserMessageIndex] : null,
      hasActiveTool: false,
    };

    if (result.currentAIMessage) {
      result.hasActiveTool =
        result.currentAIMessage.parts?.some(
          (part) =>
            part.type === 'tool-invocation' &&
            part.toolInvocation?.state === 'result'
        ) || false;
    }

    if (latestAIMessageIndex < latestUserMessageIndex) {
      result.currentAIMessage = null;
    }

    return result;
  }, [messages]);

  const isToolInProgress = messages.some(
    (m) =>
      m.role === 'assistant' &&
      m.parts?.some(
        (part) =>
          part.type === 'tool-invocation' &&
          part.toolInvocation?.state !== 'result'
      )
  );

  //@ts-ignore
  const submitQuery = (query) => {
    if (!query.trim() || isToolInProgress) return;
    perf.onSend();
    setLoadingSubmit(true);
    append({
      role: 'user',
      content: query,
    });
  };

  useEffect(() => {
    if (initialQuery && !autoSubmitted) {
      setAutoSubmitted(true);
      setInput('');
      submitQuery(initialQuery);
    }
  }, [initialQuery, autoSubmitted]);

  // Stamp time-to-first-token the moment the assistant's text starts arriving.
  const markFirstToken = perf.onFirstToken;
  useEffect(() => {
    if (currentAIMessage?.content) {
      markFirstToken();
    }
  }, [currentAIMessage?.content, markFirstToken]);

  //@ts-ignore
  const onSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isToolInProgress) return;
    submitQuery(input);
    setInput('');
  };

  const handleStop = () => {
    stop();
    setLoadingSubmit(false);
    setIsTalking(false); // the isTalking effect pauses the video safely
  };

  // Check if this is the initial empty state (no messages)
  const isEmptyState =
    !currentAIMessage && !latestUserMessage && !loadingSubmit;

  // Calculate header height based on hasActiveTool
  // Measured rather than hardcoded: the header grew when the voice bar was
  // added and the old fixed 100/180 left content tucked underneath it.
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(180);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) =>
      setHeaderHeight(Math.ceil(entry.contentRect.height))
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="relative h-screen overflow-hidden">
      <PerfMeter stats={perf.stats} />
      {/* Home — always available so visitors aren't stranded in the chat */}
      <div className="absolute top-6 left-6 z-51 flex items-center gap-2">
        <Link
          href="/"
          aria-label="Back to home"
          className="bg-background/70 hover:bg-accent flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium shadow-sm backdrop-blur transition-all hover:scale-105"
        >
          <Home className="h-4 w-4" />
          <span className="hidden sm:inline">Home</span>
        </Link>
      </div>

      <div className="absolute top-6 right-8 z-51 flex items-center justify-center gap-1">
        <ExtrasMenu />
        <WelcomeModal
          trigger={
            <div className="hover:bg-accent cursor-pointer rounded-2xl px-3 py-1.5">
              <Info className="text-accent-foreground h-5 w-5" />
            </div>
          }
        />
      </div>

      {/* Fixed Avatar Header with Gradient */}
      <div
        ref={headerRef}
        className="fixed top-0 right-0 left-0 z-50 bg-gradient-to-b from-white via-white/95 via-50% to-transparent dark:from-black dark:via-black/95 dark:via-50% dark:to-transparent"
      >
        <div
          className={`transition-all duration-300 ease-in-out ${hasActiveTool ? 'pt-6 pb-0' : 'py-6'}`}
        >
          <div className="flex flex-col items-center gap-3">
            <ClientOnly>
              {/* Mouth is driven by real output amplitude during a call, a
                  soft cadence while text streams, and held closed otherwise. */}
              <div className="relative">
                <AvatarFace
                  mode={voiceLive ? 'voice' : isTalking ? 'text' : 'idle'}
                  levelRef={voice.levelRef}
                  size={hasActiveTool ? 80 : 112}
                  className={`shadow-sm ring-2 transition-all duration-300 ${
                    voiceLive
                      ? 'ring-red-400 dark:ring-red-500'
                      : 'ring-transparent'
                  }`}
                />
                {voiceLive && (
                  <span className="absolute inset-0 animate-ping rounded-full ring-2 ring-red-400/40" />
                )}
              </div>

              <VoiceBar
                phase={voice.phase}
                error={voice.error}
                secondsLeft={voice.secondsLeft}
                turns={voice.turns}
                onStart={voice.start}
                onStop={voice.hangUp}
              />
            </ClientOnly>
          </div>

          <AnimatePresence>
            {latestUserMessage && !currentAIMessage && (
              <motion.div
                {...MOTION_CONFIG}
                className="mx-auto flex max-w-3xl px-4"
              >
                <ChatBubble variant="sent">
                  <ChatBubbleMessage>
                    <ChatMessageContent
                      message={latestUserMessage}
                      isLast={true}
                      isLoading={false}
                      reload={() => Promise.resolve(null)}
                    />
                  </ChatBubbleMessage>
                </ChatBubble>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto flex h-full max-w-3xl flex-col">
        {/* Scrollable Chat Content */}
        <div
          className="flex-1 overflow-y-auto px-2"
          style={{ paddingTop: `${headerHeight}px` }}
        >
          <AnimatePresence mode="wait">
            {isEmptyState ? (
              <motion.div
                key="landing"
                className="flex min-h-full items-center justify-center"
                {...MOTION_CONFIG}
              >
                <ChatLanding submitQuery={submitQuery} />
              </motion.div>
            ) : currentAIMessage ? (
              <div className="pb-4">
                <SimplifiedChatView
                  message={currentAIMessage}
                  isLoading={isLoading}
                  reload={reload}
                  addToolResult={addToolResult}
                />
              </div>
            ) : (
              loadingSubmit && (
                <motion.div
                  key="loading"
                  {...MOTION_CONFIG}
                  className="px-4 pt-18"
                >
                  <ChatBubble variant="received">
                    <ChatBubbleMessage isLoading />
                  </ChatBubble>
                </motion.div>
              )
            )}
          </AnimatePresence>
        </div>

{/* Fixed Bottom Bar */}
<div
  className="sticky bottom-0 px-2 pt-3 md:px-0 md:pb-4 transition-colors duration-300 bg-white dark:bg-black"
>
  <div className="relative flex flex-col items-center gap-3">
    <HelperBoost submitQuery={submitQuery} setInput={setInput} />
    <ChatBottombar
      input={input}
      handleInputChange={handleInputChange}
      handleSubmit={onSubmit}
      isLoading={isLoading}
      stop={handleStop}
      isToolInProgress={isToolInProgress}
    />
  </div>
</div>

        <a
          href="https://linkedin.com/in/saiganeshn"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed right-3 bottom-0 z-10 mb-4 hidden cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-sm hover:underline md:block"
        >
          @saiganeshn
        </a>
      </div>
    </div>
  );
};

export default Chat;
