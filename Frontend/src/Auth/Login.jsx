import React, { useState, useRef, useEffect, useCallback } from "react";
import { FaEye, FaEyeSlash, FaWhatsapp, FaEnvelope, FaPhone } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import api from "../services/api";
import { useAuth } from "../PrivateRouter/AuthContext";

// ─── OTP Input: 6 auto-focus boxes ───────────────────────────────────────────
const OtpBoxes = ({ otp, setOtp, disabled }) => {
  const inputs = useRef([]);

  const handleChange = (e, idx) => {
    const val = e.target.value.replace(/\D/g, "");
    if (!val) return;
    const newOtp = otp.split("");
    newOtp[idx] = val[val.length - 1];
    setOtp(newOtp.join(""));
    if (idx < 5) inputs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newOtp = otp.split("");
      if (newOtp[idx]) {
        newOtp[idx] = "";
        setOtp(newOtp.join(""));
      } else if (idx > 0) {
        newOtp[idx - 1] = "";
        setOtp(newOtp.join(""));
        inputs.current[idx - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && idx > 0) {
      inputs.current[idx - 1]?.focus();
    } else if (e.key === "ArrowRight" && idx < 5) {
      inputs.current[idx + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    setOtp(pasted.padEnd(6, "").slice(0, 6));
    const focusIdx = Math.min(pasted.length, 5);
    inputs.current[focusIdx]?.focus();
  };

  return (
    <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
      {Array.from({ length: 6 }).map((_, idx) => (
        <input
          key={idx}
          ref={(el) => (inputs.current[idx] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          disabled={disabled}
          value={otp[idx] || ""}
          onChange={(e) => handleChange(e, idx)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          style={{
            width: "44px",
            height: "52px",
            textAlign: "center",
            fontSize: "22px",
            fontWeight: "700",
            border: otp[idx] ? "2px solid #16a34a" : "2px solid #d1d5db",
            borderRadius: "10px",
            outline: "none",
            background: otp[idx] ? "#f0fdf4" : "#f9fafb",
            color: "#1f2937",
            transition: "border-color 0.2s, background 0.2s",
            cursor: disabled ? "not-allowed" : "text",
          }}
        />
      ))}
    </div>
  );
};

// ─── Countdown timer hook ─────────────────────────────────────────────────────
const useCountdown = (initial = 0) => {
  const [seconds, setSeconds] = useState(initial);
  const timerRef = useRef(null);

  const start = useCallback((s) => {
    setSeconds(s);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) { clearInterval(timerRef.current); return 0; }
        return prev - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => () => clearInterval(timerRef.current), []);
  return { seconds, start };
};

// ─── Main Login Component ─────────────────────────────────────────────────────
const Login = () => {
  // Shared
  const navigate      = useNavigate();
  const { login }     = useAuth();
  const [activeTab, setActiveTab] = useState("email"); // "email" | "whatsapp"

  // Email login state
  const [email,        setEmail]        = useState("");
  const [password,     setPassword]     = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showReset,    setShowReset]    = useState(false);

  // WhatsApp OTP state
  const [phone,        setPhone]        = useState("");
  const [step,         setStep]         = useState(1); // 1 = enter phone, 2 = enter OTP
  const [otp,          setOtp]          = useState("");
  const [sending,      setSending]      = useState(false);
  const [verifying,    setVerifying]    = useState(false);
  const { seconds: cooldown, start: startCooldown } = useCountdown(0);

  // Messages
  const [message,      setMessage]      = useState("");
  const [msgType,      setMsgType]      = useState(""); // "success" | "error" | "info"

  const showMsg = (text, type = "error") => { setMessage(text); setMsgType(type); };
  const clearMsg = () => { setMessage(""); setMsgType(""); };

  // ── Email Login ─────────────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    clearMsg();
    try {
      const { data } = await api.post("/auth/login", { email, password });
      const userData = {
        userId:    data.userId,
        user_id:   data.user_id   || data.userUuid,
        userUuid:  data.userUuid  || data.user_id,
        username:  data.username,
        firstName: data.firstName || data.username,
        email:     data.email,
        role:      data.role,
      };
      login(userData, data.token || "user-token");
      showMsg("Login successful! Redirecting...", "success");
      setTimeout(() => navigate(data.role === "admin" ? "/adminpanel" : "/"), 1000);
    } catch (err) {
      showMsg(err.response?.data?.message || "Invalid email or password.");
    }
  };

  // ── Google Login ────────────────────────────────────────────────────────────
  const handleGoogle = async (credentialResponse) => {
    clearMsg();
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const { data } = await api.post("/auth/google-login", {
        firstName: decoded.given_name || decoded.name?.split(" ")[0] || "User",
        lastName:  decoded.family_name || "",
        username:  decoded.name || decoded.email?.split("@")[0] || "User",
        email:     decoded.email,
        googleId:  decoded.sub,
        provider:  "google",
      });
      const userData = {
        userId:    data.userId,
        user_id:   data.user_id,
        userUuid:  data.userUuid,
        username:  data.username,
        firstName: data.firstName,
        email:     data.email,
        role:      data.role,
        provider:  data.provider,
        photoURL:  decoded.picture || "",
      };
      login(userData, credentialResponse.credential);
      showMsg("Google login successful!", "success");
      setTimeout(() => navigate(data.role === "Admin" ? "/adminpanel" : "/"), 1000);
    } catch (err) {
      showMsg(err.response?.data?.message || "Google login failed.");
    }
  };

  // ── Send OTP ────────────────────────────────────────────────────────────────
  const handleSendOtp = async () => {
    clearMsg();
    const fullPhone = `+91${phone.replace(/\D/g, "")}`;

    if (!/^\+91[6-9]\d{9}$/.test(fullPhone)) {
      return showMsg("Enter a valid 10-digit Indian mobile number.");
    }

    setSending(true);
    try {
      const { data } = await api.post("/auth/send-otp", { phone: fullPhone });
      showMsg(data.message || "OTP sent!", "success");
      setStep(2);
      setOtp("");
      startCooldown(data.secondsLeft ?? 30);
    } catch (err) {
      const res = err.response?.data;
      showMsg(res?.message || "Failed to send OTP.");
      if (res?.secondsLeft) startCooldown(res.secondsLeft);
    } finally {
      setSending(false);
    }
  };

  // ── Verify OTP ──────────────────────────────────────────────────────────────
  const handleVerifyOtp = async () => {
    clearMsg();
    if (otp.replace(/\D/g, "").length < 6) {
      return showMsg("Enter the complete 6-digit OTP.");
    }

    const fullPhone = `+91${phone.replace(/\D/g, "")}`;
    setVerifying(true);
    try {
      const { data } = await api.post("/auth/verify-otp", { phone: fullPhone, otp });
      const userData = {
        userId:    data.userId,
        user_id:   data.user_id   || data.userUuid,
        userUuid:  data.userUuid  || data.user_id,
        username:  data.username,
        firstName: data.firstName || data.username,
        email:     data.email     || "",
        phone:     data.phone,
        role:      data.role,
        provider:  data.provider,
      };
      login(userData, data.token);
      showMsg("Verified! Logging you in...", "success");
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      showMsg(err.response?.data?.message || "Verification failed.");
    } finally {
      setVerifying(false);
    }
  };

  // ── Reset WhatsApp form ──────────────────────────────────────────────────────
  const resetWhatsApp = () => {
    setStep(1);
    setOtp("");
    clearMsg();
  };

  // ── UI helpers ───────────────────────────────────────────────────────────────
  const maskedPhone = `+91 xxxxxx${phone.slice(-4)}`;

  const tabStyle = (tab) => ({
    flex: 1,
    padding: "10px 0",
    fontWeight: "600",
    fontSize: "14px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    transition: "all 0.2s",
    background: activeTab === tab ? "#16a34a" : "transparent",
    color:      activeTab === tab ? "#fff"     : "#6b7280",
  });

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fff", padding: "16px" }}>
      <div style={{
        display: "flex", flexDirection: "row", maxWidth: "960px", width: "100%",
        boxShadow: "0 4px 24px rgba(0,0,0,0.1)", border: "1.5px solid #86efac",
        borderRadius: "16px", overflow: "hidden", minHeight: "560px",
      }}>

        {/* ── Left image (hidden on mobile) ── */}
        <div style={{ display: "none", flex: 1 }} className="login-img-panel">
          <img
            src="https://kavisdryfruits.com/images/Login.jpg"
            alt="KAVI'S Dry Fruits Login"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        {/* ── Right form panel ── */}
        <div style={{ flex: 1, padding: "36px 32px", display: "flex", flexDirection: "column", justifyContent: "center" }}>

          {/* Logo */}
          <div style={{ marginBottom: "16px" }}>
            <img src="/images/Kavi_logo.png" alt="KAVI'S Logo" style={{ width: "80px", height: "auto" }} />
          </div>

          <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#111827", marginBottom: "4px" }}>
            Welcome Back
          </h2>
          <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "20px" }}>
            Sign in to your KAVI'S account
          </p>

          {/* ── Tab Switch ── */}
          <div style={{
            display: "flex", background: "#f3f4f6", borderRadius: "10px",
            padding: "4px", marginBottom: "20px", gap: "4px",
          }}>
            <button style={tabStyle("email")} onClick={() => { setActiveTab("email"); clearMsg(); }}>
              <FaEnvelope size={13} /> Email
            </button>
            <button style={tabStyle("whatsapp")} onClick={() => { setActiveTab("whatsapp"); clearMsg(); resetWhatsApp(); }}>
              <FaWhatsapp size={14} /> WhatsApp OTP
            </button>
          </div>

          {/* ── Message Banner ── */}
          {message && (
            <div style={{
              padding: "10px 14px", borderRadius: "8px", fontSize: "13px",
              marginBottom: "16px", fontWeight: "500",
              background: msgType === "success" ? "#dcfce7" : msgType === "info" ? "#dbeafe" : "#fee2e2",
              color:      msgType === "success" ? "#15803d" : msgType === "info" ? "#1d4ed8" : "#dc2626",
              border:     `1px solid ${msgType === "success" ? "#86efac" : msgType === "info" ? "#93c5fd" : "#fca5a5"}`,
            }}>
              {message}
            </div>
          )}

          {/* ══════════════════════════════════════════
              EMAIL TAB
          ══════════════════════════════════════════ */}
          {activeTab === "email" && (
            <>
              <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

                {/* Email */}
                <div>
                  <label style={labelStyle}>Email Address *</label>
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    style={inputStyle}
                    onFocus={(e) => e.target.style.borderColor = "#16a34a"}
                    onBlur={(e)  => e.target.style.borderColor = "#d1d5db"}
                  />
                </div>

                {/* Password */}
                <div>
                  <label style={labelStyle}>Password *</label>
                  <div style={{ position: "relative" }}>
                    <input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      style={{ ...inputStyle, paddingRight: "42px" }}
                      onFocus={(e) => e.target.style.borderColor = "#16a34a"}
                      onBlur={(e)  => e.target.style.borderColor = "#d1d5db"}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af", cursor: "pointer" }}
                    >
                      {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                    </span>
                  </div>
                </div>

                {/* Remember / Forgot */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", color: "#374151", cursor: "pointer" }}>
                    <input type="checkbox" style={{ accentColor: "#16a34a" }} /> Remember me
                  </label>
                  <span
                    onClick={() => setShowReset(!showReset)}
                    style={{ color: "#16a34a", cursor: "pointer", textDecoration: "underline" }}
                  >
                    Forgot Password?
                  </span>
                </div>

                <button type="submit" id="login-submit-btn" style={primaryBtnStyle}>
                  Log In
                </button>
              </form>

              {/* Divider */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "16px 0", color: "#9ca3af", fontSize: "13px" }}>
                <span style={{ flex: 1, height: "1px", background: "#e5e7eb" }} />
                or continue with
                <span style={{ flex: 1, height: "1px", background: "#e5e7eb" }} />
              </div>

              {/* Google */}
              <GoogleLogin
                onSuccess={handleGoogle}
                onError={() => showMsg("Google login failed.")}
                theme="outline"
                size="large"
                text="continue_with"
                shape="rectangular"
              />
            </>
          )}

          {/* ══════════════════════════════════════════
              WHATSAPP OTP TAB
          ══════════════════════════════════════════ */}
          {activeTab === "whatsapp" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

              {/* STEP 1 — Phone number */}
              {step === 1 && (
                <>
                  <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "4px" }}>
                    We'll send a 6-digit OTP to your WhatsApp number.
                  </p>

                  <div>
                    <label style={labelStyle}>Mobile Number *</label>
                    <div style={{ display: "flex", border: "1.5px solid #d1d5db", borderRadius: "8px", overflow: "hidden", transition: "border-color 0.2s" }}
                         onFocus={() => {}} onBlur={() => {}}>
                      {/* Country code badge */}
                      <span style={{
                        display: "flex", alignItems: "center", gap: "6px",
                        padding: "0 12px", background: "#f3f4f6",
                        borderRight: "1.5px solid #d1d5db", color: "#374151",
                        fontSize: "14px", fontWeight: "600", whiteSpace: "nowrap",
                      }}>
                        🇮🇳 +91
                      </span>
                      <input
                        id="whatsapp-phone-input"
                        type="tel"
                        maxLength={10}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        placeholder="98765 43210"
                        style={{
                          flex: 1, border: "none", outline: "none",
                          padding: "11px 12px", fontSize: "15px",
                          fontWeight: "500", letterSpacing: "1px",
                          background: "transparent", color: "#111827",
                        }}
                        onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                      />
                    </div>
                  </div>

                  <button
                    id="send-otp-btn"
                    onClick={handleSendOtp}
                    disabled={sending || phone.length < 10}
                    style={{
                      ...primaryBtnStyle,
                      background: (sending || phone.length < 10) ? "#86efac" : "#16a34a",
                      cursor:     (sending || phone.length < 10) ? "not-allowed" : "pointer",
                      display:    "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                    }}
                  >
                    <FaWhatsapp size={16} />
                    {sending ? "Sending OTP..." : "Send OTP via WhatsApp"}
                  </button>
                </>
              )}

              {/* STEP 2 — OTP entry */}
              {step === 2 && (
                <>
                  {/* Back */}
                  <button
                    onClick={resetWhatsApp}
                    style={{ alignSelf: "flex-start", background: "none", border: "none", color: "#16a34a", cursor: "pointer", fontSize: "13px", padding: "0", fontWeight: "600" }}
                  >
                    ← Change number
                  </button>

                  {/* Info */}
                  <div style={{
                    background: "#f0fdf4", border: "1px solid #86efac",
                    borderRadius: "10px", padding: "12px 14px",
                    display: "flex", alignItems: "center", gap: "10px",
                  }}>
                    <FaWhatsapp size={22} color="#16a34a" />
                    <div>
                      <p style={{ fontSize: "13px", fontWeight: "600", color: "#15803d", margin: 0 }}>OTP sent to WhatsApp</p>
                      <p style={{ fontSize: "12px", color: "#6b7280", margin: 0 }}>{maskedPhone}</p>
                    </div>
                  </div>

                  <div>
                    <label style={{ ...labelStyle, textAlign: "center", display: "block", marginBottom: "12px" }}>
                      Enter 6-digit OTP
                    </label>
                    <OtpBoxes otp={otp} setOtp={setOtp} disabled={verifying} />
                  </div>

                  <button
                    id="verify-otp-btn"
                    onClick={handleVerifyOtp}
                    disabled={verifying || otp.length < 6}
                    style={{
                      ...primaryBtnStyle,
                      background: (verifying || otp.length < 6) ? "#86efac" : "#16a34a",
                      cursor:     (verifying || otp.length < 6) ? "not-allowed" : "pointer",
                    }}
                  >
                    {verifying ? "Verifying..." : "Verify & Login"}
                  </button>

                  {/* Resend */}
                  <div style={{ textAlign: "center", fontSize: "13px", color: "#6b7280" }}>
                    {cooldown > 0 ? (
                      <span>
                        Resend OTP in{" "}
                        <strong style={{ color: "#374151" }}>
                          00:{String(cooldown).padStart(2, "0")}
                        </strong>
                      </span>
                    ) : (
                      <span>
                        Didn't receive it?{" "}
                        <button
                          id="resend-otp-btn"
                          onClick={handleSendOtp}
                          disabled={sending}
                          style={{
                            background: "none", border: "none",
                            color: "#16a34a", cursor: "pointer",
                            fontWeight: "700", fontSize: "13px",
                            textDecoration: "underline",
                          }}
                        >
                          {sending ? "Sending..." : "Resend OTP"}
                        </button>
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── Register link ── */}
          <p style={{ textAlign: "center", fontSize: "13px", color: "#6b7280", marginTop: "24px" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "#16a34a", fontWeight: "600", textDecoration: "underline" }}>
              Sign Up
            </Link>
          </p>
        </div>
      </div>

      {/* ── Responsive: show left image on md+ ── */}
      <style>{`
        @media (min-width: 768px) {
          .login-img-panel { display: block !important; }
        }
      `}</style>
    </div>
  );
};

// ── Shared style objects ───────────────────────────────────────────────────────
const labelStyle = {
  display: "block", fontSize: "13px", fontWeight: "600",
  color: "#374151", marginBottom: "6px",
};

const inputStyle = {
  width: "100%", border: "1.5px solid #d1d5db", borderRadius: "8px",
  padding: "11px 12px", fontSize: "14px", outline: "none",
  background: "#f9fafb", color: "#111827", boxSizing: "border-box",
  transition: "border-color 0.2s",
};

const primaryBtnStyle = {
  width: "100%", background: "#16a34a", color: "#fff",
  fontWeight: "700", fontSize: "15px", padding: "12px",
  borderRadius: "8px", border: "none", cursor: "pointer",
  transition: "background 0.2s",
};

export default Login;
