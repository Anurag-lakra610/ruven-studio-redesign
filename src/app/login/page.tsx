"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { AlertCircle, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDev, setIsDev] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      setIsDev(
        hostname === "localhost" ||
        hostname === "127.0.0.1" ||
        window.location.port !== ""
      );
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const isDummy = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("dummy") || !process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (mode === "signup") {
      if (isDummy) {
        setTimeout(() => {
          document.cookie = "mock_customer_session=true; path=/; max-age=86400";
          document.cookie = `mock_user_email=${email}; path=/; max-age=86400`;
          document.cookie = `mock_user_name=${name || "New User"}; path=/; max-age=86400`;
          router.push("/account");
        }, 1000);
        return;
      }
      try {
        const supabase = createClient();
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            }
          }
        });
        if (signUpError) throw signUpError;
        
        // Auto-login after sign-up for simple user flow
        document.cookie = "mock_customer_session=true; path=/; max-age=86400";
        document.cookie = `mock_user_email=${email}; path=/; max-age=86400`;
        document.cookie = `mock_user_name=${name || "New User"}; path=/; max-age=86400`;
        router.push("/account");
      } catch (err: any) {
        setError(err.message || "Registration failed. Please check credentials.");
        setLoading(false);
      }
      return;
    }

    // Sign in flow
    if (isDummy) {
      setTimeout(() => {
        if (email === "admin@ruven.in" && password === "admin123") {
          document.cookie = "mock_admin_session=true; path=/; max-age=86400";
          document.cookie = "mock_user_email=admin@ruven.in; path=/; max-age=86400";
          document.cookie = "mock_user_name=Super Admin; path=/; max-age=86400";
          router.push("/admin");
        } else if (email === "customer@ruven.in" && password === "customer123") {
          document.cookie = "mock_customer_session=true; path=/; max-age=86400";
          document.cookie = "mock_user_email=customer@ruven.in; path=/; max-age=86400";
          document.cookie = "mock_user_name=John Doe; path=/; max-age=86400";
          router.push("/account");
        } else {
          setError("Invalid sandbox credentials. Use admin@ruven.in / admin123 or customer@ruven.in / customer123");
          setLoading(false);
        }
      }, 1000);
      return;
    }

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (email.endsWith("@ruvenstudio.in") || email.endsWith("@ruven.in")) {
        router.push("/admin");
      } else {
        router.push("/account");
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please verify credentials.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 md:grid-cols-2 bg-bg-warm dark:bg-zinc-950 text-text-primary font-sans">
      {/* Left side: Editorial Image & Tagline (Hidden on mobile) */}
      <div className="relative hidden md:flex flex-col justify-between pt-24 pb-20 pl-28 pr-20 lg:pt-32 lg:pb-28 lg:pl-36 lg:pr-24 overflow-hidden bg-zinc-900 text-white z-10 border-r border-border-warm/10">
        <div className="absolute inset-0 z-0 opacity-80">
          <img
            src="/brand_story_editorial.png"
            alt="Ruven Studio Brand Campaign"
            className="w-full h-full object-cover"
          />
          {/* Elegant lightened overlay for typography contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/45" />
        </div>

        {/* Top brand signature - using logo_white.png as requested */}
        <div className="relative z-20">
          <Link href="/">
            <img
              src="/logo_white.png"
              alt="Ruven Studio Logo"
              className="h-8 lg:h-9 w-auto object-contain hover:opacity-80 transition-opacity"
            />
          </Link>
        </div>

        {/* Bottom tagline */}
        <div className="relative z-20 max-w-md space-y-6">
          <h2 className="text-4xl font-extrabold tracking-tight leading-tight uppercase font-sans">
            Faith, Woven Into<br />Everyday Life.
          </h2>
          <p className="text-xs text-zinc-300 font-light leading-relaxed tracking-wider">
            Every garment is crafted as a physical canvas for timeless truths—designed with quiet purpose for modern creative environments.
          </p>
        </div>

        {/* Footer info */}
        <div className="relative z-20 text-[10px] text-zinc-400 tracking-wider uppercase font-semibold">
          © {new Date().getFullYear()} Ruven Studio. All rights reserved.
        </div>
      </div>

      {/* Right side: Elegant Authentication Card */}
      <div className="flex items-center justify-center p-8 md:p-16 lg:p-24 bg-white dark:bg-zinc-950">
        <div className="w-full max-w-[420px] space-y-10">
          {/* Logo & Welcome Header */}
          <div className="space-y-6">
            <Link href="/" className="inline-flex items-center group">
              <img
                src="/logo.png"
                alt="Ruven Studio Logo"
                className="h-8 w-auto object-contain dark:hidden"
              />
              <img
                src="/logo_white.png"
                alt="Ruven Studio Logo"
                className="h-8 w-auto object-contain hidden dark:block"
              />
            </Link>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight text-text-primary uppercase">
                {mode === "signin" ? "Welcome Back" : "Create Account"}
              </h1>
              <p className="text-xs text-text-muted leading-relaxed">
                {mode === "signin"
                  ? "Sign in to continue to your Ruven Studio account."
                  : "Sign up to start your journey with Ruven Studio."}
              </p>
            </div>
          </div>

          {error && (
            <div className="border-l-2 border-brand-burgundy bg-red-50/50 dark:bg-red-950/10 p-4 flex items-start gap-3 text-xs text-red-600 dark:text-red-400 transition-all">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === "signup" && (
              /* Name Field */
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary block">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-[52px] px-4 text-xs bg-transparent border border-zinc-200 dark:border-zinc-800 focus:border-brand-burgundy dark:focus:border-brand-burgundy focus:ring-1 focus:ring-brand-burgundy outline-none transition-all rounded-none text-text-primary placeholder:text-text-light-muted font-sans"
                  placeholder="Enter your name"
                />
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary block">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-[52px] px-4 text-xs bg-transparent border border-zinc-200 dark:border-zinc-800 focus:border-brand-burgundy dark:focus:border-brand-burgundy focus:ring-1 focus:ring-brand-burgundy outline-none transition-all rounded-none text-text-primary placeholder:text-text-light-muted font-sans"
                placeholder="name@domain.com"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary block">
                  Password
                </label>
                {mode === "signin" && (
                  <Link href="#" className="text-[9px] uppercase font-bold text-text-muted hover:text-brand-burgundy transition-colors tracking-wider">
                    Forgot Password?
                  </Link>
                )}
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-[52px] px-4 text-xs bg-transparent border border-zinc-200 dark:border-zinc-800 focus:border-brand-burgundy dark:focus:border-brand-burgundy focus:ring-1 focus:ring-brand-burgundy outline-none transition-all rounded-none text-text-primary placeholder:text-text-light-muted font-sans"
                placeholder="••••••••"
              />
            </div>

            {/* Remember Me Toggle */}
            {mode === "signin" && (
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 accent-brand-burgundy rounded-none border-zinc-300 text-brand-burgundy focus:ring-0 focus:ring-offset-0"
                  />
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                    Remember Me
                  </span>
                </label>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-[52px] bg-brand-burgundy hover:bg-brand-burgundy-light text-white text-xs font-bold uppercase tracking-widest rounded-none transition-all flex items-center justify-center gap-2 cursor-pointer active:translate-y-[1px]"
            >
              <span>
                {loading
                  ? mode === "signin"
                    ? "Authenticating..."
                    : "Creating..."
                  : mode === "signin"
                  ? "Sign In"
                  : "Create Account"}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Switch flow link */}
          <div className="text-center pt-2">
            {mode === "signin" ? (
              <span className="text-xs text-text-muted">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setError("");
                  }}
                  className="font-semibold text-brand-burgundy hover:underline hover:text-brand-burgundy-light transition-colors"
                >
                  Create Account
                </button>
              </span>
            ) : (
              <span className="text-xs text-text-muted">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("signin");
                    setError("");
                  }}
                  className="font-semibold text-brand-burgundy hover:underline hover:text-brand-burgundy-light transition-colors"
                >
                  Sign In
                </button>
              </span>
            )}
          </div>

          {/* Info Helper Box for Sandbox Review */}
          {isDev && mode === "signin" && (
            <div className="bg-bg-card dark:bg-zinc-900/60 p-5 rounded-none border border-zinc-200 dark:border-zinc-800 space-y-3.5 text-[10px] text-text-muted leading-relaxed">
              <span className="font-bold text-text-primary uppercase tracking-wider block">
                Local Sandbox Testing Profiles:
              </span>
              <div className="space-y-2">
                <div>
                  <span className="font-semibold text-brand-burgundy uppercase block tracking-wider text-[9px] mb-0.5">
                    • Admin OS Access:
                  </span>
                  <span>
                    email: <strong className="text-text-primary">admin@ruven.in</strong> / pass: <strong className="text-text-primary">admin123</strong>
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-zinc-500 dark:text-zinc-400 uppercase block tracking-wider text-[9px] mb-0.5">
                    • Customer Storefront Access:
                  </span>
                  <span>
                    email: <strong className="text-text-primary">customer@ruven.in</strong> / pass: <strong className="text-text-primary">customer123</strong>
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
