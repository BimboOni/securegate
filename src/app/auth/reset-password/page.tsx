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
  const [showPassword, setShowPassword] = useState(false);
  const [fieldError, setFieldError] = useState("");
  const [touched, setTouched] = useState(false);

  const validatePassword = (value: string): string => {
    if (!value) return "Password is required";
    if (value.length < 8) return "Password must be at least 8 characters";
    return "";
  };

  const handleBlur = () => {
    setTouched(true);
    setFieldError(validatePassword(password));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (touched) {
      setFieldError(validatePassword(e.target.value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);

    if (!token) {
      setStatus("error");
      setMessage("Missing reset token");
      return;
    }

    const err = validatePassword(password);
    setFieldError(err);
    if (err) return;

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
          router.push("/auth");
        }, 3000);
      }
    } catch {
      setStatus("error");
      setMessage("An unexpected error occurred");
    }
  };

  return (
    <div className="bg-zinc-900/40 py-10 px-6 sm:px-12 border border-zinc-800/50 backdrop-blur-2xl rounded-2xl shadow-2xl">
      {status === "success" ? (
        <div className="text-center py-4">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-500/10 mb-4 border border-blue-500/20">
            <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-sm font-medium text-zinc-100">{message}</p>
          <p className="text-xs text-zinc-400 mt-2">Redirecting to login automatically...</p>
        </div>
      ) : (
        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          {status === "error" && (
            <div className="bg-rose-500/5 border border-rose-500/15 px-4 py-3 rounded-xl">
              <p className="text-xs text-rose-400 font-medium">{message}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">New Password</label>
            <div className="relative rounded-xl shadow-sm">
              <input
                type={showPassword ? "text" : "password"}
                required
                className={`appearance-none block w-full px-4 py-3 bg-zinc-950/90 text-zinc-100 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 sm:text-sm pr-12 ${
                  fieldError ? "border-rose-500/40 focus:ring-rose-500/20" : "border-zinc-800 focus:ring-blue-600/50"
                }`}
                value={password}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-zinc-500 hover:text-zinc-300 focus:outline-none cursor-pointer"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <p className="mt-2 text-xs text-zinc-500">Must be at least 8 characters long.</p>
            {fieldError && (
              <p className="text-xs text-rose-400 mt-1.5 transition-all duration-200">{fieldError}</p>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={status === "loading" || !token}
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-500/5 text-sm bg-zinc-100 text-zinc-950 font-semibold hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 cursor-pointer active:scale-[0.98]"
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
    <div className="w-full sm:max-w-md mx-auto">
      <div className="mb-6">
        <h2 className="text-center text-lg font-medium text-zinc-400">Create new password</h2>
      </div>

      <Suspense fallback={<div className="text-center text-sm text-zinc-500 py-8">Loading form...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
