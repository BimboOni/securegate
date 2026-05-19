"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="ml-4 px-4 py-2 border border-zinc-200 text-sm font-medium rounded-lg text-zinc-700 bg-white hover:bg-zinc-50 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900 transition-colors shadow-sm"
    >
      Sign Out
    </button>
  );
}
