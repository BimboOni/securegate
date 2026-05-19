import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import SignOutButton from "./SignOutButton";
import ThemeToggle from "./ThemeToggle";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth");
  }

  if (!session.user?.emailVerified) {
    redirect("/auth?unverified=true");
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans selection:bg-blue-500/30 selection:text-zinc-200 transition-colors duration-300">
      {/* Nav */}
      <nav className="border-b border-zinc-200 dark:border-zinc-800/50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl transition-colors duration-300">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-24 items-center">
            <Link href="/" className="flex-shrink-0 flex items-center gap-2.5 cursor-pointer hover:opacity-90 active:scale-[0.99] transition-all select-none">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 border border-blue-400/20">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">SecureGate Pro</h1>
            </Link>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <SignOutButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        {/* Welcome */}
        <div className="mb-12">
          <h2 className="text-[clamp(1.25rem,2.5vw,1.75rem)] font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Welcome back{session.user?.name ? `, ${session.user.name}` : ''}
          </h2>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 font-medium">
            You have successfully authenticated via NextAuth.
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-zinc-50/80 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800/50 backdrop-blur-2xl rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xl shadow-black/5 dark:shadow-black/60 transition-colors duration-300">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">Profile Details</h3>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 font-medium">Your protected session information.</p>
            </div>
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide shrink-0">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Session Active
            </span>
          </div>

          {/* Details */}
          <div className="border-t border-zinc-200 dark:border-zinc-800/50 pt-6 transition-colors duration-300">
            <dl className="space-y-3">
              {/* Name & Email */}
              {[
                { label: "Full name", value: session.user?.name || "Not provided" },
                { label: "Email address", value: session.user?.email },
              ].map((item) => (
                <div key={item.label} className="grid grid-cols-1 sm:grid-cols-3 sm:gap-4 p-4 sm:p-5 bg-white dark:bg-zinc-950/40 rounded-xl border border-zinc-200 dark:border-zinc-800/50 transition-colors duration-300">
                  <dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{item.label}</dt>
                  <dd className="mt-1 text-sm text-zinc-900 dark:text-zinc-100 sm:mt-0 sm:col-span-2 font-medium break-all">{item.value}</dd>
                </div>
              ))}

              {/* Authentication */}
              <div className="grid grid-cols-1 sm:grid-cols-3 sm:gap-4 p-4 sm:p-5 bg-white dark:bg-zinc-950/40 rounded-xl border border-zinc-200 dark:border-zinc-800/50 transition-colors duration-300">
                <dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Authentication</dt>
                <dd className="mt-1 sm:mt-0 sm:col-span-2 flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                    NextAuth (Credentials)
                  </span>
                  <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                    JWT Strategy
                  </span>
                </dd>
              </div>

              {/* Session ID (masked) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 sm:gap-4 p-4 sm:p-5 bg-white dark:bg-zinc-950/40 rounded-xl border border-zinc-200 dark:border-zinc-800/50 transition-colors duration-300">
                <dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Session ID</dt>
                <dd className="mt-1 sm:mt-0 sm:col-span-2">
                  <code className="text-xs font-mono text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-900 px-2 py-1 rounded-md">
                    {session.user?.email ? `${session.user.email.split('@')[0]}****` : 'anon****'}
                  </code>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </main>
    </div>
  );
}
