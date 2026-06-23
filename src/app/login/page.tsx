"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { Mail, Lock, AlertCircle, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const isDummy = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("dummy") || !process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (isDummy) {
      // Sandbox testing credentials check
      setTimeout(() => {
        if (email === "admin@ruven.in" && password === "admin123") {
          // Set mock admin session cookie (valid for 1 day)
          document.cookie = "mock_admin_session=true; path=/; max-age=86400";
          document.cookie = "mock_user_email=admin@ruven.in; path=/; max-age=86400";
          document.cookie = "mock_user_name=Super Admin; path=/; max-age=86400";
          router.push("/admin");
        } else if (email === "customer@ruven.in" && password === "customer123") {
          // Set mock customer session cookie
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
      <div className="relative hidden md:flex flex-col justify-between p-12 overflow-hidden bg-zinc-900 text-white z-10">
        <div className="absolute inset-0 z-0 opacity-85">
          <Image
            src="/brand_story_editorial.png"
            alt="Ruven Studio Brand Campaign"
            fill
            priority
            className="object-cover"
          />
          {/* Elegant overlay for typography contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/50" />
        </div>

        {/* Top brand signature */}
        <div className="relative z-10">
          <Link href="/" className="text-xs uppercase font-bold tracking-[0.3em] hover:opacity-80 transition-opacity">
            RUVEN STUDIO
          </Link>
        </div>

        {/* Bottom tagline */}
        <div className="relative z-10 max-w-md space-y-4">
          <h2 className="text-4xl font-extrabold tracking-tight leading-tight">
            Faith, Woven Into Everyday Life.
          </h2>
          <p className="text-sm text-zinc-300 font-light leading-relaxed">
            Every garment is crafted as a physical canvas for timeless truths—designed with quiet purpose for modern creative environments.
          </p>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-[10px] text-zinc-400 tracking-wider">
          © {new Date().getFullYear()} Ruven Studio. All rights reserved.
        </div>
      </div>

      {/* Right side: Elegant Authentication Card */}
      <div className="flex items-center justify-center p-6 md:p-12 lg:p-20 bg-white dark:bg-zinc-950">
        <div className="w-full max-w-[460px] space-y-8">
          {/* Logo & Welcome Header */}
          <div className="space-y-6">
            <Link href="/" className="inline-block">
              <Image
                src="/logo.png"
                alt="Ruven Studio Logo"
                width={100}
                height={40}
                className="h-[40px] w-auto object-contain dark:invert"
              />
            </Link>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-text-primary">Welcome Back</h1>
              <p className="text-xs text-text-muted">
                Sign in to continue to your Ruven account.
              </p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-none p-3.5 flex items-start gap-3.5 text-xs text-red-600 dark:text-red-400 transition-all">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-text-primary block">
                Email Address
              </label>
              <div className="relative flex items-center border border-border-warm bg-transparent h-[52px] px-4 focus-within:border-brand-burgundy transition-colors">
                <Mail className="w-4 h-4 text-text-muted mr-3.5 flex-shrink-0" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-full text-sm bg-transparent border-none p-0 focus:outline-none focus:ring-0 text-text-primary placeholder:text-text-light-muted"
                  placeholder="name@domain.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold uppercase tracking-wider text-text-primary block">
                  Password
                </label>
                <Link href="#" className="text-[9px] uppercase font-bold text-text-muted hover:text-brand-burgundy transition-colors tracking-wider">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative flex items-center border border-border-warm bg-transparent h-[52px] px-4 focus-within:border-brand-burgundy transition-colors">
                <Lock className="w-4 h-4 text-text-muted mr-3.5 flex-shrink-0" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-full text-sm bg-transparent border-none p-0 focus:outline-none focus:ring-0 text-text-primary placeholder:text-text-light-muted"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Remember Me Toggle */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 accent-brand-burgundy rounded-none border-border-warm text-brand-burgundy focus:ring-0 focus:ring-offset-0"
                />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                  Remember Me
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-[52px] bg-brand-burgundy hover:bg-brand-burgundy-light text-white text-xs font-bold uppercase tracking-widest rounded-none transition-all flex items-center justify-center gap-2 cursor-pointer hover:translate-y-[-1px] active:translate-y-0"
            >
              <span>{loading ? "Authenticating Session..." : "Continue"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Create Account Link / Alternative Action */}
          <div className="text-center pt-2">
            <span className="text-xs text-text-muted">
              Don't have an account?{" "}
              <Link href="#" className="font-semibold text-brand-burgundy hover:underline hover:text-brand-burgundy-light transition-colors">
                Create Account
              </Link>
            </span>
          </div>

          {/* Info Helper Box for Sandbox Review (Only shown on local development hostnames) */}
          {isDev && (
            <div className="bg-bg-card dark:bg-zinc-900/60 p-5 rounded-none border border-border-warm space-y-3.5 text-[10px] text-text-muted leading-relaxed">
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
                  <span className="font-semibold text-brand-gold uppercase block tracking-wider text-[9px] mb-0.5">
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
