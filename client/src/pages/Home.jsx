import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";

export default function Home() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animFrame;
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 1.5 + 0.3,
        dx: (Math.random() - 0.5) * 0.4,
        dy: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.5 + 0.1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 80, 50, ${p.opacity})`;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
      });
      animFrame = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        :root {
          --orange: #ff5500;
          --orange-light: #ff8844;
          --orange-glow: rgba(255,85,0,0.18);
          --dark: #060608;
          --surface: #0d0d10;
          --border: rgba(255,255,255,0.05);
          --light: #f0f0f0;
          --muted: #555;
          --muted2: #888;
        }

        .mm-root {
          font-family: 'Outfit', sans-serif;
          background: var(--dark);
          color: var(--light);
          min-height: 100vh;
          position: relative;
          overflow: hidden;
        }

        .mm-canvas {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }

        /* Ambient orbs */
        .mm-orb {
          position: fixed;
          border-radius: 50%;
          pointer-events: none;
          z-index: 1;
        }
        .mm-orb-1 {
          width: 600px; height: 600px;
          top: -200px; right: -150px;
          background: radial-gradient(circle, rgba(255,85,0,0.07) 0%, transparent 70%);
          animation: orbDrift 10s ease-in-out infinite;
        }
        .mm-orb-2 {
          width: 400px; height: 400px;
          bottom: -100px; left: -100px;
          background: radial-gradient(circle, rgba(255,136,68,0.05) 0%, transparent 70%);
          animation: orbDrift 14s ease-in-out infinite reverse;
        }

        @keyframes orbDrift {
          0%, 100% { transform: translate(0,0) scale(1); }
          40%       { transform: translate(25px, -20px) scale(1.04); }
          70%       { transform: translate(-15px, 12px) scale(0.97); }
        }

        /* Navbar */
        .mm-nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 10;
          padding: 20px 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--border);
          background: rgba(6,6,8,0.7);
          backdrop-filter: blur(20px);
          animation: fadeDown 0.5s ease both;
        }

        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .mm-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
        }
        .mm-logo-icon {
          width: 38px; height: 38px;
          background: linear-gradient(135deg, #ff5500, #ff8844);
          border-radius: 11px;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Bebas Neue', cursive;
          font-size: 22px; color: #fff;
          box-shadow: 0 4px 20px rgba(255,85,0,0.4);
        }
        .mm-logo-text {
          display: flex; flex-direction: column;
          line-height: 1;
        }
        .mm-logo-text span:first-child {
          font-size: 15px; font-weight: 700; letter-spacing: 0.18em; color: #e8e8e8;
        }
        .mm-logo-text span:last-child {
          font-size: 15px; font-weight: 700; letter-spacing: 0.18em; color: var(--orange);
        }

        .mm-nav-links {
          display: flex; align-items: center; gap: 8px;
        }
        .mm-nav-link {
          padding: 9px 20px;
          font-size: 13px; font-weight: 500;
          color: var(--muted2);
          text-decoration: none;
          border-radius: 8px;
          letter-spacing: 0.04em;
          transition: color 0.2s, background 0.2s;
        }
        .mm-nav-link:hover { color: #ddd; background: rgba(255,255,255,0.04); }
        .mm-nav-cta {
          padding: 9px 22px;
          font-size: 13px; font-weight: 600;
          color: #fff;
          text-decoration: none;
          border-radius: 8px;
          background: linear-gradient(135deg, #ff5500, #ff8844);
          letter-spacing: 0.06em;
          box-shadow: 0 4px 20px rgba(255,85,0,0.35);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .mm-nav-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(255,85,0,0.5);
        }

        /* Layout */
        .mm-layout {
          position: relative;
          z-index: 2;
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          padding-top: 80px;
        }

        /* Left Hero */
        .mm-hero-left {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 80px 60px;
          animation: fadeUp 0.6s ease 0.1s both;
        }

        .mm-eyebrow {
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
          margin-bottom: 28px;
          width: fit-content;
        }
        .mm-eyebrow-dot {
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

        .mm-title {
          font-family: 'Bebas Neue', cursive;
          font-size: clamp(60px, 6.5vw, 96px);
          line-height: 0.92;
          margin-bottom: 28px;
          letter-spacing: 0.01em;
        }
        .mm-title-accent {
          background: linear-gradient(90deg, #ff5500 0%, #ff8844 50%, #ffcc99 60%, #ff8844 80%, #ff5500 100%);
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

        .mm-subtitle {
          font-size: 15px;
          line-height: 1.8;
          max-width: 420px;
          margin-bottom: 44px;
          color: var(--muted2);
          font-weight: 400;
        }

        .mm-cta-group {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .mm-cta {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 15px 36px;
          background: linear-gradient(135deg, #ff5500, #ff8844);
          color: white;
          text-decoration: none;
          letter-spacing: 0.1em;
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          border-radius: 10px;
          box-shadow: 0 6px 24px rgba(255,85,0,0.4);
          transition: transform 0.2s, box-shadow 0.2s;
          position: relative;
          overflow: hidden;
        }
        .mm-cta::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
          background-size: 200% 100%;
          animation: shimmer 2.5s linear infinite;
        }
        .mm-cta:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 36px rgba(255,85,0,0.55);
        }
        .mm-cta-arrow {
          font-size: 18px;
          transition: transform 0.2s;
        }
        .mm-cta:hover .mm-cta-arrow { transform: translateX(3px); }

        .mm-cta-secondary {
          font-size: 13px;
          font-weight: 500;
          color: var(--muted2);
          text-decoration: none;
          letter-spacing: 0.05em;
          padding: 15px 20px;
          border-radius: 10px;
          border: 1px solid var(--border);
          transition: color 0.2s, border-color 0.2s;
        }
        .mm-cta-secondary:hover { color: #ddd; border-color: rgba(255,255,255,0.12); }



        /* Right features */
        .mm-hero-right {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 80px 60px 80px 40px;
          gap: 14px;
          animation: fadeUp 0.6s ease 0.25s both;
        }

        .mm-features-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.15em;
          color: var(--muted);
          margin-bottom: 8px;
        }

        .mm-feature {
          padding: 20px 22px;
          border: 1px solid var(--border);
          background: var(--surface);
          border-radius: 14px;
          display: flex;
          align-items: flex-start;
          gap: 16px;
          cursor: default;
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
          position: relative;
          overflow: hidden;
        }
        .mm-feature::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,85,0,0.04), transparent);
          opacity: 0;
          transition: opacity 0.2s;
        }
        .mm-feature:hover {
          transform: translateX(6px);
          box-shadow: 0 8px 32px rgba(255,85,0,0.1);
          border-color: rgba(255,85,0,0.2);
        }
        .mm-feature:hover::before { opacity: 1; }

        .mm-feature-icon-wrap {
          width: 42px; height: 42px;
          border-radius: 10px;
          background: rgba(255,85,0,0.1);
          display: flex; align-items: center; justify-content: center;
          font-size: 20px;
          flex-shrink: 0;
          transition: transform 0.25s ease;
        }
        .mm-feature:hover .mm-feature-icon-wrap { transform: scale(1.1) rotate(-4deg); }

        .mm-feature-body {}
        .mm-feature-title {
          font-size: 14px; font-weight: 600;
          color: #ddd;
          margin-bottom: 3px;
          letter-spacing: 0.01em;
        }
        .mm-feature-desc {
          font-size: 12px;
          color: var(--muted2);
          line-height: 1.5;
        }

        .mm-feature-tag {
          margin-left: auto;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.1em;
          color: var(--orange);
          background: var(--orange-glow);
          padding: 4px 10px;
          border-radius: 100px;
          border: 1px solid rgba(255,85,0,0.15);
          align-self: center;
          flex-shrink: 0;
        }

        /* Fade up animation */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Bottom strip */
        .mm-strip {
          position: fixed;
          bottom: 0; left: 0; right: 0;
          z-index: 5;
          padding: 12px 60px;
          background: rgba(6,6,8,0.6);
          backdrop-filter: blur(16px);
          border-top: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 40px;
          animation: fadeUp 0.5s ease 0.5s both;
        }
        .mm-strip-item {
          font-size: 11px;
          font-weight: 500;
          color: var(--muted);
          letter-spacing: 0.08em;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .mm-strip-dot {
          width: 4px; height: 4px;
          border-radius: 50%;
          background: var(--orange);
          opacity: 0.6;
        }

        @media (max-width: 900px) {
          .mm-layout { grid-template-columns: 1fr; }
          .mm-hero-left, .mm-hero-right { padding: 60px 28px; }
          .mm-nav { padding: 16px 24px; }
          .mm-strip { display: none; }
        }
      `}</style>

      <div className="mm-root">
        <canvas ref={canvasRef} className="mm-canvas" />

        {/* Ambient orbs */}
        <div className="mm-orb mm-orb-1" />
        <div className="mm-orb mm-orb-2" />

        {/* Navbar */}
        <nav className="mm-nav">
          <div className="mm-logo">
            <div className="mm-logo-icon">M</div>
            <div className="mm-logo-text">
              <span>MUSCLE</span>
              <span>MIND</span>
            </div>
          </div>
          <div className="mm-nav-links">
            <Link to="/login" className="mm-nav-link">Log In</Link>
            <Link to="/signup" className="mm-nav-cta">Get Started</Link>
          </div>
        </nav>

        <div className="mm-layout">

          {/* LEFT */}
          <div className="mm-hero-left">

            <div className="mm-eyebrow">
              <span className="mm-eyebrow-dot" />
              YOUR PERSONAL FITNESS APP
            </div>

            <h1 className="mm-title">
              Transform <br />
              <span className="mm-title-accent">Your</span> Body
            </h1>

            <p className="mm-subtitle">
              Personalized workouts, diet plans, calorie tracking and an AI fitness
              assistant — everything you need in one place.
            </p>

            <div className="mm-cta-group">
              <Link to="/signup" className="mm-cta">
                Get Started
                <span className="mm-cta-arrow">→</span>
              </Link>
              <Link to="/login" className="mm-cta-secondary">
                Log In
              </Link>
            </div>



          </div>

          {/* RIGHT FEATURES */}
          <div className="mm-hero-right">

            <div className="mm-features-label">EVERYTHING YOU NEED</div>

            <div className="mm-feature">
              <div className="mm-feature-icon-wrap">⚡</div>
              <div className="mm-feature-body">
                <div className="mm-feature-title">Adaptive Workouts</div>
                <div className="mm-feature-desc">Plans tailored from beginner to advanced — auto-adjusting as you grow.</div>
              </div>
              <div className="mm-feature-tag">NEW</div>
            </div>

            <div className="mm-feature">
              <div className="mm-feature-icon-wrap">🥗</div>
              <div className="mm-feature-body">
                <div className="mm-feature-title">Diet Plans</div>
                <div className="mm-feature-desc">Bulk & fat-loss nutrition guidance curated for your body type.</div>
              </div>
            </div>

            <div className="mm-feature">
              <div className="mm-feature-icon-wrap">🔥</div>
              <div className="mm-feature-body">
                <div className="mm-feature-title">Calorie Tracker</div>
                <div className="mm-feature-desc">Monitor daily intake with intelligent macro breakdowns.</div>
              </div>
            </div>

            <div className="mm-feature">
              <div className="mm-feature-icon-wrap">🤖</div>
              <div className="mm-feature-body">
                <div className="mm-feature-title">AI Assistant</div>
                <div className="mm-feature-desc">Ask any fitness question and get instant, expert-level guidance.</div>
              </div>
              <div className="mm-feature-tag">AI</div>
            </div>

          </div>

        </div>

        {/* Bottom strip */}
        <div className="mm-strip">
          {['No credit card required', 'Free to get started', 'Cancel anytime', 'AI-powered coaching'].map((t, i) => (
            <div className="mm-strip-item" key={i}>
              <span className="mm-strip-dot" />
              {t}
            </div>
          ))}
        </div>

      </div>
    </>
  );
}
