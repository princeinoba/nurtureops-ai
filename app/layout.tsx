import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { ServiceWorkerRegistration } from "@/components/shells/service-worker-registration";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "NurtureOps AI - synthetic childcare operations demo",
    template: "%s | NurtureOps AI",
  },
  description:
    "A synthetic-data portfolio demonstration for childcare operations, attendance, billing, family communication, and human-reviewed AI.",
  applicationName: "NurtureOps AI",
  manifest: "/manifest.webmanifest",
  robots: { index: false, follow: false, nocache: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f7f2" },
    { media: "(prefers-color-scheme: dark)", color: "#101814" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body>
        <ServiceWorkerRegistration />
        {children}
      </body>
    </html>
  );
}
