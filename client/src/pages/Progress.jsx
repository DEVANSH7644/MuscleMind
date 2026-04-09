import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --orange: #ff5500; --orange-glow: rgba(255,85,0,0.18);
      --bg: #060608; --surface: #0d0d10; --surface2: #111116;
      --border: rgba(255,255,255,0.05); --text: #f0f0f0;
      --muted: #555; --muted2: #ffffff;
    }
    body { background: var(--bg); }
    .sidebar-item {
      display: flex; align-items: center; gap: 12px;
      padding: 11px 14px; border-radius: 10px; cursor: pointer;
      font-size: 13px; font-weight: 500; color: var(--muted2);
      letter-spacing: 0.03em; transition: all 0.2s ease;
      position: relative; overflow: hidden;
    }
    .sidebar-item::before {
      content: ''; position: absolute; inset: 0;
      background: linear-gradient(90deg, var(--orange-glow), transparent);
      opacity: 0; transition: opacity 0.2s ease;
    }
    .sidebar-item:hover { color: #fff; }
    .sidebar-item:hover::before { opacity: 0.5; }
    .sidebar-item.active {
      color: var(--orange); background: var(--orange-glow);
      border: 1px solid rgba(255,85,0,0.2);
    }
    .sidebar-item.active::before { opacity: 1; }
    .stat-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
    .stat-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(255,85,0,0.12); }
    @keyframes fadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
    @keyframes pulse-dot { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.7); } }
    @keyframes orb-drift { 0%, 100% { transform: translate(0,0) scale(1); } 33% { transform: translate(20px,-15px) scale(1.05); } 66% { transform: translate(-10px,10px) scale(0.97); } }
    @keyframes barFill { from { width: 0%; } }
    .fade-up-1 { animation: fadeUp 0.5s ease both; }
    .fade-up-2 { animation: fadeUp 0.5s ease 0.1s both; }
    .fade-up-3 { animation: fadeUp 0.5s ease 0.2s both; }
    .shimmer-text {
      background: linear-gradient(90deg, #ff5500 0%, #ff8844 40%, #ffcc99 50%, #ff8844 60%, #ff5500 100%);
      background-size: 200% auto; -webkit-background-clip: text;
      -webkit-text-fill-color: transparent; background-clip: text;
      animation: shimmer 3s linear infinite;
    }
    .orb { position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none; animation: orb-drift 8s ease-in-out infinite; }
    .streak-pulse { animation: pulse-dot 1.8s ease-in-out infinite; }
    .progress-bar-fill { animation: barFill 1s cubic-bezier(0.4,0,0.2,1) 0.6s both; }
  `}</style>
);

export default function Progress() {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const navigate = useNavigate();

  const [progress, setProgress] = useState({
    workoutsCompleted: 0,
    streak: 0,
  });

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        if (!user?._id) return;
        const res = await axios.get(`http://localhost:5001/api/progress/${user._id}`);
        const data = res.data;
        const workoutsCompleted = Array.isArray(data) ? data.length : data.workoutsCompleted || 0;
        let streak = 0;
        if (Array.isArray(data)) {
          const today = new Date();
          data.forEach((p) => {
            const diff = (today - new Date(p.date)) / (1000 * 60 * 60 * 24);
            if (diff <= 1) streak++;
          });
        } else {
          streak = data.streak || 0;
        }
        setProgress({ workoutsCompleted, streak });
      } catch (err) {
        console.error(err);
      }
    };
    fetchProgress();
  }, []);

  const navItems = [
    { icon: "🏋️", label: "Workout", path: "/workout" },
    { icon: "🥗", label: "Diet", path: "/diet" },
    { icon: "🔥", label: "Calories", path: "/calories" },
    { icon: "📈", label: "Progress", path: "/progress" },
    { icon: "🤖", label: "Chatbot", path: "/coach" },
  ];

  const total = 30;
  const pct = Math.min(Math.round((progress.workoutsCompleted / total) * 100), 100);

  const stats = [
    { icon: "🏋️", label: "WORKOUTS DONE", value: String(progress.workoutsCompleted), accent: "#ff5500" },
    { icon: "🔥", label: "DAY STREAK", value: `${progress.streak}`, unit: "days", accent: "#ff8844" },
    { icon: "🎯", label: "MONTHLY GOAL", value: `${pct}%`, accent: "#ffaa55" },
  ];

  return (
    <>
      <GlobalStyles />
      <div style={S.container}>

        {/* Sidebar */}
        <div style={S.sidebar}>
          <div className="orb" style={{ width: 160, height: 160, background: "radial-gradient(circle, rgba(255,85,0,0.12), transparent)", top: 60, left: -60 }} />
          <div>
            <div style={S.logoWrap}>
              <div style={S.logoIcon}>
                <span style={{ fontSize: 20, filter: "drop-shadow(0 0 6px rgba(255,85,0,0.8))" }}>M</span>
              </div>
              <div>
                <div style={S.logoText}>MUSCLE</div>
                <div style={S.logoSub}>MIND</div>
              </div>
            </div>
            <div style={S.sidebarDivider} />
            <nav style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {navItems.map((item, i) => (
                <div
                  key={i}
                  className={`sidebar-item ${item.path === "/progress" ? "active" : ""}`}
                  onClick={() => navigate(item.path)}
                >
                  <span style={{ fontSize: 15, lineHeight: 1 }}>{item.icon}</span>
                  {item.label}
                  {item.path === "/progress" && (
                    <span style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "var(--orange)", display: "inline-block" }} className="streak-pulse" />
                  )}
                </div>
              ))}
            </nav>
          </div>
          <div style={S.sidebarFooter}>
            <div style={S.avatarCircle}>
              <span style={{ fontSize: 15, fontWeight: 700 }}>{user?.name?.[0]?.toUpperCase()}</span>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#ddd" }}>{user?.name}</div>
              <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2, display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
                Member
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={S.content}>
          <div className="orb" style={{ width: 400, height: 400, background: "radial-gradient(circle, rgba(255,85,0,0.06), transparent)", top: -100, right: -100, animationDelay: "2s" }} />

          {/* Header */}
          <div style={{ marginBottom: 32 }} className="fade-up-1">
            <p style={{ fontSize: 11, color: "var(--muted2)", marginBottom: 10, letterSpacing: "0.15em", fontWeight: 600, display: "flex", alignItems: "center" }}>
              <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "var(--orange)", marginRight: 8 }} className="streak-pulse" />
              YOUR JOURNEY
            </p>
            <h1 style={{ fontSize: 46, fontWeight: 700, marginBottom: 8, letterSpacing: "-0.01em", lineHeight: 1.1, color: "#f0f0f0" }}>
              My <span className="shimmer-text">Progress</span> 📈
            </h1>
            <p style={{ fontSize: 14, color: "var(--muted2)" }}>Track your fitness journey and celebrate every milestone</p>
          </div>

          {/* Stat Cards */}
          <div style={{ display: "flex", gap: 16, marginBottom: 28 }} className="fade-up-2">
            {stats.map((s, i) => (
              <div key={i} style={S.card} className="stat-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: `rgba(255,85,0,${0.12 - i * 0.02})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
                    {s.icon}
                  </div>
                  <div className="streak-pulse" style={{ width: 8, height: 8, borderRadius: "50%", background: s.accent, boxShadow: `0 0 12px ${s.accent}`, animationDelay: `${i * 0.3}s` }} />
                </div>
                <div style={{ fontSize: 11, color: "var(--muted)", letterSpacing: "0.1em", marginBottom: 6, fontWeight: 500 }}>{s.label}</div>
                <div style={{ fontSize: 32, fontFamily: "'Bebas Neue', cursive", color: s.accent, letterSpacing: "0.05em", lineHeight: 1 }}>
                  {s.value} {s.unit && <span style={{ fontSize: 14, color: "var(--muted2)" }}>{s.unit}</span>}
                </div>
              </div>
            ))}
          </div>

          {/* Monthly Progress Bar */}
          <div style={S.card} className="fade-up-3">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div>
                <span style={{ fontSize: 11, letterSpacing: "0.12em", color: "var(--muted2)", fontWeight: 600 }}>MONTHLY GOAL PROGRESS</span>
                <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>{progress.workoutsCompleted} of {total} workouts completed</div>
              </div>
              <span style={{ fontSize: 32, fontFamily: "'Bebas Neue', cursive", color: pct >= 100 ? "#22c55e" : "var(--orange)", lineHeight: 1 }}>{pct}%</span>
            </div>
            <div style={{ height: 10, background: "rgba(255,255,255,0.05)", borderRadius: 10, overflow: "hidden" }}>
              <div
                className="progress-bar-fill"
                style={{
                  height: "100%",
                  width: `${pct}%`,
                  background: pct >= 100 ? "linear-gradient(90deg, #22c55e, #4ade80)" : "linear-gradient(90deg, #ff5500, #ff8844, #ffaa66)",
                  borderRadius: 10,
                  boxShadow: `0 0 16px ${pct >= 100 ? "rgba(34,197,94,0.5)" : "rgba(255,85,0,0.5)"}`,
                }}
              />
            </div>
            <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 14 }}>
              {pct >= 100
                ? "🎉 You've crushed your monthly goal!"
                : `${total - progress.workoutsCompleted} more workouts to hit your monthly target.`}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

