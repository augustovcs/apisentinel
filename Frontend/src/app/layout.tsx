import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "API Sentinel", template: "%s | API Sentinel" },
  description: "Internal API testing and monitoring platform for engineering teams.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
