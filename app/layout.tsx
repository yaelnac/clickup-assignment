import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { MotionProvider } from "@/components/ui/MotionProvider";
import { deck } from "@/content/slides";
import { deckScaleScript } from "@/lib/stage";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: deck.htmlTitle,
  description: deck.description,
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full bg-bg font-sans text-body text-fg">
        {/* Sets --deck-scale on <html> before first paint; suppressHydrationWarning above covers that attribute. */}
        <script dangerouslySetInnerHTML={{ __html: deckScaleScript }} />
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
