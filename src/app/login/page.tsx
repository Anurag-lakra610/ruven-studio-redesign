"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { Eye, EyeOff } from "lucide-react";
import { CartProvider } from "@/context/CartContext";
import { Header } from "@/components/storefront/Header";

const T = {
  bgPage:       "#F5F3EE",
  bgWhite:      "#FFFFFF",
  dark:         "#1A1A18",
  muted:        "#888880",
  border:       "#C8C5BE",
  errorRed:     "#E24B4A",
  errorBg:      "#FCEBEB",
  errorBorder:  "#F09595",
  errorText:    "#A32D2D",
  successGreen: "#2D7D46",
  successBg:    "#EBF7EE",
  successBorder:"#9EDCA9",
  successText:  "#1C522D",
} as const;

const baseInput: React.CSSProperties = {
  border: `1px solid ${T.border}`,
  borderRadius: 0,
  background: T.bgWhite,
  height: "42px",
  padding: "0 12px",
  fontSize: "13px",
  color: T.dark,
  width: "100%",
  outline: "none",
  display: "block",
  boxSizing: "border-box",
  fontFamily: "inherit",
  transition: "border-color 0.15s ease",
};

const labelSt: React.CSSProperties = {
  fontSize: "11px",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  fontWeight: 500,
  color: "#555555",
  display: "block",
  marginBottom: "5px",
};

