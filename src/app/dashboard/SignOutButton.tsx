"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/auth" })}
      className="bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-800 hover:bg-blue-100 dark:hover:bg-blue-950/30 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-900/40 rounded-xl px-4 py-2 transition-all duration-300 cursor-pointer text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-900/50 active:scale-[0.98]"
    >
      Sign Out
    </button>
  );
}
