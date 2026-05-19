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
        {/* Ambient Liquid Glass Motion Engine */}
        <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-blue-600/10 blur-[150px] pointer-events-none animate-pulse duration-[8000ms] ease-in-out z-0" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-violet-600/10 blur-[150px] pointer-events-none animate-pulse duration-[12000ms] ease-in-out z-0" />
        
        {/* Global Content Layer */}
        <div className="relative z-10 w-full h-full min-h-screen overflow-y-auto">
          {children}
        </div>
      </body>
    </html>
  );
}
