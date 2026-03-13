import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5001/api/auth/login", form);
      console.log("LOGIN RESPONSE:", res.data);
      localStorage.setItem("token", res.data.token);
      const userData = {
        _id: res.data.user._id || res.data.user.id,
        name: res.data.user.name,
        email: res.data.user.email,
      };
      localStorage.setItem("user", JSON.stringify(userData));
      console.log("USER SAVED:", userData);
      alert("Login successful ✅");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --orange: #ff5500;
          --orange-light: #ff8844;
          --orange-glow: rgba(255,85,0,0.18);
          --dark: #060608;
          --surface: #0d0d10;
          --surface2: #111116;
          --border: rgba(255,255,255,0.05);
          --light: #f0f0f0;
          --muted: #555;
          --muted2: #888;
        }

        .auth-root {
          min-height: 100vh;
          background: var(--dark);
          display: flex;
          font-family: 'Outfit', sans-serif;
          color: var(--light);
          position: relative;
          overflow: hidden;
        }

        /* Orbs */
        .auth-orb {
          position: fixed;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(90px);
        }
        .auth-orb-1 {
          width: 500px; height: 500px;
          top: -180px; right: -150px;
          background: radial-gradient(circle, rgba(255,85,0,0.09), transparent 70%);
          animation: orbDrift 10s ease-in-out infinite;
        }
        .auth-orb-2 {
          width: 350px; height: 350px;
          bottom: -100px; left: -80px;
          background: radial-gradient(circle, rgba(255,136,68,0.06), transparent 70%);
          animation: orbDrift 14s ease-in-out infinite reverse;
        }

        @keyframes orbDrift {
          0%, 100% { transform: translate(0,0) scale(1); }
          40%       { transform: translate(20px, -15px) scale(1.04); }
          70%       { transform: translate(-12px, 10px) scale(0.97); }
        }

        /* Left panel */
        .auth-left {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 60px 70px;
          position: relative;
          z-index: 2;
          animation: fadeUp 0.5s ease both;
        }

        .auth-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 64px;
          text-decoration: none;
        }
        .auth-logo-icon {
          width: 38px; height: 38px;
          background: linear-gradient(135deg, #ff5500, #ff8844);
          border-radius: 11px;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Bebas Neue', cursive;
          font-size: 22px; color: #fff;
          box-shadow: 0 4px 20px rgba(255,85,0,0.4);
        }
        .auth-logo-text { display: flex; flex-direction: column; line-height: 1; }
        .auth-logo-text span:first-child { font-size: 15px; font-weight: 700; letter-spacing: 0.18em; color: #e8e8e8; }
        .auth-logo-text span:last-child  { font-size: 15px; font-weight: 700; letter-spacing: 0.18em; color: var(--orange); }

        .auth-tagline-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.15em;
          color: var(--orange);
          background: var(--orange-glow);
          border: 1px solid rgba(255,85,0,0.2);
          padding: 6px 14px;
          border-radius: 100px;
          margin-bottom: 24px;
          width: fit-content;
        }
        .auth-tagline-dot {
          width: 6px; height: 6px;
          background: var(--orange);
          border-radius: 50%;
          box-shadow: 0 0 8px var(--orange);
          animation: pulseDot 1.8s ease-in-out infinite;
        }
        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.6); }
        }

        .auth-big-title {
          font-family: 'Bebas Neue', cursive;
          font-size: clamp(52px, 5vw, 80px);
          line-height: 0.92;
          margin-bottom: 20px;
          letter-spacing: 0.01em;
        }
        .auth-big-title .shimmer {
          background: linear-gradient(90deg, #ff5500 0%, #ff8844 40%, #ffcc99 50%, #ff8844 60%, #ff5500 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        .auth-big-sub {
          font-size: 14px;
          color: var(--muted2);
          line-height: 1.7;
          max-width: 340px;
          margin-bottom: 48px;
        }

        .auth-features-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .auth-feature-item {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 13px;
          color: var(--muted2);
          font-weight: 500;
        }
        .auth-feature-item .icon-wrap {
          width: 34px; height: 34px;
          background: rgba(255,85,0,0.1);
          border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px;
          flex-shrink: 0;
        }

        /* Divider */
        .auth-divider {
          width: 1px;
          background: linear-gradient(to bottom, transparent, rgba(255,85,0,0.15), transparent);
          margin: 0;
          position: relative;
          z-index: 2;
          flex-shrink: 0;
        }

        /* Right panel */
        .auth-right {
          flex: 0 0 460px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 60px 52px;
          position: relative;
          z-index: 2;
          animation: fadeUp 0.5s ease 0.15s both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .auth-box {
          width: 100%;
        }

        .auth-box-header {
          margin-bottom: 36px;
        }
        .auth-title {
          font-family: 'Bebas Neue', cursive;
          font-size: 42px;
          letter-spacing: 0.05em;
          margin-bottom: 6px;
          line-height: 1;
        }
        .auth-title-sub {
          font-size: 13px;
          color: var(--muted2);
          font-weight: 400;
        }

        .auth-field {
          margin-bottom: 14px;
        }
        .auth-label {
          display: block;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          color: var(--muted2);
          margin-bottom: 8px;
        }
        .auth-input {
          width: 100%;
          padding: 13px 16px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 10px;
          color: var(--light);
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .auth-input::placeholder { color: var(--muted); }
        .auth-input:focus {
          border-color: rgba(255,85,0,0.4);
          box-shadow: 0 0 0 3px rgba(255,85,0,0.08);
        }

        .auth-button {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #ff5500, #ff8844);
          border: none;
          border-radius: 10px;
          color: white;
          font-family: 'Outfit', sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          margin-top: 8px;
          box-shadow: 0 6px 24px rgba(255,85,0,0.35);
          transition: transform 0.2s, box-shadow 0.2s;
          position: relative;
          overflow: hidden;
        }
        .auth-button::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
          background-size: 200% 100%;
          animation: shimmer 2.5s linear infinite;
        }
        .auth-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 32px rgba(255,85,0,0.5);
        }

        .auth-footer {
          margin-top: 22px;
          font-size: 13px;
          color: var(--muted2);
          text-align: center;
        }
        .auth-footer a {
          color: var(--orange);
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s;
        }
        .auth-footer a:hover { color: var(--orange-light); }

        .auth-or {
          display: flex;
          align-items: center;
          gap: 14px;
          margin: 24px 0;
          color: var(--muted);
          font-size: 12px;
          letter-spacing: 0.08em;
        }
        .auth-or::before, .auth-or::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--border);
        }

        @media (max-width: 900px) {
          .auth-left { display: none; }
          .auth-divider { display: none; }
          .auth-right { flex: 1; padding: 40px 28px; }
        }
      `}</style>

      {/* Ambient orbs */}
      <div className="auth-orb auth-orb-1" />
      <div className="auth-orb auth-orb-2" />

      {/* Left panel */}
      <div className="auth-left">
        <Link to="/" className="auth-logo">
          <div className="auth-logo-icon">M</div>
          <div className="auth-logo-text">
            <span>MUSCLE</span>
            <span>MIND</span>
          </div>
        </Link>

        <div className="auth-tagline-label">
          <span className="auth-tagline-dot" />
          YOUR FITNESS JOURNEY STARTS HERE
        </div>

        <h2 className="auth-big-title">
          Welcome<br />
          <span className="shimmer">Back.</span>
        </h2>

        <p className="auth-big-sub">
          Log in to pick up where you left off. Your workouts, progress and goals are waiting.
        </p>

        <div className="auth-features-list">
          {[
            { icon: '🏋️', text: 'Adaptive workout plans' },
            { icon: '🥗', text: 'Personalized diet tracking' },
            { icon: '🔥', text: 'Daily calorie monitoring' },
            { icon: '🤖', text: 'AI-powered fitness coach' },
          ].map((f, i) => (
            <div className="auth-feature-item" key={i}>
              <div className="icon-wrap">{f.icon}</div>
              {f.text}
            </div>
          ))}
        </div>
      </div>

      {/* Vertical divider */}
      <div className="auth-divider" />

      {/* Right panel */}
      <div className="auth-right">
        <div className="auth-box">

          <div className="auth-box-header">
            <div className="auth-title">Login</div>
            <div className="auth-title-sub">Sign in to your account to continue</div>
          </div>

          <div className="auth-field">
            <label className="auth-label">EMAIL ADDRESS</label>
            <input
              className="auth-input"
              name="email"
              type="email"
              placeholder="you@example.com"
              onChange={handleChange}
            />
          </div>

          <div className="auth-field">
            <label className="auth-label">PASSWORD</label>
            <input
              className="auth-input"
              name="password"
              type="password"
              placeholder="••••••••"
              onChange={handleChange}
            />
          </div>

          <button className="auth-button" onClick={handleLogin}>
            Login →
          </button>

          <div className="auth-footer">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </div>

        </div>
      </div>

    </div>
  );
}