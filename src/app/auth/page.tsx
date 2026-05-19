"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

type AuthView = "login" | "register" | "forgot";

interface FormData {
  name: string;
  email: string;
  password: string;
}

interface FieldErrors {
  name: string;
  email: string;
  password: string;
}

const PASSWORD_REQUIREMENTS = [
  { label: "Minimum 8 characters", test: (p: string) => p.length >= 8 },
  { label: "Contains uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Contains lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { label: "Contains a number", test: (p: string) => /[0-9]/.test(p) },
  { label: "Contains a special character", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [view, setView] = useState<AuthView>("login");
  const [formData, setFormData] = useState<FormData>({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({ name: "", email: "", password: "" });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [forgotStatus, setForgotStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [forgotMessage, setForgotMessage] = useState("");
  const [redirecting, setRedirecting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const v = searchParams.get("view");
    if (v === "register" || v === "login" || v === "forgot") setView(v);
    if (searchParams.get("registered") === "true") setView("login");
  }, [searchParams]);

  useEffect(() => {
    if (view === "register") nameRef.current?.focus();
  }, [view]);

  const unmetRequirements = PASSWORD_REQUIREMENTS.filter((r) => !r.test(formData.password));
  const visibleRequirement = formData.password && unmetRequirements.length > 0 ? unmetRequirements[0] : null;
  const canRegister = PASSWORD_REQUIREMENTS.every((r) => r.test(formData.password));

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "name":
        if (!value.trim()) return "";
        if (value.trim().length < 3) return "Full name must be at least 3 characters";
        return "";
      case "email":
        if (!value.trim()) return "";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter A Valid Email Address";
        return "";
      case "password":
        if (!value) return "";
        return "";
      default:
        return "";
    }
  };

  const getEmptyError = (name: string): string => {
    switch (name) {
      case "name": return "This field cannot be empty";
      case "email": return "This field cannot be empty";
      case "password": return "This field cannot be empty";
      default: return "Field cannot be empty";
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    if (!submitted) return;
    if (!value.trim()) setFieldErrors((prev) => ({ ...prev, [name]: getEmptyError(name) }));
    else setFieldErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (!submitted) return;

    if (name === "email") {
      if (!value.trim()) setFieldErrors((prev) => ({ ...prev, email: "" }));
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) setFieldErrors((prev) => ({ ...prev, email: "Enter A Valid Email Address" }));
      else setFieldErrors((prev) => ({ ...prev, email: "" }));
      return;
    }

    if (name === "name") {
      if (!value.trim()) setFieldErrors((prev) => ({ ...prev, name: "" }));
      else if (value.trim().length < 3) setFieldErrors((prev) => ({ ...prev, name: "Full name must be at least 3 characters" }));
      else setFieldErrors((prev) => ({ ...prev, name: "" }));
      return;
    }

    if (name === "password") {
      setFieldErrors((prev) => ({ ...prev, password: "" }));
    }
  };

  const switchView = (newView: AuthView) => {
    setView(newView);
    setError("");
    setFieldErrors({ name: "", email: "", password: "" });
    setTouched({});
    setForgotStatus("idle");
    setForgotMessage("");
    setFormData({ name: "", email: "", password: "" });
    setShowPassword(false);
    setSubmitted(false);
  };

  const submitIfValid = (): boolean => {
    setSubmitted(true);
    const errors: FieldErrors = { name: "", email: "", password: "" };
    let hasError = false;
    if (view === "register") {
      if (!formData.name.trim()) { errors.name = "Field cannot be empty"; hasError = true; }
      else if (formData.name.trim().length < 3) { errors.name = "Full name must be at least 3 characters"; hasError = true; }
    }
    if (!formData.email.trim()) { errors.email = "Field cannot be empty"; hasError = true; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) { errors.email = "Enter A Valid Email Address"; hasError = true; }
    if (view === "register" || view === "login") {
      if (!formData.password.trim()) { errors.password = "Field cannot be empty"; hasError = true; }
      else if (view === "register" && !canRegister) { errors.password = "Meet all password requirements"; hasError = true; }
    }
    setFieldErrors(errors);
    setTouched({ name: true, email: true, password: true });
    return !hasError;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setError("");
    if (!submitIfValid()) return;
    setLoading(true);
    try {
      const res = await signIn("credentials", { redirect: false, email: formData.email, password: formData.password });
      if (res?.error) {
        const errorMap: Record<string, string> = {
          CredentialsSignin: "Invalid email or password. Please try again.",
        };
        setError(errorMap[res.error] || "Authentication failed. Please check your credentials.");
      } else {
        setRedirecting(true);
        await new Promise((r) => setTimeout(r, 500));
        router.push("/dashboard");
        router.refresh();
      }
    } catch { setError("An unexpected error occurred");
    } finally { setLoading(false); setRedirecting(false); }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); setError("");
    if (!submitIfValid()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      const data = await res.json();
      if (!res.ok) setError(data.error || "Failed to register");
      else router.push("/auth?registered=true");
    } catch { setError("An unexpected error occurred");
    } finally { setLoading(false); }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault(); setError("");
    setSubmitted(true);
    if (!formData.email.trim()) { setFieldErrors((prev) => ({ ...prev, email: "Field cannot be empty" })); setTouched((prev) => ({ ...prev, email: true })); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) { setFieldErrors((prev) => ({ ...prev, email: "Enter A Valid Email Address" })); setTouched((prev) => ({ ...prev, email: true })); return; }
    setForgotStatus("loading"); setForgotMessage("");
    try {
      const res = await fetch("/api/auth/forgot-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: formData.email }) });
      const data = await res.json();
      if (!res.ok) { setForgotStatus("error"); setForgotMessage(data.error || "An error occurred"); }
      else { setForgotStatus("success"); setForgotMessage(data.message); }
    } catch { setForgotStatus("error"); setForgotMessage("An unexpected error occurred"); }
  };

  const inputBaseClass =
    "appearance-none block w-full px-4 py-3.5 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-transparent text-sm transition-all duration-500 hover:border-blue-500/40 hover:duration-[400ms]";

  const inputErrorClass = (field: keyof FieldErrors) =>
    fieldErrors[field] ? "border-rose-500/40 focus:ring-rose-500/20" : "";

  const inputClass = (field: keyof FieldErrors, extra = "") =>
    `${inputBaseClass} ${inputErrorClass(field)} ${extra}`;

  const emailInputClass = (field: keyof FieldErrors, extra = "") =>
    `${inputBaseClass} ${inputErrorClass(field)} ${extra}`;

  return (
    <div className="w-full max-w-[clamp(16rem,38vw,24rem)]">
      <h2 className="text-[clamp(1.25rem,3vw,1.75rem)] font-semibold text-zinc-100 tracking-tight mb-8">
        {view === "login" ? "Welcome back" : view === "register" ? "Create your account" : "Reset your password"}
      </h2>

      {view === "forgot" && forgotStatus === "success" ? (
        <div className="text-center py-6">
          <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-blue-500/10 mb-5 border border-blue-500/20">
            <svg className="h-7 w-7 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-sm text-zinc-300 mb-4 leading-relaxed">{forgotMessage}</p>
          <button type="button" onClick={() => switchView("login")} className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors cursor-pointer">
            Return to sign in
          </button>
        </div>
      ) : (
        <form className="space-y-5" onSubmit={view === "login" ? handleLogin : view === "register" ? handleRegister : handleForgotPassword} noValidate>
          {error && (
            <div className="bg-rose-500/5 border border-rose-500/15 px-4 py-3 rounded-xl">
              <p className="text-xs text-rose-400 font-medium">{error}</p>
            </div>
          )}
          {view === "forgot" && forgotStatus === "error" && (
            <div className="bg-rose-500/5 border border-rose-500/15 px-4 py-3 rounded-xl">
              <p className="text-xs text-rose-400 font-medium">{forgotMessage}</p>
            </div>
          )}

          {view === "register" && (
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Enter full name</label>
              <input ref={nameRef} autoFocus type="text" name="name" placeholder="Full name" required className={inputClass("name")} value={formData.name} onBlur={handleBlur} onChange={handleChange} />
              {submitted && fieldErrors.name && <p className="text-xs text-rose-400 mt-2 transition-all duration-200">{fieldErrors.name}</p>}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Enter email</label>
            <input type="email" name="email" placeholder="Email address" required className={emailInputClass("email")} value={formData.email} onBlur={handleBlur} onChange={handleChange} />
            {submitted && fieldErrors.email && <p className="text-xs text-rose-400 mt-2 transition-all duration-200">{fieldErrors.email}</p>}
          </div>

          {(view === "login" || view === "register") && (
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Enter password</label>
              <div className="relative rounded-xl shadow-sm">
                <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" required className={inputClass("password", "pr-14")} value={formData.password} onBlur={handleBlur} onChange={handleChange} />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-zinc-500 hover:text-zinc-300 focus:outline-none cursor-pointer p-1">
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
              {view === "register" && formData.password && visibleRequirement && (
                <div className="mt-3">
                  <p className="text-xs text-zinc-400 transition-all duration-200">{visibleRequirement.label}</p>
                </div>
              )}
              {submitted && fieldErrors.password && <p className="text-xs text-rose-400 mt-2 transition-all duration-200">{fieldErrors.password}</p>}
              {view === "login" && (
                <div className="flex justify-end mt-3">
                  <button type="button" onClick={() => switchView("forgot")} className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors cursor-pointer">
                    Forgot your password?
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="pt-3">
            <button type="submit" disabled={loading || forgotStatus === "loading" || redirecting} className="w-full flex justify-center py-3.5 px-6 border border-transparent rounded-xl shadow-lg shadow-blue-500/5 text-sm bg-zinc-100 text-zinc-950 font-semibold hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 cursor-pointer active:scale-[0.98]">
              {redirecting ? "Redirecting..." : loading ? "Processing..." : forgotStatus === "loading" ? "Sending link..." : view === "login" ? "Continue" : view === "register" ? "Create Account" : "Send reset link"}
            </button>
          </div>

          {view === "login" && (
            <div className="text-center text-sm pt-1">
              <span className="text-zinc-500">Don&apos;t have an account? </span>
              <button type="button" onClick={() => switchView("register")} className="font-medium text-blue-400 hover:text-blue-300 transition-colors cursor-pointer">
                Sign up
              </button>
            </div>
          )}
          {view === "register" && (
            <div className="text-center text-sm pt-1">
              <span className="text-zinc-500">Already have an account? </span>
              <button type="button" onClick={() => switchView("login")} className="font-medium text-blue-400 hover:text-blue-300 transition-colors cursor-pointer">
                Sign in
              </button>
            </div>
          )}
          {view === "forgot" && (
            <div className="text-center text-sm pt-1">
              <button type="button" onClick={() => switchView("login")} className="font-medium text-blue-400 hover:text-blue-300 transition-colors cursor-pointer">
                Back to sign in
              </button>
            </div>
          )}
        </form>
      )}
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="w-full max-w-[clamp(16rem,38vw,24rem)] text-center">
        <p className="text-sm text-zinc-500">Loading...</p>
      </div>
    }>
      <AuthContent />
    </Suspense>
  );
}
