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
  brandBurgundy:"#670000",
  brandBurgundyLight: "#8E1B1B",
} as const;

const baseInput: React.CSSProperties = {
  border: `1px solid ${T.border}`,
  borderRadius: 0,
  background: "#FAF9F6",
  height: "44px",
  padding: "0 14px",
  fontSize: "13px",
  color: T.dark,
  width: "100%",
  outline: "none",
  boxShadow: "none",
  display: "block",
  boxSizing: "border-box",
  fontFamily: "inherit",
  transition: "border-color 0.15s ease, background-color 0.15s ease",
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
  const [otpCode, setOtpCode] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Focus states
  const [fnFocused, setFnFocused] = useState(false);
  const [lnFocused, setLnFocused] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [otpFocused, setOtpFocused] = useState(false);

  // Field errors
  const [fnError, setFnError] = useState("");
  const [lnError, setLnError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [termsError, setTermsError] = useState("");
  const [authError, setAuthError] = useState("");

  // UI state
  const [loading, setLoading] = useState(false);
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Real-time fields valid state check for borders
  const isFnValid = firstName.trim().length > 0;
  const isLnValid = lastName.trim().length > 0;
  const isPhoneValid = phone.trim().length > 0 && /^\+91\s?\d{10}$|^\d{10}$/.test(phone.trim().replace(/\s/g, ""));
  const isEmailValid = email.trim().length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isOtpValid = otpCode.trim().length === 6 && /^\d+$/.test(otpCode.trim());

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
    if (!agreeTerms) {
      setTermsError("You must agree to the Terms of Service and Privacy Policy.");
      ok = false;
    }

    return ok;
  }, [firstName, lastName, phone, email, agreeTerms]);

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
      setShowOtpScreen(true);
      setCountdown(60);
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
      const { error: authErr } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          shouldCreateUser: true,
          emailRedirectTo: `${siteUrl}/auth/callback`,
          data: {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            phone: phone.trim()
          }
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

    if (isDummy) {
      await new Promise<void>((res) => setTimeout(res, 1200));
      if (otpCode === "123456" || otpCode.length === 6) {
        document.cookie = "mock_customer_session=true; path=/; max-age=86400";
        document.cookie = `mock_user_email=${email.trim()}; path=/; max-age=86400`;
        document.cookie = `mock_user_name=${firstName.trim()} ${lastName.trim()}; path=/; max-age=86400`;
        router.push("/account");
      } else {
        setOtpError("Incorrect OTP code. Try 123456.");
        setLoading(false);
      }
      return;
    }

    try {
      const supabase = createClient();
      const { error: authErr } = await supabase.auth.verifyOtp({
        email: email.trim(),
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

    const isDummy =
      process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("dummy") ||
      !process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (isDummy) {
      return;
    }

    try {
      const supabase = createClient();
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          shouldCreateUser: true,
          emailRedirectTo: `${siteUrl}/auth/callback`,
          data: {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            phone: phone.trim()
          }
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setAuthError(err.message || "Failed to resend code. Please try again.");
    }
  };

  // Border logic
  const fnBorder = fnError ? T.errorRed : isFnValid ? T.successGreen : fnFocused ? T.brandBurgundy : T.border;
  const lnBorder = lnError ? T.errorRed : isLnValid ? T.successGreen : lnFocused ? T.brandBurgundy : T.border;
  const phoneBorder = phoneError ? T.errorRed : isPhoneValid ? T.successGreen : phoneFocused ? T.brandBurgundy : T.border;
  const emailBorder = emailError ? T.errorRed : isEmailValid ? T.successGreen : emailFocused ? T.brandBurgundy : T.border;

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
        .btn-brand-primary {
          background: ${T.brandBurgundy} !important;
          transition: background 0.2s ease, transform 0.15s ease;
        }
        .btn-brand-primary:hover {
          background: ${T.brandBurgundyLight} !important;
        }
        @media (max-width: 767px) {
          .login-left-panel { display: none !important; }
          .login-right-panel { width: 100% !important; padding: 32px 24px !important; }
          .login-inner {
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
            background: transparent !important;
          }
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
          className="login-right-panel auth-right-panel-bg"
          style={{
            flex: 1,
            overflowY: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 24px",
            fontFamily: 'var(--font-sans)',
          }}
        >
          {/* Blueprint Layout Grid & Faith-Inspired Watermark */}
          <div className="auth-blueprint-grid" />
          <div className="auth-watermark-graphic" />

          <div
            className="login-inner"
            style={{
              width: "100%",
              maxWidth: "380px",
              padding: "48px 40px",
              background: T.bgWhite,
              border: "1px solid #E5E3DD",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.02), 0 1px 8px rgba(0, 0, 0, 0.01)",
              position: "relative",
              zIndex: 2,
            }}
          >
            <Link href="/shop" className="back-link" style={{ fontSize: "12px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px", cursor: "pointer", marginBottom: "32px" }}>
              &larr; Back to shop
            </Link>

            {showOtpScreen ? (
              <>
                <h1 style={{ fontSize: "28px", fontWeight: 600, color: T.dark, letterSpacing: "-0.025em", lineHeight: 1.2, margin: "0 0 6px 0" }}>
                  Verify code.
                </h1>
                <p style={{ fontSize: "13px", color: T.muted, lineHeight: 1.5, margin: "0 0 36px 0" }}>
                  We sent a 6-digit confirmation code to <strong style={{ color: T.dark }}>{email}</strong>. Please enter it below.
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
                    <label htmlFor="register-otp" style={labelSt}>6-Digit Code</label>
                    <input
                      id="register-otp"
                      type="text"
                      className="no-double-border"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      placeholder="123456"
                      value={otpCode}
                      onChange={(e) => { setOtpCode(e.target.value); if (otpError) setOtpError(""); }}
                      onFocus={() => setOtpFocused(true)}
                      onBlur={() => setOtpFocused(false)}
                      aria-describedby={otpError ? "register-otp-error" : undefined}
                      aria-invalid={otpError ? "true" : "false"}
                      style={{ ...baseInput, letterSpacing: otpCode ? "0.5em" : "normal", textAlign: otpCode ? "center" : "left", fontSize: otpCode ? "18px" : "13px", borderColor: otpError ? T.errorRed : isOtpValid ? T.successGreen : otpFocused ? T.brandBurgundy : T.border }}
                    />
                    {otpError && <span id="register-otp-error" role="alert" style={{ display: "block", fontSize: "11px", color: T.errorRed, marginTop: "4px" }}>{otpError}</span>}
                  </div>

                  {/* Verify Button */}
                  <button
                    type="submit"
                    className="btn-brand-primary"
                    disabled={loading}
                    style={{
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
                        className="no-double-border"
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
                        className="no-double-border"
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
                      className="no-double-border"
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
                      className="no-double-border"
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

                  {/* Terms Checkbox */}
                  <div style={{ marginBottom: "24px" }}>
                    <label style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "11px", color: "#666666", cursor: "pointer", userSelect: "none", lineHeight: "1.4" }}>
                      <input
                        type="checkbox"
                        className="ruven-checkbox"
                        style={{ marginTop: "2px" }}
                        checked={agreeTerms}
                        onChange={(e) => { setAgreeTerms(e.target.checked); if (termsError) setTermsError(""); }}
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
                    className="btn-brand-primary"
                    disabled={loading}
                    style={{
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
                      Login
                    </Link>
                  </p>
                </form>
              </>
            )}
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
