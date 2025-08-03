import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HelpDesk Pro - Ticketing System",
  description: "A modern, card-based ticketing system with a sleek interface",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{
          __html: `
            body[data-scroll-locked] {
              --removed-body-scroll-bar-size: 0px !important;
              padding-right: 0 !important;
              margin-right: 0 !important;
              overflow: auto !important;
            }
            html body[data-scroll-locked] {
              --removed-body-scroll-bar-size: 0px !important;
              padding-right: 0 !important;
              margin-right: 0 !important;
              overflow: auto !important;
            }
          `
        }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster 
          position="top-center"
          richColors
          closeButton
          duration={Infinity}
          visibleToasts={10}
        />
      </body>
    </html>
  );
}
