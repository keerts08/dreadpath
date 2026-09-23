import type { Metadata, Viewport } from "next";
import { Cinzel, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import RegisterServiceWorker from "@/components/register-sw";

const display = Cinzel({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "600"],
});

const body = IBM_Plex_Mono({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Dreadpath",
  description:
    "You woke up somewhere you shouldn't be. Something else lives here.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Dreadpath",
  },
};

export const viewport: Viewport = {
  themeColor: "#07080a",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} h-full`}>
      <body className="min-h-full bg-void text-ink">
        <RegisterServiceWorker />
        {children}
      </body>
    </html>
  );
}
