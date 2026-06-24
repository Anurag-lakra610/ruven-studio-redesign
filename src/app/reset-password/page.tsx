"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { Eye, EyeOff, Check, X } from "lucide-react";
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

function ResetPasswordForm() {
  const router = useRouter();

  // Session check states
  const [checking, setChecking] = useState(true);
  const [hasSession, setHasSession] = useState(false);

  // Form values
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Focus states
  const [pwFocused, setPwFocused] = useState(false);
  const [confirmPwFocused, setConfirmPwFocused] = useState(false);

  // Error & Success states
  const [pwError, setPwError] = useState("");
  const [confirmPwError, setConfirmPwError] = useState("");
  const [authError, setAuthError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Password validators
  const hasMinLength = password.length >= 6;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const isPasswordValid = hasMinLength && hasLetter && hasNumber;
  const isConfirmPwValid = confirmPassword.length > 0 && password === confirmPassword;

  useEffect(() => {
    const checkSession = async () => {
      // First check mock cookie (to support testing in local dev)
      const getCookie = (name: string) => {
        if (typeof document === "undefined") return "";
        const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)"));
        return match ? decodeURIComponent(match[2]) : "";
      };
      if (getCookie("mock_customer_session") === "true" || getCookie("mock_admin_session") === "true") {
        setHasSession(true);
        setChecking(false);
        return;
      }

      const isDummy =
        process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("dummy") ||
        !process.env.NEXT_PUBLIC_SUPABASE_URL;

      if (isDummy) {
        setHasSession(true);
        setChecking(false);
        return;
      }

      // Check real Supabase session
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          setHasSession(true);
          setChecking(false);
        } else {
          // Listen for session parsed from hash
          const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
            if (currentSession) {
              setHasSession(true);
              setChecking(false);
            }
          });
          
          setTimeout(() => {
            setChecking(false);
            subscription.unsubscribe();
          }, 1500);
        }
      } catch (err) {
        console.error(err);
        setChecking(false);
      }
    };

    checkSession();
  }, []);

  const validateForm = useCallback((): boolean => {
    let ok = true;
    setPwError("");
    setConfirmPwError("");

    if (!password) {
      setPwError("New password is required.");
      ok = false;
    } else if (!isPasswordValid) {
      setPwError("Password does not meet complexity requirements.");
      ok = false;
    }
    if (!confirmPassword) {
      setConfirmPwError("Please confirm your password.");
      ok = false;
    } else if (password !== confirmPassword) {
      setConfirmPwError("Passwords do not match.");
      ok = false;
    }

    return ok;
  }, [password, confirmPassword, isPasswordValid]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setSuccessMessage("");
    if (!validateForm()) return;
    setLoading(true);

    const isDummy =
      process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("dummy") ||
      !process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (isDummy) {
      await new Promise<void>((res) => setTimeout(res, 1200));
      setSuccessMessage("Password updated!");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
      return;
    }

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      setSuccessMessage("Password updated!");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      setAuthError(err.message || "Failed to reset password. Please request a new link.");
      setLoading(false);
    }
  };

  const pwBorder = pwError ? T.errorRed : isPasswordValid ? T.successGreen : pwFocused ? T.dark : T.border;
  const confirmPwBorder = confirmPwError ? T.errorRed : isConfirmPwValid ? T.successGreen : confirmPwFocused ? T.dark : T.border;

  if (checking) {
    return (
      <div className="login-right-panel" style={{ flex: 1, background: T.bgWhite, overflowY: "auto", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", fontFamily: 'var(--font-sans)' }}>
        <div style={{ textAlign: "center" }}>
          <span className="ruven-spin" style={{ width: "24px", height: "24px", border: `2.5px solid ${T.border}`, borderTopColor: T.dark, borderRadius: "50%", display: "inline-block", marginBottom: "12px" }} />
          <p style={{ fontSize: "11px", color: T.muted, textTransform: "uppercase", letterSpacing: "0.1em" }}>Verifying recovery session…</p>
        </div>
      </div>
    );
  }

  if (!hasSession) {
    return (
      <div className="login-right-panel" style={{ flex: 1, background: T.bgWhite, overflowY: "auto", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", fontFamily: 'var(--font-sans)' }}>
        <div className="login-inner" style={{ width: "100%", maxWidth: "380px", padding: "48px 40px", background: T.bgWhite, border: `1px solid ${T.border}`, textAlign: "center" }}>
          <h2 style={{ fontSize: "20px", fontWeight: 600, color: T.errorText, letterSpacing: "-0.02em", marginBottom: "12px", textTransform: "uppercase" }}>
            Invalid or expired link
          </h2>
          <p style={{ fontSize: "13px", color: T.muted, lineHeight: 1.6, marginBottom: "28px" }}>
            The recovery link is invalid, expired, or has already been used. Please request a new password recovery link.
          </p>
          <Link
            href="/forgot-password"
            style={{
              display: "inline-block",
              background: T.dark,
              color: "#FFFFFF",
              fontSize: "12px",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.07em",
              padding: "0 32px",
              height: "42px",
              lineHeight: "42px",
              textDecoration: "none",
              width: "100%",
            }}
          >
            Request New Link
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
        .req-item { display: flex; align-items: center; gap: 4px; font-size: 10px; color: ${T.muted}; transition: color 0.15s ease; }
        .req-item.active { color: ${T.dark}; }
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
              Secure Recovery
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
            <h1 style={{ fontSize: "28px", fontWeight: 600, color: T.dark, letterSpacing: "-0.025em", lineHeight: 1.2, margin: "0 0 6px 0" }}>
              New password.
            </h1>
            <p style={{ fontSize: "13px", color: T.muted, lineHeight: 1.5, margin: "0 0 36px 0" }}>
              Set your new account password.
            </p>

            <form onSubmit={handleSubmit} noValidate>
              {/* Global Error Banner */}
              {authError && (
                <div role="alert" style={{ background: T.errorBg, border: `1px solid ${T.errorBorder}`, padding: "10px 14px", marginBottom: "16px", fontSize: "12px", color: T.errorText }}>
                  {authError}
                </div>
              )}

              {/* Success Banner */}
              {successMessage && (
                <div role="alert" style={{ background: T.successBg, border: `1px solid ${T.successBorder}`, padding: "10px 14px", marginBottom: "16px", fontSize: "12px", color: T.successText, fontWeight: "bold" }}>
                  {successMessage}
                </div>
              )}

              {/* Password */}
              <div style={{ marginBottom: "20px" }}>
                <label htmlFor="reset-password" style={labelSt}>New Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    id="reset-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); if (pwError) setPwError(""); }}
                    onFocus={() => setPwFocused(true)}
                    onBlur={() => setPwFocused(false)}
                    aria-describedby={pwError ? "reset-password-error" : undefined}
                    aria-invalid={pwError ? "true" : "false"}
                    style={{ ...baseInput, paddingRight: "44px", borderColor: pwBorder }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 0, color: T.muted }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {pwError && <span id="reset-password-error" role="alert" style={{ display: "block", fontSize: "11px", color: T.errorRed, marginTop: "4px" }}>{pwError}</span>}

                {/* Password strength guide */}
                <div style={{ marginTop: "8px", display: "flex", flexDirection: "column", gap: "4px" }}>
                  <div className={`req-item ${hasMinLength ? "active" : ""}`} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    {hasMinLength ? <Check size={10} style={{ color: T.successGreen }} /> : <X size={10} style={{ color: T.errorRed }} />}
                    <span>At least 6 characters</span>
                  </div>
                  <div className={`req-item ${hasLetter ? "active" : ""}`} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    {hasLetter ? <Check size={10} style={{ color: T.successGreen }} /> : <X size={10} style={{ color: T.errorRed }} />}
                    <span>Contains at least one letter</span>
                  </div>
                  <div className={`req-item ${hasNumber ? "active" : ""}`} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    {hasNumber ? <Check size={10} style={{ color: T.successGreen }} /> : <X size={10} style={{ color: T.errorRed }} />}
                    <span>Contains at least one number</span>
                  </div>
                </div>
              </div>

              {/* Confirm Password */}
              <div style={{ marginBottom: "24px" }}>
                <label htmlFor="reset-confirm-password" style={labelSt}>Confirm New Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    id="reset-confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); if (confirmPwError) setConfirmPwError(""); }}
                    onFocus={() => setConfirmPwFocused(true)}
                    onBlur={() => setConfirmPwFocused(false)}
                    aria-describedby={confirmPwError ? "reset-confirm-error" : undefined}
                    aria-invalid={confirmPwError ? "true" : "false"}
                    style={{ ...baseInput, paddingRight: "44px", borderColor: confirmPwBorder }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 0, color: T.muted }}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {confirmPwError && <span id="reset-confirm-error" role="alert" style={{ display: "block", fontSize: "11px", color: T.errorRed, marginTop: "4px" }}>{confirmPwError}</span>}
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
                  marginBottom: "20px",
                  transition: "opacity 0.15s ease",
                }}
              >
                {loading ? (
                  <>
                    <span className="ruven-spin" style={{ width: "14px", height: "14px", border: "1.5px solid rgba(255,255,255,0.35)", borderTopColor: "#FFFFFF", borderRadius: "50%", display: "inline-block" }} />
                    Updating password…
                  </>
                ) : (
                  "Update Password"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <CartProvider>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#FFFFFF", overflowX: "hidden" }}>
        <Header />
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          <ResetPasswordForm />
        </div>
      </div>
    </CartProvider>
  );
}
