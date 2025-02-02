import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/ui/layout/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sentinel Legal",
  description: "Finance agreement checker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col gap-20 px-4 sm:px-20`}
      >
        <div className="flex flex-col min-h-screen gap-16 mt-40">
          <div className="fixed top-0 left-0 w-full z-10 bg-white shadow-md h-16">
            <Header />
          </div>

          <div>{children}</div>
        </div>
      </body>
    </html>
  );
}
