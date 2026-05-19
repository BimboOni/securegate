import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "SecureGate Pro",
  description: "Secure Next.js Authentication Engine",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative overflow-hidden bg-zinc-950 min-h-screen text-zinc-100 selection:bg-blue-500/30 selection:text-zinc-200`}
      >
        {/* Global Content Layer */}
        <div className="relative z-10 w-full h-full min-h-screen overflow-y-auto">
          {children}
        </div>
      </body>
    </html>
  );
}
