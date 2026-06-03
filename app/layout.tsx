import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Eventzone Blog | Insights pour vos événements",
    template: "%s | Eventzone Blog",
  },
  description:
    "Découvrez nos articles, guides et ressources pour organiser des événements professionnels en France et en Afrique du Nord.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://eventzone.pro"
  ),
  icons: {
    icon: "https://i.imgur.com/Ul3gM9k.png",
    shortcut: "https://i.imgur.com/Ul3gM9k.png",
    apple: "https://i.imgur.com/Ul3gM9k.png",
  },
  openGraph: {
    siteName: "Eventzone",
    type: "website",
    locale: "fr_FR",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

import TranslationBridge from "@/components/blog/TranslationBridge";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${spaceGrotesk.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const path = window.location.pathname;
                  const lang = path.split('/')[1] || 'fr';
                  if (['fr', 'en', 'ar'].includes(lang)) {
                    document.documentElement.lang = lang;
                    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
                  }
                } catch (e) {}
              })();
            `
          }}
        />
      </head>
      <body className="bg-transparent text-text-primary font-body antialiased relative min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {/* Animated Background Mesh */}
          <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none select-none bg-background transition-colors duration-500">
            {/* Glow blobs - visible only in dark mode */}
            <div className="hidden dark:block absolute top-[-20%] left-[-20%] w-[60vw] h-[60vw] rounded-full bg-[#2B7FFF]/15 blur-[150px] animate-float-1 will-change-transform" />
            <div className="hidden dark:block absolute bottom-[-20%] right-[-20%] w-[60vw] h-[60vw] rounded-full bg-[#6366f1]/15 blur-[150px] animate-float-2 will-change-transform" />
            <div className="hidden dark:block absolute top-[20%] left-[25%] w-[45vw] h-[45vw] rounded-full bg-[#06b6d4]/10 blur-[130px] animate-float-1 will-change-transform" />
            <div className="hidden dark:block absolute bottom-[20%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-[#d946ef]/8 blur-[120px] animate-float-2 will-change-transform" />
          </div>

          <TranslationBridge />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
