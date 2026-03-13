import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Signup() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5001/api/auth/signup",
        form
      );

      alert("Signup successful ✅");

      navigate("/login");

    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="auth-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .auth-root {
          min-height: 100vh;
          background: #060608;
          display: flex;
          justify-content: center;
          align-items: center;
          font-family: 'Outfit', sans-serif;
          color: #f0f0f0;
          position: relative;
          overflow: hidden;
        }

        /* Background orbs */
        .auth-root::before {
          content: '';
          position: fixed;
          width: 500px; height: 500px;
          top: -180px; right: -150px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,85,0,0.08), transparent 70%);
          filter: blur(60px);
          pointer-events: none;
          animation: orbDrift 10s ease-in-out infinite;
        }
        .auth-root::after {
          content: '';
          position: fixed;
          width: 350px; height: 350px;
          bottom: -100px; left: -80px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,136,68,0.06), transparent 70%);
          filter: blur(60px);
          pointer-events: none;
          animation: orbDrift 14s ease-in-out infinite reverse;
        }

        @keyframes orbDrift {
          0%, 100% { transform: translate(0,0) scale(1); }
          40%       { transform: translate(20px, -15px) scale(1.04); }
          70%       { transform: translate(-12px, 10px) scale(0.97); }
        }

        .auth-box {
          width: 380px;
          padding: 44px 40px;
          background: #0d0d10;
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 20px;
          backdrop-filter: blur(20px);
          position: relative;
          z-index: 2;
          animation: fadeUp 0.5s ease both;
          box-shadow: 0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,85,0,0.05);
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .auth-title {
          font-family: 'Bebas Neue', cursive;
          font-size: 38px;
          margin-bottom: 8px;
          letter-spacing: 0.08em;
          line-height: 1;
          background: linear-gradient(90deg, #f0f0f0, #aaa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .auth-subtitle {
          font-size: 13px;
          color: #666;
          margin-bottom: 28px;
          font-weight: 400;
        }

        .auth-input {
          width: 100%;
          padding: 13px 16px;
          margin-bottom: 12px;
          background: #111116;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 10px;
          color: #f0f0f0;
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .auth-input::placeholder { color: #444; }
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
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .auth-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 32px rgba(255,85,0,0.5);
        }

        .auth-footer {
          margin-top: 20px;
          font-size: 13px;
          color: #666;
          text-align: center;
        }
        .auth-footer a {
          color: #ff5500;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s;
        }
        .auth-footer a:hover { color: #ff8844; }
      `}</style>

      <div className="auth-box">
        <div className="auth-title">Create Account</div>
        <div className="auth-subtitle">Sign up for free and start training smarter</div>

        <input
          className="auth-input"
          name="name"
          type="text"
          placeholder="Name"
          onChange={handleChange}
        />

        <input
          className="auth-input"
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
        />

        <input
          className="auth-input"
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
        />

        <button
          className="auth-button"
          onClick={handleSignup}
        >
          Signup
        </button>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}