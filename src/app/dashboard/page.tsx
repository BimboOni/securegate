import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import SignOutButton from "./SignOutButton";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-zinc-50 font-sans">
      <nav className="bg-white border-b border-zinc-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center gap-2">
                <div className="h-8 w-8 bg-zinc-900 rounded-lg flex items-center justify-center">
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h1 className="text-xl font-bold text-zinc-900 tracking-tight">SecureGate</h1>
              </div>
            </div>
            <div className="flex items-center">
              <SignOutButton />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-zinc-900">Welcome back{session.user?.name ? `, ${session.user.name}` : ''}</h2>
          <p className="mt-1 text-sm text-zinc-500">You have successfully authenticated via NextAuth.</p>
        </div>

        <div className="bg-white shadow-sm overflow-hidden sm:rounded-xl border border-zinc-200">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-zinc-900 tracking-tight">Profile Details</h3>
              <p className="mt-1 max-w-2xl text-sm text-zinc-500">Your protected session information.</p>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              Session Active
            </span>
          </div>
          <div className="border-t border-zinc-200">
            <dl>
              <div className="bg-zinc-50/50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-zinc-500">Full name</dt>
                <dd className="mt-1 text-sm text-zinc-900 sm:mt-0 sm:col-span-2 font-medium">{session.user?.name || "Not provided"}</dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-t border-zinc-200">
                <dt className="text-sm font-medium text-zinc-500">Email address</dt>
                <dd className="mt-1 text-sm text-zinc-900 sm:mt-0 sm:col-span-2 font-medium">{session.user?.email}</dd>
              </div>
              <div className="bg-zinc-50/50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-t border-zinc-200">
                <dt className="text-sm font-medium text-zinc-500">Authentication Layer</dt>
                <dd className="mt-1 text-sm text-zinc-900 sm:mt-0 sm:col-span-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-zinc-100 text-zinc-800 border border-zinc-200">
                    NextAuth (Credentials Provider)
                  </span>
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-t border-zinc-200">
                <dt className="text-sm font-medium text-zinc-500">Session Strategy</dt>
                <dd className="mt-1 text-sm text-zinc-900 sm:mt-0 sm:col-span-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                    JSON Web Token (JWT)
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </main>
    </div>
  );
}
