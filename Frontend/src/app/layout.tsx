import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

export const metadata: Metadata = {
  title: { default: "API Sentinel", template: "%s | API Sentinel" },
  description: "Internal API testing and monitoring platform for engineering teams.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div style={{ display: "flex", minHeight: "100vh" }}>
          <Sidebar />
          <div style={{ marginLeft: "220px", flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <Topbar />
            <main style={{ flex: 1, backgroundColor: "#F4F6F6", padding: "24px" }}>
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
