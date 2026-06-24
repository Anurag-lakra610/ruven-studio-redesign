"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
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

function ForgotPasswordForm() {
  const router = useRouter();

  // Form values
  const [email, setEmail] = useState("");

  // Focus state
  const [emailFocused, setEmailFocused] = useState(false);

  // Error states
  const [emailError, setEmailError] = useState("");
  const [authError, setAuthError] = useState("");

  // UI state
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Validation
  const isEmailValid = email.trim().length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  // Countdown timer for Resend
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const validateForm = useCallback((): boolean => {
    let ok = true;
    setEmailError("");

    if (!email.trim()) {
      setEmailError("Email address is required.");
      ok = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError("Please enter a valid email address.");
      ok = false;
    }

    return ok;
  }, [email]);

  const triggerReset = async () => {
    const isDummy =
      process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("dummy") ||
      !process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (isDummy) {
      return;
    }

    const supabase = createClient();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
    const { error: resetErr } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${siteUrl}/reset-password`,
    });
    if (resetErr) throw resetErr;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    if (!validateForm()) return;
    setLoading(true);

    try {
      await triggerReset();
      // Always show success regardless of whether email exists (security best practice)
      setIsSent(true);
      setCountdown(60);
      setLoading(false);
    } catch (err: any) {
      // Still show success to protect user accounts, or optionally handle connection failures here
      // But per spec, always show success state on submit!
      setIsSent(true);
      setCountdown(60);
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setAuthError("");
    setCountdown(60);

    try {
      await triggerReset();
    } catch (err: any) {
      setAuthError(err.message || "Failed to resend link. Please try again.");
    }
  };

  // Border logic
  const emailBorder = emailError ? T.errorRed : isEmailValid ? T.successGreen : emailFocused ? T.dark : T.border;

  if (isSent) {
    return (
      <div className="login-right-panel" style={{ flex: 1, background: T.bgWhite, overflowY: "auto", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", fontFamily: 'var(--font-sans)' }}>
        <div className="login-inner" style={{ width: "100%", maxWidth: "380px", padding: "48px 40px", background: T.bgWhite, border: `1px solid ${T.border}` }}>
          <h2 style={{ fontSize: "22px", fontWeight: 600, color: T.dark, letterSpacing: "-0.02em", marginBottom: "12px", textTransform: "uppercase" }}>
            Recovery email sent
          </h2>
          <p style={{ fontSize: "13px", color: T.muted, lineHeight: 1.6, marginBottom: "28px" }}>
            If an account exists for <strong style={{ color: T.dark }}>{email}</strong>, you&apos;ll receive a link shortly. Check your spam folder too.
          </p>

          {authError && (
            <div role="alert" style={{ background: T.errorBg, border: `1px solid ${T.errorBorder}`, padding: "10px 14px", marginBottom: "16px", fontSize: "12px", color: T.errorText }}>
              {authError}
            </div>
          )}

          <button
            onClick={handleResend}
            disabled={countdown > 0}
            style={{
              background: countdown > 0 ? T.border : T.dark,
              color: countdown > 0 ? T.muted : "#FFFFFF",
              borderRadius: 0,
              height: "44px",
              width: "100%",
              fontSize: "13px",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              fontWeight: 500,
              border: "none",
              cursor: countdown > 0 ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "20px",
            }}
          >
            {countdown > 0 ? `Resend (${countdown}s)` : "Resend"}
          </button>

          <Link href="/login" style={{ fontSize: "12px", color: T.dark, textDecoration: "underline", display: "block", textAlign: "center" }}>
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

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
            src="/brand_story_editorial.png"
            alt=""
            aria-hidden="true"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/brand_story_lifestyle.png";
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
              Account Recovery
            </p>
            <blockquote style={{ margin: 0, padding: 0, border: "none", fontFamily: 'Georgia, "Times New Roman", serif', color: T.bgWhite }}>
              <p style={{ fontSize: "18px", fontWeight: 400, lineHeight: 1.4, letterSpacing: "-0.01em", margin: "0 0 8px 0", fontStyle: "italic" }}>
                &ldquo;Keep your heart with all vigilance, for from it flow the springs of life.&rdquo;
              </p>
              <footer style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(255,255,255,0.60)" }}>
                &mdash; Proverbs 4:23
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
            <Link href="/login" className="back-link" style={{ fontSize: "12px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px", cursor: "pointer", marginBottom: "32px" }}>
              &larr; Back to sign in
            </Link>

            <h1 style={{ fontSize: "28px", fontWeight: 600, color: T.dark, letterSpacing: "-0.025em", lineHeight: 1.2, margin: "0 0 6px 0" }}>
              Password reset.
            </h1>
            <p style={{ fontSize: "13px", color: T.muted, lineHeight: 1.5, margin: "0 0 36px 0" }}>
              Reset your Ruven Studio account password.
            </p>

            <form onSubmit={handleSubmit} noValidate>
              {/* Email */}
              <div style={{ marginBottom: "24px" }}>
                <label htmlFor="recovery-email" style={labelSt}>Email address</label>
                <input
                  id="recovery-email"
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError("");
                  }}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  aria-describedby={emailError ? "recovery-email-error" : undefined}
                  aria-invalid={emailError ? "true" : "false"}
                  style={{ ...baseInput, borderColor: emailBorder }}
                />
                {emailError && (
                  <span
                    id="recovery-email-error"
                    role="alert"
                    style={{ display: "block", fontSize: "11px", color: T.errorRed, marginTop: "4px" }}
                  >
                    {emailError}
                  </span>
                )}
              </div>

              {/* Submit Button */}
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
                  marginBottom: "24px",
                  transition: "opacity 0.15s ease",
                }}
              >
                {loading ? (
                  <>
                    <span className="ruven-spin" style={{ width: "14px", height: "14px", border: "1.5px solid rgba(255,255,255,0.35)", borderTopColor: "#FFFFFF", borderRadius: "50%", display: "inline-block" }} />
                    Sending link…
                  </>
                ) : (
                  "Send Recovery Link"
                )}
              </button>

              <p style={{ textAlign: "center", fontSize: "12px", color: T.muted, margin: 0 }}>
                Remember your password?
                <Link href="/login" style={{ color: T.dark, fontWeight: 600, textDecoration: "underline", marginLeft: "4px" }}>
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default function ForgotPasswordPage() {
  return (
    <CartProvider>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#FFFFFF", overflowX: "hidden" }}>
        <Header />
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          <ForgotPasswordForm />
        </div>
      </div>
    </CartProvider>
  );
}
