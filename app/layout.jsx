"use client"

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { ChatWidget } from "@/components/ChatWidget";
import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/login'

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-[family-name:var(--font-geist-sans)] bg-slate-50 text-slate-900`}
      >
        {!isLoginPage && <Sidebar />}
        {!isLoginPage && <Header />}
        <main className={isLoginPage ? "min-h-screen bg-white" : "pl-[90px] pt-[55px] min-h-screen bg-white"}>
          {children}
        </main>
        {!isLoginPage && <ChatWidget />}
      </body>
    </html>
  );
}
