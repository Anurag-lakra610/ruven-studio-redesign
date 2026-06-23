"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { Eye, EyeOff } from "lucide-react";
import { CartProvider } from "@/context/CartContext";
import { Header } from "@/components/storefront/Header";

/* ─────────────────────────────────────────────
   Design Tokens — strictly from brand spec
───────────────────────────────────────────── */
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
} as const;

/* Shared style objects */
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

/* ─────────────────────────────────────────────
   Inner Login/SignUp Form (client logic lives here)
───────────────────────────────────────────── */
function LoginForm() {
  const router = useRouter();

  /* Form values */
  const [email,      setEmail]      = useState("");
  const [password,   setPassword]   = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isSignUp,   setIsSignUp]   = useState(false);

  /* UI state */
  const [showPassword, setShowPassword] = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [isDev,        setIsDev]        = useState(false);

  /* Focused states for border colour */
  const [emailFocused, setEmailFocused]   = useState(false);
  const [pwFocused,    setPwFocused]      = useState(false);

  /* Error states — three distinct types per spec */
  const [emailError,  setEmailError]  = useState("");
  const [pwError,     setPwError]     = useState("");
  const [authError,   setAuthError]   = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const h = window.location.hostname;
    setIsDev(h === "localhost" || h === "127.0.0.1" || window.location.port !== "");
  }, []);

  /* ── Validation ─────────────────────────── */
  const validateForm = useCallback((): boolean => {
    let ok = true;
    setEmailError("");
    setPwError("");

    if (!email.trim()) {
      setEmailError("Email address is required.");
      ok = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError("Please enter a valid email address.");
      ok = false;
    }

    if (!password) {
      setPwError("Password is required.");
      ok = false;
    } else if (isSignUp && password.length < 6) {
      setPwError("Password must be at least 6 characters.");
      ok = false;
    }

    return ok;
  }, [email, password, isSignUp]);

  /* ── Submit (Login / Sign Up) ────────────── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    if (!validateForm()) return;
    setLoading(true);

    const isDummy =
      process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("dummy") ||
      !process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (isDummy) {
      await new Promise<void>((res) => setTimeout(res, 1200));
      if (isSignUp) {
        // Mock successful sign up for any email
        document.cookie = "mock_customer_session=true; path=/; max-age=86400";
        document.cookie = `mock_user_email=${email.trim()}; path=/; max-age=86400`;
        const derivedName = email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, c => c.toUpperCase());
        document.cookie = `mock_user_name=${derivedName}; path=/; max-age=86400`;
        router.push("/account");
      } else {
        // Mock login
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
          // Allow custom mock email login in dev sandbox for convenience
          document.cookie = "mock_customer_session=true; path=/; max-age=86400";
          document.cookie = `mock_user_email=${email.trim()}; path=/; max-age=86400`;
          const derivedName = email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, c => c.toUpperCase());
          document.cookie = `mock_user_name=${derivedName}; path=/; max-age=86400`;
          router.push("/account");
        }
      }
      return;
    }

    try {
      const supabase = createClient();
      if (isSignUp) {
        // Real Supabase sign up
        const { data, error: authErr } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/account`,
          }
        });
        if (authErr) throw authErr;
        
        if (data?.session) {
          if (email.endsWith("@ruvenstudio.in") || email.endsWith("@ruven.in")) {
            router.push("/admin");
          } else {
            router.push("/account");
          }
        } else {
          setAuthError("Registration successful! Please check your email inbox to confirm your account.");
          setLoading(false);
        }
      } else {
        // Real Supabase sign in
        const { error: authErr } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (authErr) throw authErr;
        if (email.endsWith("@ruvenstudio.in") || email.endsWith("@ruven.in")) {
          router.push("/admin");
        } else {
          router.push("/account");
        }
      }
    } catch (err: any) {
      setAuthError(err.message || "Incorrect email or password. Please try again.");
      setLoading(false);
    }
  };

  /* ── Google OAuth (Mock / Real) ──────────── */
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
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/account` },
      });
    } catch {
      setAuthError("Google sign-in failed. Please try again.");
    }
  };

  /* ── Clear auth error when user edits either field ── */
  const clearAuthError = () => { if (authError) setAuthError(""); };

  /* ── Computed border colours ─────────────── */
  const emailBorder = emailError
    ? T.errorRed
    : emailFocused
    ? T.dark
    : T.border;

  const pwBorder = pwError
    ? T.errorRed
    : pwFocused
    ? T.dark
    : T.border;

  /* ───────────────────────────────────────────
     RENDER
     ─────────────────────────────────────────── */
  return (
    <>
      {/* Spinner keyframe — injected once */}
      <style>{`
        @keyframes ruven-spin {
          to { transform: rotate(360deg); }
        }
        .ruven-spin {
          animation: ruven-spin 0.7s linear infinite;
        }
        .back-link { color: ${T.muted}; transition: color 0.15s ease; }
        .back-link:hover { color: ${T.dark}; }
        .forgot-link { color: ${T.muted}; transition: color 0.15s ease; }
        .forgot-link:hover { color: ${T.dark}; }
        .google-btn { transition: background 0.15s ease, border-color 0.15s ease; }
        .google-btn:hover { background: #F9F9F9 !important; border-color: ${T.dark} !important; }
        @media (max-width: 767px) {
          .login-left-panel { display: none !important; }
          .login-right-panel { width: 100% !important; padding: 32px 24px !important; }
          .login-inner { padding: 0 !important; }
        }
      `}</style>

      <div style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 0 }}>

        {/* ──────────────────────────────────────
            LEFT EDITORIAL PANEL  (45%)
        ────────────────────────────────────── */}
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
          {/* Hero image */}
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

          {/* Gradient overlay */}
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

          {/* Scripture content block — bottom of panel */}
          <div
            style={{
              position: "absolute",
              bottom: "40px",
              left: "32px",
              right: "32px",
              zIndex: 2,
            }}
          >
            {/* Drop label */}
            <p
              style={{
                fontSize: "10px",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                color: "rgba(255,255,255,0.50)",
                margin: "0 0 10px 0",
              }}
            >
              Armor of Light Drop &apos;26
            </p>

            {/* Scripture quote */}
            <blockquote
              style={{
                margin: 0,
                padding: 0,
                border: "none",
                fontFamily: 'Georgia, "Times New Roman", serif',
                color: T.bgWhite,
              }}
            >
              <p
                style={{
                  fontSize: "18px",
                  fontWeight: 400,
                  lineHeight: 1.4,
                  letterSpacing: "-0.01em",
                  margin: "0 0 8px 0",
                  fontStyle: "italic",
                }}
              >
                &ldquo;Cast off the works of darkness and put on the armor of light.&rdquo;
              </p>
              <footer
                style={{
                  fontSize: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  color: "rgba(255,255,255,0.60)",
                }}
              >
                &mdash; Romans 13:12
              </footer>
            </blockquote>
          </div>
        </div>

        {/* ──────────────────────────────────────
            RIGHT FORM PANEL  (55%) - White Background
        ────────────────────────────────────── */}
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
            fontFamily: '"DM Sans", sans-serif',
          }}
        >
          {/* Inner content wrapper */}
          <div
            className="login-inner"
            style={{
              width: "100%",
              maxWidth: "380px",
              padding: "48px 40px",
              background: T.bgWhite,
            }}
          >
            {/* ── Back to shop ───────────────── */}
            <Link
              href="/shop"
              className="back-link"
              tabIndex={0}
              style={{
                fontSize: "12px",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                cursor: "pointer",
                marginBottom: "32px",
                fontFamily: "inherit",
              }}
            >
              &larr; Back to shop
            </Link>

            {/* ── Page heading ───────────────── */}
            <h1
              style={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: "28px",
                fontWeight: 600,
                color: T.dark,
                letterSpacing: "-0.025em",
                lineHeight: 1.2,
                margin: "0 0 6px 0",
              }}
            >
              {isSignUp ? "Create account." : "Welcome back."}
            </h1>

            {/* ── Sub-heading ────────────────── */}
            <p
              style={{
                fontSize: "13px",
                color: T.muted,
                lineHeight: 1.5,
                margin: "0 0 36px 0",
              }}
            >
              {isSignUp ? "Sign up for a Ruven Studio account." : "Sign in to your Ruven Studio account."}
            </p>

            {/* ══════════════════════════════════
                FORM
            ══════════════════════════════════ */}
            <form onSubmit={handleSubmit} noValidate>

              {/* ── Email field ────────────────── */}
              <div style={{ marginBottom: "20px" }}>
                <label htmlFor="login-email" style={labelSt}>
                  Email address
                </label>
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="you@email.com"
                  tabIndex={0}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError("");
                    clearAuthError();
                  }}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  aria-describedby="email-error"
                  aria-invalid={emailError ? "true" : "false"}
                  style={{ ...baseInput, borderColor: emailBorder }}
                />
                <span
                  id="email-error"
                  role="alert"
                  style={{
                    display: emailError ? "block" : "none",
                    fontSize: "11px",
                    color: T.errorRed,
                    marginTop: "4px",
                  }}
                >
                  {emailError}
                </span>
              </div>

              {/* ── Password field ─────────────── */}
              <div>
                <label htmlFor="login-password" style={labelSt}>
                  Password
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete={isSignUp ? "new-password" : "current-password"}
                    placeholder="••••••••"
                    tabIndex={0}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (pwError) setPwError("");
                      clearAuthError();
                    }}
                    onFocus={() => setPwFocused(true)}
                    onBlur={() => setPwFocused(false)}
                    aria-describedby="password-error"
                    aria-invalid={pwError ? "true" : "false"}
                    style={{
                      ...baseInput,
                      paddingRight: "44px",
                      borderColor: pwBorder,
                    }}
                  />
                  {/* Eye toggle */}
                  <button
                    type="button"
                    tabIndex={0}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((v) => !v)}
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      display: "flex",
                      alignItems: "center",
                      color: T.muted,
                      lineHeight: 1,
                    }}
                  >
                    {showPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
                <span
                  id="password-error"
                  role="alert"
                  style={{
                    display: pwError ? "block" : "none",
                    fontSize: "11px",
                    color: T.errorRed,
                    marginTop: "4px",
                  }}
                >
                  {pwError}
                </span>
              </div>

              {/* ── Links row ──────────────────── */}
              <div
                style={{
                  display: isSignUp ? "none" : "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "10px",
                  marginBottom: "28px",
                }}
              >
                {/* Remember me */}
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    cursor: "pointer",
                    fontSize: "11px",
                    color: "#666666",
                    fontFamily: "inherit",
                    userSelect: "none",
                  }}
                >
                  <input
                    type="checkbox"
                    tabIndex={0}
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{ accentColor: T.dark, cursor: "pointer" }}
                  />
                  Remember me
                </label>

                {/* Forgot password */}
                <Link
                  href="/forgot-password"
                  className="forgot-link"
                  tabIndex={0}
                  style={{
                    fontSize: "11px",
                    textDecoration: "underline",
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Forgot password?
                </Link>
              </div>

              {/* ── Auth error banner (Type 3) ── */}
              {authError && (
                <div
                  role="alert"
                  aria-live="assertive"
                  style={{
                    background: T.errorBg,
                    border: `1px solid ${T.errorBorder}`,
                    borderRadius: 0,
                    padding: "10px 14px",
                    marginTop: isSignUp ? "20px" : "0",
                    marginBottom: "16px",
                    fontSize: "12px",
                    color: T.errorText,
                    lineHeight: 1.5,
                  }}
                >
                  {authError}
                </div>
              )}

              {/* Spacer when error is not showing in Sign Up mode */}
              {isSignUp && !authError && <div style={{ height: "24px" }} />}

              {/* ── Sign In / Sign Up button ────── */}
              <button
                type="submit"
                id="signin-btn"
                tabIndex={0}
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
                  pointerEvents: loading ? "none" : "auto",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  marginBottom: "20px",
                  fontFamily: "inherit",
                  transition: "opacity 0.15s ease",
                }}
              >
                {loading ? (
                  <>
                    <span
                      className="ruven-spin"
                      aria-hidden="true"
                      style={{
                        width: "14px",
                        height: "14px",
                        border: "1.5px solid rgba(255,255,255,0.35)",
                        borderTopColor: "#FFFFFF",
                        borderRadius: "50%",
                        display: "inline-block",
                        flexShrink: 0,
                      }}
                    />
                    {isSignUp ? "Creating account…" : "Signing in…"}
                  </>
                ) : (
                  isSignUp ? "Create Account" : "Sign In"
                )}
              </button>

              {/* ── OR divider ─────────────────── */}
              <div
                aria-hidden="true"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "16px",
                }}
              >
                <div style={{ flex: 1, height: "0.5px", background: T.border }} />
                <span
                  style={{
                    fontSize: "10px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: T.muted,
                  }}
                >
                  OR
                </span>
                <div style={{ flex: 1, height: "0.5px", background: T.border }} />
              </div>

              {/* ── Google button ──────────────── */}
              <button
                type="button"
                tabIndex={0}
                className="google-btn"
                onClick={handleGoogleSignIn}
                style={{
                  background: "transparent",
                  border: `1px solid ${T.border}`,
                  borderRadius: 0,
                  height: "40px",
                  width: "100%",
                  fontSize: "12px",
                  color: "#555555",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  marginBottom: "24px",
                  fontFamily: "inherit",
                }}
              >
                {/* Google G logo — inline SVG per spec */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  aria-hidden="true"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </button>

              {/* ── Toggle Sign In / Sign Up Link ── */}
              <p
                style={{
                  textAlign: "center",
                  fontSize: "12px",
                  color: T.muted,
                  margin: 0,
                  fontFamily: "inherit",
                }}
              >
                {isSignUp ? "Already have an account?" : "Don't have an account?"}
                <button
                  type="button"
                  tabIndex={0}
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setAuthError("");
                    setEmailError("");
                    setPwError("");
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    color: T.dark,
                    fontWeight: 600,
                    textDecoration: "underline",
                    marginLeft: "4px",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontSize: "12px",
                  }}
                >
                  {isSignUp ? "Sign in" : "Create account"}
                </button>
              </p>

              {/* ── Dev sandbox (localhost only) ─ */}
              {isDev && (
                <div
                  style={{
                    marginTop: "32px",
                    background: "#F9F9F9",
                    border: `1px solid #EAEAEA`,
                    padding: "14px 16px",
                    fontSize: "10px",
                    color: "#666",
                    lineHeight: 1.7,
                    borderRadius: 0,
                  }}
                >
                  <strong
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      color: "#333",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      fontSize: "9px",
                    }}
                  >
                    Sandbox Credentials
                  </strong>
                  <div>
                    Admin:{" "}
                    <strong style={{ color: T.dark }}>admin@ruven.in</strong>
                    {" / "}
                    <strong style={{ color: T.dark }}>admin123</strong>
                  </div>
                  <div>
                    Customer:{" "}
                    <strong style={{ color: T.dark }}>customer@ruven.in</strong>
                    {" / "}
                    <strong style={{ color: T.dark }}>customer123</strong>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────
   Page Root — CartProvider + Header + Form
   No Footer per spec.
───────────────────────────────────────────── */
export default function LoginPage() {
  return (
    <CartProvider>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          background: "#FFFFFF",
          overflowX: "hidden",
        }}
      >
        {/* Full site Navbar — identical to every other storefront page */}
        <Header />

        {/* Body fills exactly remaining viewport height */}
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          <LoginForm />
        </div>
      </div>
    </CartProvider>
  );
}
