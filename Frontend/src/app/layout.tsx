import "./globals.css";

import type { Metadata } from "next";

import Providers from "./providers";

export const metadata: Metadata = {
  title: {
    default: "API Sentinel",
    template: "%s | API Sentinel",
  },
  description:
    "Internal API testing and monitoring platform for engineering teams.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}