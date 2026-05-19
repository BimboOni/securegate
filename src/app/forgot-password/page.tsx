"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "An error occurred");
      } else {
        setStatus("success");
        setMessage(data.message);
      }
    } catch {
      setStatus("error");
      setMessage("An unexpected error occurred");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-zinc-900 tracking-tight">Reset your password</h2>
        <p className="mt-2 text-center text-sm text-zinc-600">
          Enter your email to receive a recovery link.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm sm:rounded-xl sm:px-10 border border-zinc-200">
          {status === "success" ? (
            <div className="text-center py-4">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-50 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm text-zinc-600 mb-6">{message}</p>
              <Link href="/login" className="text-sm font-medium text-zinc-900 hover:text-zinc-600 transition-colors">
                Return to sign in
              </Link>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit}>
              {status === "error" && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md">
                  <p className="text-sm text-red-700 font-medium">{message}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-zinc-700">Email address</label>
                <div className="mt-1">
                  <input
                    type="email"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-zinc-300 rounded-lg shadow-sm placeholder-zinc-400 focus:outline-none focus:ring-zinc-900 focus:border-zinc-900 sm:text-sm text-zinc-900 transition-colors"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {status === "loading" ? "Sending link..." : "Send reset link"}
                </button>
              </div>

              <div className="text-center text-sm pt-2">
                <Link href="/login" className="font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
                  Back to sign in
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
