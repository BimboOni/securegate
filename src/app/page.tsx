import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center px-4 font-sans selection:bg-zinc-800 selection:text-zinc-200">
      <div className="max-w-md w-full text-center space-y-8">

        {/* Animated Brand Shield Icon */}
        <div className="flex justify-center">
          <div className="h-16 w-16 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center shadow-2xl shadow-black">
            <svg className="h-8 w-8 text-zinc-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>

        {/* Hero Copy */}
        <div className="space-y-3">
          <h1 className="text-4xl font-extrabold text-zinc-100 tracking-tight sm:text-5xl">
            SecureGate <span className="text-zinc-500 font-light">Pro</span>
          </h1>
          <p className="text-base text-zinc-400 max-w-sm mx-auto">
            An advanced Next.js multi-tenant authentication engine backed by distributed cryptographic protocols and edge diagnostics.
          </p>
        </div>

        {/* Tactical Navigation Links */}
        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto pt-4">
          <Link
            href="/login"
            className="w-full flex items-center justify-center px-4 py-3 border border-zinc-800 text-sm font-medium rounded-xl text-zinc-200 bg-zinc-900/50 hover:bg-zinc-900 hover:text-white transition-all duration-200 shadow-lg active:scale-95"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium rounded-xl text-zinc-950 bg-zinc-100 hover:bg-zinc-200 transition-all duration-200 shadow-lg active:scale-95 font-semibold"
          >
            Create Account
          </Link>
        </div>

        {/* Footer Technical Meta Tags */}
        <div className="pt-12 flex justify-center items-center gap-3 text-xs text-zinc-600">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-zinc-900 border border-zinc-800">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            Edge Node Active
          </span>
          <span>•</span>
          <span>Next.js 14 Production Stack</span>
        </div>

      </div>
    </div>
  );
}