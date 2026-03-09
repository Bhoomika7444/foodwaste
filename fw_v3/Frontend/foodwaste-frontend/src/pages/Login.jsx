import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAdmin, ensureSuperAdmin, SUPER_ADMIN_EMAIL } from "../utils/adminUtils";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm]       = useState({ email: "", password: "" });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email address";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Minimum 6 characters";
    return e;
  };

  const handleLogin = () => {
    const e = validate();
    if (Object.keys(e).length) return setErrors(e);
    setLoading(true);
    setErrors({});

    setTimeout(() => {
      try {
        ensureSuperAdmin(); // make sure bhoomika is always in admin list

        const allUsers = JSON.parse(localStorage.getItem("fw_users") || "[]");

        // Auto-create bhoomika's account if she hasn't signed up yet
        // so she can log in immediately without signup
        let user = allUsers.find(
          u => u.email === form.email.trim().toLowerCase() && u.password === form.password
        );

        // Special bootstrap: if logging in as super-admin email and no account exists,
        // auto-create it so Bhoomika can always log in
        if (!user && form.email.trim().toLowerCase() === SUPER_ADMIN_EMAIL) {
          const newSuper = {
            id: "superadmin_" + Date.now(),
            name: "Bhoomika",
            email: SUPER_ADMIN_EMAIL,
            password: form.password,
            createdAt: new Date().toISOString(),
          };
          allUsers.push(newSuper);
          localStorage.setItem("fw_users", JSON.stringify(allUsers));
          user = newSuper;
        }

        if (!user) {
          setErrors({ submit: "Invalid email or password. Please check and try again." });
          setLoading(false);
          return;
        }

        localStorage.setItem("fw_user", JSON.stringify({ id: user.id, name: user.name, email: user.email }));
        navigate("/home");
      } catch {
        setErrors({ submit: "Something went wrong. Please try again." });
        setLoading(false);
      }
    }, 600);
  };

  const inp = (field) => ({
    value: form[field],
    onChange: (ev) => {
      setForm(f => ({ ...f, [field]: ev.target.value }));
      setErrors(er => ({ ...er, [field]: "", submit: "" }));
    },
    onKeyDown: (ev) => { if (ev.key === "Enter") handleLogin(); },
  });

  return (
    <div className="auth-bg">
      <div className="auth-orb orb1" />
      <div className="auth-orb orb2" />
      <div className="auth-card fade-up">

        <div className="auth-icon-wrap login-icon">
          <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>

        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-sub">Sign in to continue your journey 🌱</p>

        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input className={`form-input ${errors.email ? "input-error" : ""}`}
            placeholder="you@example.com" autoComplete="email" {...inp("email")} />
          {errors.email && <p className="err-msg">{errors.email}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input type="password" className={`form-input ${errors.password ? "input-error" : ""}`}
            placeholder="••••••••" autoComplete="current-password" {...inp("password")} />
          {errors.password && <p className="err-msg">{errors.password}</p>}
        </div>

        {errors.submit && <div className="err-banner">⚠ {errors.submit}</div>}

        <button className="btn-primary" onClick={handleLogin} disabled={loading}>
          {loading
            ? <span className="btn-loading"><span className="spinner" /> Signing in…</span>
            : "Sign In →"}
        </button>

        <div className="auth-divider"><span>or</span></div>
        <p className="auth-switch">
          Don't have an account?{" "}
          <button className="link-btn" onClick={() => navigate("/signup")}>Create one</button>
        </p>
      </div>
    </div>
  );
}
