import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "InternFlow AI - Modern Internship Platform",
  description: "A role-based internship management portal featuring announcements, FAQs, learning resources, and an AI assistant.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0B1120] text-[#F3F4F6] selection:bg-blue-600/30 selection:text-blue-200">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
