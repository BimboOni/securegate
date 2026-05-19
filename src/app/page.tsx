import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-zinc-950 flex flex-col justify-center items-center px-6 font-sans selection:bg-blue-500/30 selection:text-zinc-200 overflow-hidden">
      {/* Hero Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-section-bg-image-2.jpeg"
          alt=""
          fill
          className="object-cover opacity-70 mix-blend-screen"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-zinc-950/40 to-zinc-950/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/60 via-transparent to-zinc-950/60" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-3xl w-full text-center">
        {/* Brand — Icon + Wordmark */}
        <div className="flex flex-col items-center gap-6 mb-10">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-600/20 border border-blue-500/20 flex items-center justify-center shadow-xl shadow-blue-500/10 backdrop-blur-md">
            <svg className="h-7 w-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <h1 className="text-[clamp(2rem,5vw,3.75rem)] font-bold text-zinc-100 tracking-tight leading-none">
              SecureGate
            </h1>
            <p className="mt-3 text-[clamp(0.9rem,2vw,1.125rem)] text-zinc-500 font-light tracking-wide">
              Authentication Engine
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm sm:text-base text-zinc-500 max-w-lg mx-auto leading-relaxed mb-12">
          A production-grade Next.js multi-tenant authentication system built with Prisma, NextAuth, and PostgreSQL at the edge.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-sm mx-auto mb-16">
          <Link
            href="/auth?view=register"
            className="w-full sm:w-44 flex items-center justify-center px-8 py-3.5 bg-zinc-100 text-zinc-950 font-semibold rounded-xl cursor-pointer transition-all duration-300 active:scale-[0.98] hover:bg-blue-600 hover:text-white shadow-xl shadow-blue-500/10 text-sm"
          >
            Get Started
          </Link>
          <Link
            href="/auth?view=login"
            className="w-full sm:w-44 flex items-center justify-center px-8 py-3.5 border border-zinc-700/60 text-zinc-400 bg-zinc-900/60 hover:bg-zinc-800/80 hover:text-zinc-200 text-sm font-medium rounded-xl transition-all duration-300 active:scale-[0.98] shadow-lg backdrop-blur-sm cursor-pointer"
          >
            Sign In
          </Link>
        </div>

        {/* Meta Footer */}
        <div className="flex items-center justify-center gap-4 text-xs text-zinc-600">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-zinc-900/60 border border-zinc-800/60 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            All Systems Operational
          </span>
          <span className="text-zinc-700 hidden sm:inline">|</span>
          <span className="hidden sm:inline text-zinc-600">Next.js 14 &middot; Prisma &middot; JWT</span>
        </div>
      </div>
    </div>
  );
}
