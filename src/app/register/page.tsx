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

function RegisterForm() {
  const router = useRouter();

  // Form values
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Focus states
  const [fnFocused, setFnFocused] = useState(false);
  const [lnFocused, setLnFocused] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [pwFocused, setPwFocused] = useState(false);
  const [confirmPwFocused, setConfirmPwFocused] = useState(false);

  // Field errors
  const [fnError, setFnError] = useState("");
  const [lnError, setLnError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [pwError, setPwError] = useState("");
  const [confirmPwError, setConfirmPwError] = useState("");
  const [termsError, setTermsError] = useState("");
  const [authError, setAuthError] = useState("");

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Password validators
  const hasMinLength = password.length >= 6;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const isPasswordValid = hasMinLength && hasLetter && hasNumber;

  // Real-time fields valid state check for borders
  const isFnValid = firstName.trim().length > 0;
  const isLnValid = lastName.trim().length > 0;
  const isPhoneValid = phone.trim().length > 0 && /^\+91\s?\d{10}$|^\d{10}$/.test(phone.trim().replace(/\s/g, ""));
  const isEmailValid = email.trim().length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isConfirmPwValid = confirmPassword.length > 0 && password === confirmPassword;

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
    setFnError("");
    setLnError("");
    setPhoneError("");
    setEmailError("");
    setPwError("");
    setConfirmPwError("");
    setTermsError("");

    if (!firstName.trim()) {
      setFnError("First name is required.");
      ok = false;
    }
    if (!lastName.trim()) {
      setLnError("Last name is required.");
      ok = false;
    }
    if (!phone.trim()) {
      setPhoneError("Phone number is required.");
      ok = false;
    } else if (!/^\+91\s?\d{10}$|^\d{10}$/.test(phone.trim().replace(/\s/g, ""))) {
      setPhoneError("Please enter a valid phone number (e.g., +91 98765 43210).");
      ok = false;
    }
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
    } else if (!isPasswordValid) {
      setPwError("Password does not meet the complexity requirements.");
      ok = false;
    }
    if (!confirmPassword) {
      setConfirmPwError("Please confirm your password.");
      ok = false;
    } else if (password !== confirmPassword) {
      setConfirmPwError("Passwords do not match.");
      ok = false;
    }
    if (!agreeTerms) {
      setTermsError("You must agree to the Terms of Service and Privacy Policy.");
      ok = false;
    }

    return ok;
  }, [firstName, lastName, phone, email, password, confirmPassword, agreeTerms, isPasswordValid]);

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
      setIsRegistered(true);
      setCountdown(60);
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
      const { data, error: authErr } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${siteUrl}/auth/callback`,
          data: {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            phone: phone.trim()
          }
        }
      });
      if (authErr) throw authErr;

      setIsRegistered(true);
      setCountdown(60);
      setLoading(false);
    } catch (err: any) {
      setAuthError(err.message || "Failed to create account. Please try again.");
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (countdown > 0) return;
    setAuthError("");
    setCountdown(60);

    const isDummy =
      process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("dummy") ||
      !process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (isDummy) {
      return;
    }

    try {
      const supabase = createClient();
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim(),
        options: {
          emailRedirectTo: `${siteUrl}/auth/callback`
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setAuthError(err.message || "Failed to resend email. Please try again.");
    }
  };

  // Border logic
  const fnBorder = fnError ? T.errorRed : isFnValid ? T.successGreen : fnFocused ? T.dark : T.border;
  const lnBorder = lnError ? T.errorRed : isLnValid ? T.successGreen : lnFocused ? T.dark : T.border;
  const phoneBorder = phoneError ? T.errorRed : isPhoneValid ? T.successGreen : phoneFocused ? T.dark : T.border;
  const emailBorder = emailError ? T.errorRed : isEmailValid ? T.successGreen : emailFocused ? T.dark : T.border;
  const pwBorder = pwError ? T.errorRed : isPasswordValid ? T.successGreen : pwFocused ? T.dark : T.border;
  const confirmPwBorder = confirmPwError ? T.errorRed : isConfirmPwValid ? T.successGreen : confirmPwFocused ? T.dark : T.border;

  if (isRegistered) {
    return (
      <div className="login-right-panel" style={{ flex: 1, background: T.bgWhite, overflowY: "auto", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", fontFamily: 'var(--font-sans)' }}>
        <div className="login-inner" style={{ width: "100%", maxWidth: "380px", padding: "48px 40px", background: T.bgWhite, border: `1px solid ${T.border}` }}>
          <h2 style={{ fontSize: "22px", fontWeight: 600, color: T.dark, letterSpacing: "-0.02em", marginBottom: "12px", textTransform: "uppercase" }}>
            Check your email
          </h2>
          <p style={{ fontSize: "13px", color: T.muted, lineHeight: 1.6, marginBottom: "28px" }}>
            We sent a verification link to <strong style={{ color: T.dark }}>{email}</strong>. Click it to activate your account.
          </p>

          {authError && (
            <div role="alert" style={{ background: T.errorBg, border: `1px solid ${T.errorBorder}`, padding: "10px 14px", marginBottom: "16px", fontSize: "12px", color: T.errorText }}>
              {authError}
            </div>
          )}

          <button
            onClick={handleResendEmail}
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
            {countdown > 0 ? `Resend email (${countdown}s)` : "Resend email"}
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
        .google-btn { transition: background 0.15s ease, border-color 0.15s ease; }
        .google-btn:hover { background: #F9F9F9 !important; border-color: ${T.dark} !important; }
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
            src="/brand_story_lifestyle.png"
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
              Studio Membership
            </p>
            <blockquote style={{ margin: 0, padding: 0, border: "none", fontFamily: 'Georgia, "Times New Roman", serif', color: T.bgWhite }}>
              <p style={{ fontSize: "18px", fontWeight: 400, lineHeight: 1.4, letterSpacing: "-0.01em", margin: "0 0 8px 0", fontStyle: "italic" }}>
                &ldquo;Therefore, if anyone is in Christ, he is a new creation. The old has passed away; behold, the new has come.&rdquo;
              </p>
              <footer style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(255,255,255,0.60)" }}>
                &mdash; 2 Corinthians 5:17
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

            <h1 style={{ fontSize: "28px", fontWeight: 600, color: T.dark, letterSpacing: "-0.025em", lineHeight: 1.2, margin: "0 0 6px 0" }}>
              Create account.
            </h1>
            <p style={{ fontSize: "13px", color: T.muted, lineHeight: 1.5, margin: "0 0 36px 0" }}>
              Sign up for a Ruven Studio account.
            </p>

            <form onSubmit={handleSubmit} noValidate>
              {/* Global Error Banner */}
              {authError && (
                <div role="alert" style={{ background: T.errorBg, border: `1px solid ${T.errorBorder}`, padding: "10px 14px", marginBottom: "16px", fontSize: "12px", color: T.errorText }}>
                  {authError}
                </div>
              )}

              {/* First Name & Last Name */}
              <div style={{ display: "flex", gap: "16px", marginBottom: "20px" }}>
                <div style={{ flex: 1 }}>
                  <label htmlFor="register-firstname" style={labelSt}>First Name</label>
                  <input
                    id="register-firstname"
                    type="text"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => { setFirstName(e.target.value); if (fnError) setFnError(""); }}
                    onFocus={() => setFnFocused(true)}
                    onBlur={() => setFnFocused(false)}
                    aria-describedby={fnError ? "register-firstname-error" : undefined}
                    aria-invalid={fnError ? "true" : "false"}
                    style={{ ...baseInput, borderColor: fnBorder }}
                  />
                  {fnError && <span id="register-firstname-error" role="alert" style={{ display: "block", fontSize: "11px", color: T.errorRed, marginTop: "4px" }}>{fnError}</span>}
                </div>

                <div style={{ flex: 1 }}>
                  <label htmlFor="register-lastname" style={labelSt}>Last Name</label>
                  <input
                    id="register-lastname"
                    type="text"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => { setLastName(e.target.value); if (lnError) setLnError(""); }}
                    onFocus={() => setLnFocused(true)}
                    onBlur={() => setLnFocused(false)}
                    aria-describedby={lnError ? "register-lastname-error" : undefined}
                    aria-invalid={lnError ? "true" : "false"}
                    style={{ ...baseInput, borderColor: lnBorder }}
                  />
                  {lnError && <span id="register-lastname-error" role="alert" style={{ display: "block", fontSize: "11px", color: T.errorRed, marginTop: "4px" }}>{lnError}</span>}
                </div>
              </div>

              {/* Phone Number */}
              <div style={{ marginBottom: "20px" }}>
                <label htmlFor="register-phone" style={labelSt}>Phone Number</label>
                <input
                  id="register-phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); if (phoneError) setPhoneError(""); }}
                  onFocus={() => setPhoneFocused(true)}
                  onBlur={() => setPhoneFocused(false)}
                  aria-describedby={phoneError ? "register-phone-error" : undefined}
                  aria-invalid={phoneError ? "true" : "false"}
                  style={{ ...baseInput, borderColor: phoneBorder }}
                />
                {phoneError && <span id="register-phone-error" role="alert" style={{ display: "block", fontSize: "11px", color: T.errorRed, marginTop: "4px" }}>{phoneError}</span>}
              </div>

              {/* Email */}
              <div style={{ marginBottom: "20px" }}>
                <label htmlFor="register-email" style={labelSt}>Email address</label>
                <input
                  id="register-email"
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError(""); }}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  aria-describedby={emailError ? "register-email-error" : undefined}
                  aria-invalid={emailError ? "true" : "false"}
                  style={{ ...baseInput, borderColor: emailBorder }}
                />
                {emailError && <span id="register-email-error" role="alert" style={{ display: "block", fontSize: "11px", color: T.errorRed, marginTop: "4px" }}>{emailError}</span>}
              </div>

              {/* Password */}
              <div style={{ marginBottom: "20px" }}>
                <label htmlFor="register-password" style={labelSt}>Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); if (pwError) setPwError(""); }}
                    onFocus={() => setPwFocused(true)}
                    onBlur={() => setPwFocused(false)}
                    aria-describedby={pwError ? "register-password-error" : undefined}
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
                {pwError && <span id="register-password-error" role="alert" style={{ display: "block", fontSize: "11px", color: T.errorRed, marginTop: "4px" }}>{pwError}</span>}

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
              <div style={{ marginBottom: "20px" }}>
                <label htmlFor="register-confirm-password" style={labelSt}>Confirm Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    id="register-confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); if (confirmPwError) setConfirmPwError(""); }}
                    onFocus={() => setConfirmPwFocused(true)}
                    onBlur={() => setConfirmPwFocused(false)}
                    aria-describedby={confirmPwError ? "register-confirm-error" : undefined}
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
                {confirmPwError && <span id="register-confirm-error" role="alert" style={{ display: "block", fontSize: "11px", color: T.errorRed, marginTop: "4px" }}>{confirmPwError}</span>}
              </div>

              {/* Terms Checkbox */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "flex", alignItems: "flex-start", gap: "8px", cursor: "pointer", fontSize: "11px", color: "#666666", userSelect: "none" }}>
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => { setAgreeTerms(e.target.checked); if (termsError) setTermsError(""); }}
                    style={{ accentColor: T.dark, cursor: "pointer", marginTop: "2px" }}
                  />
                  <span>
                    I agree to the{" "}
                    <Link href="/terms-of-service" style={{ textDecoration: "underline", color: T.dark }}>Terms of Service</Link>
                    {" and "}
                    <Link href="/privacy-policy" style={{ textDecoration: "underline", color: T.dark }}>Privacy Policy</Link>
                  </span>
                </label>
                {termsError && <span role="alert" style={{ display: "block", fontSize: "11px", color: T.errorRed, marginTop: "4px" }}>{termsError}</span>}
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
                    Creating account…
                  </>
                ) : (
                  "Create Account"
                )}
              </button>

              <p style={{ textAlign: "center", fontSize: "12px", color: T.muted, margin: 0 }}>
                Already have an account?
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

export default function RegisterPage() {
  return (
    <CartProvider>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#FFFFFF", overflowX: "hidden" }}>
        <Header />
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          <RegisterForm />
        </div>
      </div>
    </CartProvider>
  );
}