function LoginForm() {
  const router = useRouter();

  // Form values
  const [identifier, setIdentifier] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // UI state
  const [loading, setLoading] = useState(false);
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [isEmail, setIsEmail] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isDev, setIsDev] = useState(false);

  // Focused states
  const [idFocused, setIdFocused] = useState(false);
  const [otpFocused, setOtpFocused] = useState(false);

  // Error & Success states
  const [idError, setIdError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [authError, setAuthError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const h = window.location.hostname;
    setIsDev(h === "localhost" || h === "127.0.0.1" || window.location.port !== "");

    // Load remember me settings
    const savedId = localStorage.getItem("ruven_remembered_identifier");
    const savedRememberMe = localStorage.getItem("ruven_remember_me") === "true";
    if (savedRememberMe && savedId) {
      setIdentifier(savedId);
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // Validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+?91\s?\d{10}$|^\d{10}$/; // Indian style or general 10 digit

  const isIdValid = emailRegex.test(identifier.trim()) || phoneRegex.test(identifier.trim().replace(/\s/g, ""));
  const isOtpValid = otpCode.trim().length === 6 && /^\d+$/.test(otpCode.trim());

  const handleGetOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setSuccessMessage("");
    setIdError("");

    const val = identifier.trim();
    if (!val) {
      setIdError("Email address or phone number is required.");
      return;
    }

    const cleanPhone = val.replace(/\s/g, "");
    const emailCheck = emailRegex.test(val);
    const phoneCheck = phoneRegex.test(cleanPhone);

    if (!emailCheck && !phoneCheck) {
      setIdError("Please enter a valid email address or phone number.");
      return;
    }

    setIsEmail(emailCheck);
    setLoading(true);

    // Save/clear remember me settings
    if (rememberMe) {
      localStorage.setItem("ruven_remembered_identifier", val);
      localStorage.setItem("ruven_remember_me", "true");
    } else {
      localStorage.removeItem("ruven_remembered_identifier");
      localStorage.removeItem("ruven_remember_me");
    }

    // Dev/Sandbox bypass checks
    const isDummy =
      process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("dummy") ||
      !process.env.NEXT_PUBLIC_SUPABASE_URL;

    // Check if it is a phone number (always mock SMS OTP since phone SMS is not free)
    if (!emailCheck) {
      // It is a phone number!
      await new Promise<void>((res) => setTimeout(res, 800));
      setShowOtpScreen(true);
      setCountdown(60);
      setLoading(false);
      return;
    }

    // It is an email address
    if (isDummy || val === "admin@ruven.in" || val === "customer@ruven.in") {
      await new Promise<void>((res) => setTimeout(res, 800));
      setShowOtpScreen(true);
      setCountdown(60);
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
      const { error: authErr } = await supabase.auth.signInWithOtp({
        email: val,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: `${siteUrl}/auth/callback`,
        }
      });
      if (authErr) throw authErr;

      setShowOtpScreen(true);
      setCountdown(60);
      setLoading(false);
    } catch (err: any) {
      setAuthError(err.message || "Failed to send code. Please try again.");
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError("");
    setAuthError("");

    if (!otpCode.trim()) {
      setOtpError("OTP code is required.");
      return;
    } else if (otpCode.trim().length !== 6) {
      setOtpError("OTP code must be exactly 6 digits.");
      return;
    }

    setLoading(true);

    const isDummy =
      process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("dummy") ||
      !process.env.NEXT_PUBLIC_SUPABASE_URL;

    const val = identifier.trim();

    // 1. Phone number login verification (Mock)
    if (!isEmail) {
      await new Promise<void>((res) => setTimeout(res, 1000));
      if (otpCode === "123456" || otpCode.length === 6) {
        document.cookie = "mock_customer_session=true; path=/; max-age=86400";
        document.cookie = `mock_user_email=${val}; path=/; max-age=86400`;
        document.cookie = "mock_user_name=Phone Customer; path=/; max-age=86400";
        router.push("/account");
      } else {
        setOtpError("Incorrect OTP code. Try 123456.");
        setLoading(false);
      }
      return;
    }

    // 2. Sandbox bypass login
    if (isDummy || val === "admin@ruven.in" || val === "customer@ruven.in") {
      await new Promise<void>((res) => setTimeout(res, 1000));
      if (otpCode === "123456" || otpCode.length === 6) {
        if (val === "admin@ruven.in") {
          document.cookie = "mock_admin_session=true; path=/; max-age=86400";
          document.cookie = "mock_user_email=admin@ruven.in; path=/; max-age=86400";
          document.cookie = "mock_user_name=Super Admin; path=/; max-age=86400";
          router.push("/admin");
        } else {
          document.cookie = "mock_customer_session=true; path=/; max-age=86400";
          document.cookie = `mock_user_email=${val}; path=/; max-age=86400`;
          const derivedName = val.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, c => c.toUpperCase());
          document.cookie = `mock_user_name=${derivedName}; path=/; max-age=86400`;
          router.push("/account");
        }
      } else {
        setOtpError("Incorrect OTP. Try 123456.");
        setLoading(false);
      }
      return;
    }

    // 3. Real email login verification
    try {
      const supabase = createClient();
      const { error: authErr } = await supabase.auth.verifyOtp({
        email: val,
        token: otpCode.trim(),
        type: 'email'
      });
      if (authErr) throw authErr;

      router.push("/account");
    } catch (err: any) {
      setOtpError(err.message || "Incorrect verification code. Please try again.");
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    setAuthError("");
    setOtpError("");
    setCountdown(60);

    const val = identifier.trim();
    const isDummy =
      process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("dummy") ||
      !process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (isDummy || !isEmail || val === "admin@ruven.in" || val === "customer@ruven.in") {
      return;
    }

    try {
      const supabase = createClient();
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
      const { error } = await supabase.auth.signInWithOtp({
        email: val,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: `${siteUrl}/auth/callback`,
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setAuthError(err.message || "Failed to resend code. Please try again.");
    }
  };

  const handleGoogleSignIn = async () => {
    const isDummy =
      process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("dummy") ||
      !process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (isDummy) {
      setLoading(true);
      await new Promise<void>((res) => setTimeout(res, 800));
      document.cookie = "mock_customer_session=true; path=/; max-age=86400";
      document.cookie = "mock_user_email=google.user@gmail.com; path=/; max-age=86400";
      document.cookie = "mock_user_name=Google Tester; path=/; max-age=86400";
      router.push("/account");
      return;
    }
    try {
      const supabase = createClient();
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${siteUrl}/auth/callback` },
      });
    } catch {
      setAuthError("Google sign-in failed. Please try again.");
    }
  };

  const clearAuthError = () => { if (authError) setAuthError(""); };

  const idBorder = idError ? T.errorRed : isIdValid ? T.successGreen : idFocused ? T.dark : T.border;

  return (
    <>
      <style>{`
        @keyframes ruven-spin {
          to { transform: rotate(360deg); }
        }
        .ruven-spin {
          animation: ruven-spin 0.7s linear infinite;
        }
        .back-link { color: ${T.muted}; transition: color 0.15s ease; }
        .back-link:hover { color: ${T.dark}; }
        .google-btn { transition: background 0.15s ease, border-color 0.15s ease; }
        .google-btn:hover { background: #F9F9F9 !important; border-color: ${T.dark} !important; }
        @media (max-width: 767px) {
          .login-left-panel { display: none !important; }
          .login-right-panel { width: 100% !important; padding: 32px 24px !important; }
          .login-inner { padding: 0 !important; }
        }
      `}</style>

      <div style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 0 }}>
        {/* LEFT EDITORIAL PANEL */}
        <div
          className="login-left-panel"
          style={{
            width: "45%",
            flexShrink: 0,
            position: "relative",
            overflow: "hidden",
            background: "#2A2820",
          }}
        >
          <img
            src="/hero_lifestyle.png"
            alt=""
            aria-hidden="true"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/brand_story_editorial.png";
            }}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              display: "block",
            }}
          />
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(26,24,19,0.90) 0%, rgba(26,24,19,0.35) 50%, rgba(26,24,19,0.10) 100%)",
              zIndex: 1,
            }}
          />
          <div style={{ position: "absolute", bottom: "40px", left: "32px", right: "32px", zIndex: 2 }}>
            <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(255,255,255,0.50)", margin: "0 0 10px 0" }}>
              Armor of Light Drop &apos;26
            </p>
            <blockquote style={{ margin: 0, padding: 0, border: "none", fontFamily: 'Georgia, "Times New Roman", serif', color: T.bgWhite }}>
              <p style={{ fontSize: "18px", fontWeight: 400, lineHeight: 1.4, letterSpacing: "-0.01em", margin: "0 0 8px 0", fontStyle: "italic" }}>
                &ldquo;Cast off the works of darkness and put on the armor of light.&rdquo;
              </p>
              <footer style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(255,255,255,0.60)" }}>
                &mdash; Romans 13:12
              </footer>
            </blockquote>
          </div>
        </div>

        {/* RIGHT FORM PANEL */}
        <div
          className="login-right-panel"
          style={{
            flex: 1,
            background: T.bgWhite,
            overflowY: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 24px",
            fontFamily: 'var(--font-sans)',
          }}
        >
          <div className="login-inner" style={{ width: "100%", maxWidth: "380px", padding: "48px 40px", background: T.bgWhite }}>
            <Link href="/shop" className="back-link" style={{ fontSize: "12px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px", cursor: "pointer", marginBottom: "32px" }}>
              &larr; Back to shop
            </Link>

            {showOtpScreen ? (
              <>
                <h1 style={{ fontSize: "28px", fontWeight: 600, color: T.dark, letterSpacing: "-0.025em", lineHeight: 1.2, margin: "0 0 6px 0" }}>
                  Verify code.
                </h1>
                <p style={{ fontSize: "13px", color: T.muted, lineHeight: 1.5, margin: "0 0 32px 0" }}>
                  {!isEmail ? (
                    <span style={{ color: T.successText, background: T.successBg, border: `1px solid ${T.successBorder}`, padding: "6px 8px", display: "block", fontSize: "11px", marginBottom: "16px" }}>
                      <strong>Demo SMS Mode</strong>: Phone verification is simulated. Enter **123456** to verify.
                    </span>
                  ) : (
                    <span>We sent a 6-digit confirmation code to <strong style={{ color: T.dark }}>{identifier}</strong>. Please enter it below.</span>
                  )}
                </p>

                <form onSubmit={handleVerifyOtp} noValidate>
                  {/* Global Error Banner */}
                  {authError && (
                    <div role="alert" style={{ background: T.errorBg, border: `1px solid ${T.errorBorder}`, padding: "10px 14px", marginBottom: "16px", fontSize: "12px", color: T.errorText }}>
                      {authError}
                    </div>
                  )}

                  {/* OTP Code */}
                  <div style={{ marginBottom: "24px" }}>
                    <label htmlFor="login-otp" style={labelSt}>6-Digit Code</label>
                    <input
                      id="login-otp"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      placeholder="123456"
                      value={otpCode}
                      onChange={(e) => { setOtpCode(e.target.value); if (otpError) setOtpError(""); }}
                      onFocus={() => setOtpFocused(true)}
                      onBlur={() => setOtpFocused(false)}
                      aria-describedby={otpError ? "login-otp-error" : undefined}
                      aria-invalid={otpError ? "true" : "false"}
                      style={{ ...baseInput, letterSpacing: otpCode ? "0.5em" : "normal", textAlign: otpCode ? "center" : "left", fontSize: otpCode ? "18px" : "13px", borderColor: otpError ? T.errorRed : isOtpValid ? T.successGreen : otpFocused ? T.dark : T.border }}
                    />
                    {otpError && <span id="login-otp-error" role="alert" style={{ display: "block", fontSize: "11px", color: T.errorRed, marginTop: "4px" }}>{otpError}</span>}
                  </div>

                  {/* Verify Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      background: T.dark,
                      color: "#FFFFFF",
                      borderRadius: 0,
                      height: "44px",
                      width: "100%",
                      fontSize: "13px",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      fontWeight: 500,
                      border: "none",
                      cursor: loading ? "not-allowed" : "pointer",
                      opacity: loading ? 0.7 : 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      marginBottom: "20px",
                      transition: "opacity 0.15s ease",
                    }}
                  >
                    {loading ? (
                      <>
                        <span className="ruven-spin" style={{ width: "14px", height: "14px", border: "1.5px solid rgba(255,255,255,0.35)", borderTopColor: "#FFFFFF", borderRadius: "50%", display: "inline-block" }} />
                        Verifying code…
                      </>
                    ) : (
                      "Verify & Login"
                    )}
                  </button>

                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginTop: "16px" }}>
                    {isEmail ? (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={countdown > 0}
                        style={{
                          background: "none",
                          border: "none",
                          color: countdown > 0 ? T.muted : T.dark,
                          cursor: countdown > 0 ? "not-allowed" : "pointer",
                          textDecoration: countdown > 0 ? "none" : "underline",
                          padding: 0,
                          fontFamily: "inherit"
                        }}
                      >
                        {countdown > 0 ? `Resend Code (${countdown}s)` : "Resend Code"}
                      </button>
                    ) : (
                      <span style={{ color: T.muted }}>SMS Code Sandbox</span>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowOtpScreen(false)}
                      style={{
                        background: "none",
                        border: "none",
                        color: T.muted,
                        cursor: "pointer",
                        textDecoration: "underline",
                        padding: 0,
                        fontFamily: "inherit"
                      }}
                    >
                      Change Details
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <h1 style={{ fontSize: "28px", fontWeight: 600, color: T.dark, letterSpacing: "-0.025em", lineHeight: 1.2, margin: "0 0 6px 0" }}>
                  Welcome back.
                </h1>
                <p style={{ fontSize: "13px", color: T.muted, lineHeight: 1.5, margin: "0 0 36px 0" }}>
                  Sign in to your Ruven Studio account.
                </p>

                <form onSubmit={handleGetOtp} noValidate>
                  {/* Global Error Banner */}
                  {authError && (
                    <div role="alert" style={{ background: T.errorBg, border: `1px solid ${T.errorBorder}`, padding: "10px 14px", marginBottom: "16px", fontSize: "12px", color: T.errorText }}>
                      {authError}
                    </div>
                  )}

                  {/* Identifier */}
                  <div style={{ marginBottom: "20px" }}>
                    <label htmlFor="login-identifier" style={labelSt}>Email address or Phone number</label>
                    <input
                      id="login-identifier"
                      type="text"
                      placeholder="you@email.com or 9876543210"
                      value={identifier}
                      onChange={(e) => {
                        setIdentifier(e.target.value);
                        if (idError) setIdError("");
                        clearAuthError();
                      }}
                      onFocus={() => setIdFocused(true)}
                      onBlur={() => setIdFocused(false)}
                      aria-describedby={idError ? "login-identifier-error" : undefined}
                      aria-invalid={idError ? "true" : "false"}
                      style={{ ...baseInput, borderColor: idBorder }}
                    />
                    {idError && <span id="login-identifier-error" role="alert" style={{ display: "block", fontSize: "11px", color: T.errorRed, marginTop: "4px" }}>{idError}</span>}
                  </div>

                  {/* Links Row */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px", marginBottom: "28px" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "11px", color: "#666666", userSelect: "none" }}>
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        style={{ accentColor: T.dark, cursor: "pointer" }}
                      />
                      Remember me
                    </label>
                  </div>

                  {/* Get OTP Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      background: T.dark,
                      color: "#FFFFFF",
                      borderRadius: 0,
                      height: "44px",
                      width: "100%",
                      fontSize: "13px",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      fontWeight: 500,
                      border: "none",
                      cursor: loading ? "not-allowed" : "pointer",
                      opacity: loading ? 0.7 : 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      marginBottom: "20px",
                      transition: "opacity 0.15s ease",
                    }}
                  >
                    {loading ? (
                      <>
                        <span className="ruven-spin" style={{ width: "14px", height: "14px", border: "1.5px solid rgba(255,255,255,0.35)", borderTopColor: "#FFFFFF", borderRadius: "50%", display: "inline-block" }} />
                        Sending code…
                      </>
                    ) : (
                      "Get OTP"
                    )}
                  </button>

                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                    <div style={{ flex: 1, height: "0.5px", background: T.border }} />
                    <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.05em", color: T.muted }}>OR</span>
                    <div style={{ flex: 1, height: "0.5px", background: T.border }} />
                  </div>

                  {/* Google OAuth Button */}
                  <button
                    type="button"
                    className="google-btn"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    style={{
                      background: "transparent",
                      border: `1px solid ${T.border}`,
                      borderRadius: 0,
                      height: "40px",
                      width: "100%",
                      fontSize: "12px",
                      color: "#555555",
                      cursor: loading ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                      marginBottom: "24px",
                      opacity: loading ? 0.7 : 1,
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Continue with Google
                  </button>

                  <p style={{ textAlign: "center", fontSize: "12px", color: T.muted, margin: 0 }}>
                    Don&apos;t have an account?
                    <Link
                      href="/register"
                      style={{ color: T.dark, fontWeight: 600, textDecoration: "underline", marginLeft: "4px" }}
                    >
                      Create account
                    </Link>
                  </p>

                  {/* Sandbox credentials */}
                  {isDev && (
                    <div style={{ marginTop: "32px", background: "#F9F9F9", border: `1px solid #EAEAEA`, padding: "14px 16px", fontSize: "10px", color: "#666", lineHeight: 1.7 }}>
                      <strong style={{ display: "block", marginBottom: "8px", color: "#333", textTransform: "uppercase", letterSpacing: "0.06em", fontSize: "9px" }}>
                        Sandbox Testing
                      </strong>
                      <div>Real Email OTP: Enter your email &rarr; check your inbox.</div>
                      <div>Demo Accounts: Use <strong style={{ color: T.dark }}>admin@ruven.in</strong> or <strong style={{ color: T.dark }}>customer@ruven.in</strong> &rarr; code is always <strong style={{ color: T.dark }}>123456</strong>.</div>
                      <div>Demo Phone OTP: Enter any 10-digit mobile number &rarr; code is always <strong style={{ color: T.dark }}>123456</strong>.</div>
                    </div>
                  )}
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default function LoginPage() {
  return (
    <CartProvider>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#FFFFFF", overflowX: "hidden" }}>
        <Header />
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          <LoginForm />
        </div>
      </div>
    </CartProvider>
  );
}