const S = {
  container: { display: "flex", minHeight: "100vh", background: "var(--bg)", color: "var(--text)", fontFamily: "'Outfit', sans-serif", position: "relative", overflow: "hidden" },
  sidebar: { width: 230, background: "var(--surface)", padding: "28px 16px", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", overflow: "hidden", flexShrink: 0 },
  logoWrap: { display: "flex", alignItems: "center", gap: 12, marginBottom: 28, paddingLeft: 4 },
  logoIcon: { width: 38, height: 38, background: "linear-gradient(135deg, #ff5500, #ff8844)", borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 20px rgba(255,85,0,0.4)", fontWeight: 900, color: "#fff", fontFamily: "'Bebas Neue', cursive" },
  logoText: { fontSize: 17, fontWeight: 700, letterSpacing: "0.18em", color: "#e8e8e8", lineHeight: 1.1 },
  logoSub: { fontSize: 17, fontWeight: 700, letterSpacing: "0.18em", color: "var(--orange)", lineHeight: 1.1 },
  sidebarDivider: { height: 1, background: "linear-gradient(90deg, transparent, rgba(255,85,0,0.2), transparent)", marginBottom: 16 },
  sidebarFooter: { display: "flex", alignItems: "center", gap: 12, padding: "14px 12px", borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)" },
  avatarCircle: { width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #ff5500, #ff8844)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0, boxShadow: "0 2px 12px rgba(255,85,0,0.35)" },
  content: { flex: 1, padding: "40px 44px", position: "relative", overflow: "hidden" },
  card: { flex: 1, background: "var(--surface)", padding: "20px 22px", borderRadius: 16, border: "1px solid var(--border)", position: "relative", overflow: "hidden", marginBottom: 16 },
};