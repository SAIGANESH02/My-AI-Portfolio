import { Analytics } from "@vercel/analytics/react"
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import EasterEggs from "@/components/fun/EasterEggs";
import Script from "next/script";
import "./globals.css";

// Load Inter font for non-Apple devices
const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Sai Ganesh Nellore | Senior ML Engineer",
  description: "Interactive AI-powered portfolio showcasing production LLM systems, high-performance inference, GPU training infrastructure, and voice AI. Senior ML Engineer with ~5 years of experience shipping AI to real traffic.",
  keywords: [
    "Sai Ganesh Nellore",
    "Machine Learning Engineer",
    "AI Engineer",
    "Portfolio",
    "LLM Optimization",
    "Voice AI",
    "RAG Systems",
    "AWS",
    "AI/ML",
    "Deep Learning",
    "NLP",
    "Computer Vision",
    "MLOps",
    "GenAI",
    "Northwestern University",
    "Chicago",
    "Python",
    "TensorFlow",
    "PyTorch",
  ],
  authors: [
    {
      name: "Sai Ganesh Nellore",
      url: "https://github.com/SAIGANESH02",
    },
  ],
  creator: "Sai Ganesh Nellore",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://saiganesh02.github.io/SaiGanesh02/",
    title: "Sai Ganesh Nellore | Senior ML Engineer Portfolio",
    description: "Interactive AI-powered portfolio featuring production-scale ML systems, LLM optimization, and voice AI solutions",
    siteName: "Sai Ganesh Nellore Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sai Ganesh Nellore | Senior ML Engineer",
    description: "Interactive AI-powered portfolio showcasing production ML systems and LLM optimization",
    creator: "@saigane75831398",
  },
  icons: {
    icon: [
      {
        url: "/logo-saiganesh.svg",
        sizes: "any",
      }
    ],
    shortcut: "/logo-saiganesh.svg?v=2",
    apple: "/apple-touch-icon.svg?v=2",
  },
  metadataBase: new URL('https://saiganesh02.github.io'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="author" content="Sai Ganesh Nellore" />
        <meta name="robots" content="index, follow" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/og-image.png" />
        <link rel="icon" href="/logo-saiganesh.svg" sizes="any" />
        <link rel="canonical" href="https://saiganesh02.github.io/SaiGanesh02/" />
        
        {/* Google Analytics - Replace with your GA tracking ID */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window['dataLayer'] = window['dataLayer'] || [];
              function gtag(){window['dataLayer'].push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XXXXXXXXXX');
            `,
          }}
        />

        {/* LinkedIn Insight Tag - Optional */}
        <Script
          id="linkedin-insight"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              _linkedin_partner_id = "XXXXXXX";
              window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
              window._linkedin_data_partner_ids.push(_linkedin_partner_id);
            `,
          }}
        />

        {/* JSON-LD Structured Data for SEO */}
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Sai Ganesh Nellore",
              "jobTitle": "Senior Machine Learning Engineer",
              "description": "Senior ML Engineer specializing in production LLM systems, inference optimization, GPU training infrastructure, and voice AI",
              "url": "https://saiganesh02.github.io/SaiGanesh02/",
              "sameAs": [
                "https://linkedin.com/in/saiganeshn",
                "https://github.com/SAIGANESH02",
                "https://twitter.com/saigane75831398"
              ],
              "alumniOf": {
                "@type": "EducationalOrganization",
                "name": "Northwestern University"
              },
              "knowsAbout": [
                "Machine Learning",
                "Artificial Intelligence",
                "LLM Optimization",
                "Voice AI",
                "RAG Systems",
                "AWS",
                "Deep Learning",
                "NLP",
                "Computer Vision",
                "MLOps"
              ]
            })
          }}
        />
      </head>
      <body
        className={cn(
          "min-h-screen bg-white text-black dark:bg-black dark:text-white font-sans antialiased transition-colors duration-500 ease-in-out",
          inter.variable,
        )}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          <main className="flex min-h-screen flex-col">
            {children}
          </main>
          <Toaster />
          <EasterEggs />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}