import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6 lg:p-12 overflow-hidden font-sans">
      <div className="w-full max-w-6xl aspect-[16/10] grid grid-cols-1 lg:grid-cols-12 bg-zinc-900/10 border border-zinc-900/40 rounded-3xl shadow-2xl shadow-black/80 overflow-hidden relative backdrop-blur-md">
        {/* Left Panel — Brand + Forms (5/12) */}
        <div className="lg:col-span-5 flex flex-col justify-between p-8 sm:p-12 bg-zinc-950/80 relative z-10 overflow-y-auto">
          <Link
            href="/"
            className="cursor-pointer hover:opacity-90 active:scale-[0.99] transition-all select-none flex items-center gap-3 shrink-0"
          >
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 border border-blue-400/20">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-zinc-100 tracking-tight">SecureGate Pro</h1>
          </Link>
          <div className="flex-1 flex items-center justify-center">
            {children}
          </div>
          <div />
        </div>

        {/* Right Panel — Artwork Video (7/12) */}
        <div className="hidden lg:flex lg:col-span-7 relative flex-col items-center justify-center bg-zinc-950 overflow-hidden p-6">
          <div className="w-full h-full rounded-2xl overflow-hidden relative border border-zinc-800/60 shadow-inner">
            <video
              src="/auth-motion.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="w-full h-full object-cover opacity-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950/40" />
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/5 via-transparent to-violet-600/5 animate-pulse duration-[10000ms] ease-in-out" />
          </div>
        </div>
      </div>
    </div>
  );
}
