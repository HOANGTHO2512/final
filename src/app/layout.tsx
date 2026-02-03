import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import ChatBot from "@/components/ChatBot";

export const metadata: Metadata = {
  title: "CareerDNA - 職涯發展平台",
  description: "AI-powered career development and personal branding platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
        <ChatBot />
      </body>
    </html>
  );
}
