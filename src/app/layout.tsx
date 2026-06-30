import type { Metadata, Viewport } from "next";
import { Geist_Mono } from "next/font/google";
import { SerwistRegistration } from "@/components/SerwistRegistration";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const APP_NAME = "NestCalc";
const APP_TITLE = "NestCalc — Rem Nesting";
const APP_DESCRIPTION =
  "Quick rectangular nesting calculator for laser shop rems. Independent margins, gap, and dual rotation.";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_TITLE,
    template: `%s · ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: APP_NAME,
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistMono.variable} h-full`} data-theme="dark">
      <body className="min-h-full bg-[var(--background)] font-sans text-[var(--foreground)] antialiased">
        <SerwistRegistration>{children}</SerwistRegistration>
      </body>
    </html>
  );
}