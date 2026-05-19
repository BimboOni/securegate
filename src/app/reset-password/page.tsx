"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setStatus("error");
      setMessage("Missing reset token");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "An error occurred");
      } else {
        setStatus("success");
        setMessage("Password has been reset successfully.");
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    } catch {
      setStatus("error");
      setMessage("An unexpected error occurred");
    }
  };

  return (
    <div className="bg-white py-8 px-4 shadow-sm sm:rounded-xl sm:px-10 border border-zinc-200">
      {status === "success" ? (
        <div className="text-center py-4">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-50 mb-4">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-sm font-medium text-zinc-900">{message}</p>
          <p className="text-xs text-zinc-500 mt-2">Redirecting to login automatically...</p>
        </div>
      ) : (
        <form className="space-y-5" onSubmit={handleSubmit}>
          {status === "error" && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md">
              <p className="text-sm text-red-700 font-medium">{message}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-zinc-700">New Password</label>
            <div className="mt-1">
              <input
                type="password"
                required
                className="appearance-none block w-full px-3 py-2 border border-zinc-300 rounded-lg shadow-sm placeholder-zinc-400 focus:outline-none focus:ring-zinc-900 focus:border-zinc-900 sm:text-sm text-zinc-900 transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <p className="mt-2 text-xs text-zinc-500">Must be at least 8 characters long.</p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={status === "loading" || !token}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {status === "loading" ? "Resetting password..." : "Set new password"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-zinc-900 tracking-tight">Create new password</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Suspense fallback={<div className="text-center text-sm text-zinc-500 py-8">Loading form...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}