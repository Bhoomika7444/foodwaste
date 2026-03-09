import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../services/apiService";

/* ── Password strength engine ── */
function analyzePassword(pw) {
  if (!pw) return { score: 0, label: "", color: "", tips: [], suggestion: "" };
  let score = 0;
  const tips = [];
  if (pw.length >= 8)  score++; else tips.push("At least 8 characters");
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++; else tips.push("Add an uppercase letter (A–Z)");
  if (/[a-z]/.test(pw)) score++; else tips.push("Add a lowercase letter (a–z)");
  if (/[0-9]/.test(pw)) score++; else tips.push("Add a number (0–9)");
  if (/[^A-Za-z0-9]/.test(pw)) score++; else tips.push("Add a special character (!@#$…)");
  const commonPatterns = ["password","123456","qwerty","abc123","letmein","welcome","admin","foodbridge"];
  if (commonPatterns.some(p => pw.toLowerCase().includes(p))) { score = Math.max(0, score - 2); tips.push("Avoid common words or patterns"); }

  const levels = [
    { min: 0, label: "Very Weak",  color: "#f87171" },
    { min: 2, label: "Weak",       color: "#fb923c" },
    { min: 3, label: "Fair",       color: "#fde047" },
    { min: 4, label: "Good",       color: "#86efac" },
    { min: 5, label: "Strong",     color: "#a3e635" },
    { min: 6, label: "Very Strong",color: "#2dd4bf" },
  ];
  const level = [...levels].reverse().find(l => score >= l.min) || levels[0];
  return { score, label: level.label, color: level.color, tips };
}

function generateSuggestion() {
  const adj   = ["Swift","Bright","Cosmic","Iron","Velvet","Noble","Silver","Jade","Storm","Amber"];
  const nouns = ["Falcon","River","Cedar","Spark","Wave","Bridge","Summit","Lantern","Forge","Cloud"];
  const num   = Math.floor(100 + Math.random() * 900);
  const sym   = ["!","@","#","$","&","*"][Math.floor(Math.random() * 6)];
  return `${adj[Math.floor(Math.random()*10)]}${nouns[Math.floor(Math.random()*10)]}${num}${sym}`;
}

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm]       = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw]   = useState(false);
  const [showCf, setShowCf]   = useState(false);
  const [suggestion, setSuggestion] = useState("");
  const [copied, setCopied]   = useState(false);

  const strength = analyzePassword(form.password);

  const validate = () => {
    const e = {};
    if (!form.name.trim())   e.name     = "Full name is required";
    if (!form.email.trim())  e.email    = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email address";
    if (!form.password)      e.password = "Password is required";
    else if (form.password.length < 8) e.password = "Minimum 8 characters";
    else if (strength.score < 3) e.password = "Password is too weak — see tips below";
    if (!form.confirm)       e.confirm  = "Please confirm your password";
    else if (form.confirm !== form.password) e.confirm = "Passwords do not match";
    return e;
  };

  const handleSignup = () => {
    const e = validate();
    if (Object.keys(e).length) return setErrors(e);
    setLoading(true);
    setErrors({});
    setTimeout(async () => {
      try {
        const response = await apiService.register({
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
        });

        if (!response.user) {
          setErrors({ submit: "Invalid response from server" });
          setLoading(false);
          return;
        }

        localStorage.setItem("fw_user", JSON.stringify({ id: response.user.id, name: response.user.name, email: response.user.email }));
        navigate("/home");
      } catch (error) {
        console.error("Signup error:", error);
        setErrors({ submit: error.message || "Something went wrong. Please try again." });
        setLoading(false);
      }
    }, 700);
  };

  const inp = (field) => ({
    value: form[field],
    onChange: (ev) => {
      setForm(f => ({ ...f, [field]: ev.target.value }));
      setErrors(er => ({ ...er, [field]: "", submit: "" }));
    },
    onKeyDown: (ev) => { if (ev.key === "Enter") handleSignup(); },
  });

  const useSuggestion = (s) => {
    setForm(f => ({ ...f, password: s, confirm: s }));
    setErrors(er => ({ ...er, password: "", confirm: "" }));
    navigator.clipboard?.writeText(s).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const newSuggestion = () => {
    const s = generateSuggestion();
    setSuggestion(s);
  };

  const strengthBars = [1, 2, 3, 4, 5, 6];
  const filledBars = Math.ceil((strength.score / 6) * 6);

  return (
    <div className="auth-bg signup-bg">
      <div className="auth-orb orb3" />
      <div className="auth-orb orb4" />
      <div className="auth-card fade-up" style={{ maxWidth: 460 }}>

        <div className="auth-icon-wrap signup-icon">
          <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>

        <h1 className="auth-title">Create account</h1>
        <p className="auth-sub">Join thousands making an impact 🍱</p>

        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input className={`form-input ${errors.name ? "input-error" : ""}`}
            placeholder="Jane Doe" autoComplete="name" {...inp("name")} />
          {errors.name && <p className="err-msg">{errors.name}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input className={`form-input ${errors.email ? "input-error" : ""}`}
            placeholder="you@example.com" autoComplete="email" {...inp("email")} />
          {errors.email && <p className="err-msg">{errors.email}</p>}
        </div>

        {/* Password with strength meter */}
        <div className="form-group">
          <label className="form-label">Password</label>
          <div className="pw-wrap">
            <input
              type={showPw ? "text" : "password"}
              className={`form-input pw-input ${errors.password ? "input-error" : ""}`}
              placeholder="Min. 8 characters"
              autoComplete="new-password"
              {...inp("password")}
            />
            <button className="pw-eye" type="button" onClick={() => setShowPw(v => !v)} tabIndex={-1}>
              {showPw ? "🙈" : "👁️"}
            </button>
          </div>

          {/* Strength bars */}
          {form.password && (
            <div className="strength-wrap">
              <div className="strength-bars">
                {strengthBars.map(i => (
                  <div key={i} className="strength-bar"
                    style={{ background: i <= filledBars ? strength.color : "rgba(255,255,255,0.08)", transition: "background 0.3s" }} />
                ))}
              </div>
              <span className="strength-label" style={{ color: strength.color }}>{strength.label}</span>
            </div>
          )}

          {/* Tips */}
          {form.password && strength.tips.length > 0 && (
            <div className="strength-tips">
              {strength.tips.map(t => <div key={t} className="strength-tip">✗ {t}</div>)}
            </div>
          )}
          {form.password && strength.score >= 5 && (
            <div className="strength-ok">✓ Great password!</div>
          )}

          {errors.password && <p className="err-msg">{errors.password}</p>}

          {/* Suggester */}
          <div className="pw-suggest-row">
            <button type="button" className="pw-suggest-btn" onClick={newSuggestion}>
              ✨ Suggest strong password
            </button>
            {suggestion && (
              <div className="pw-suggestion">
                <code className="pw-suggestion-code">{suggestion}</code>
                <button type="button" className="pw-use-btn" onClick={() => useSuggestion(suggestion)}>
                  {copied ? "✓ Copied!" : "Use this"}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Confirm Password</label>
          <div className="pw-wrap">
            <input
              type={showCf ? "text" : "password"}
              className={`form-input pw-input ${errors.confirm ? "input-error" : ""}`}
              placeholder="Re-enter your password"
              autoComplete="new-password"
              {...inp("confirm")}
            />
            <button className="pw-eye" type="button" onClick={() => setShowCf(v => !v)} tabIndex={-1}>
              {showCf ? "🙈" : "👁️"}
            </button>
          </div>
          {form.confirm && form.confirm === form.password && (
            <div className="strength-ok">✓ Passwords match</div>
          )}
          {errors.confirm && <p className="err-msg">{errors.confirm}</p>}
        </div>

        {errors.submit && <div className="err-banner">⚠ {errors.submit}</div>}

        <button className="btn-primary signup-btn" onClick={handleSignup} disabled={loading}>
          {loading
            ? <span className="btn-loading"><span className="spinner" /> Creating account…</span>
            : "Create Account →"}
        </button>

        <div className="auth-divider"><span>or</span></div>
        <p className="auth-switch">
          Already have an account?{" "}
          <button className="link-btn signup-link" onClick={() => navigate("/")}>Sign in</button>
        </p>
      </div>
    </div>
  );
}
