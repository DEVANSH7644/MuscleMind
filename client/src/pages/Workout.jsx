import { useState } from "react";
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

    .level-btn {
      padding: 10px 24px; border: none; cursor: pointer; color: #fff;
      border-radius: 10px; font-family: 'Outfit', sans-serif;
      font-size: 13px; font-weight: 600; letter-spacing: 0.06em;
      transition: all 0.2s ease;
    }
    .level-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(255,85,0,0.3); }

    .exercise-row {
      display: flex; align-items: center; justify-content: space-between;
      padding: 16px 20px; border-radius: 12px;
      background: var(--surface2); border: 1px solid var(--border);
      margin-top: 12px; transition: border-color 0.2s;
    }
    .exercise-row:hover { border-color: rgba(255,85,0,0.2); }

    .watch-btn {
      background: rgba(255,85,0,0.12); border: 1px solid rgba(255,85,0,0.25);
      border-radius: 8px; color: var(--orange); cursor: pointer;
      padding: 8px 16px; font-size: 12px; font-weight: 600;
      letter-spacing: 0.05em; transition: all 0.2s;
      font-family: 'Outfit', sans-serif;
    }
    .watch-btn:hover { background: rgba(255,85,0,0.22); }

    .done-btn {
      background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.25);
      border-radius: 8px; color: #4ade80; cursor: pointer;
      padding: 8px 16px; font-size: 12px; font-weight: 600;
      letter-spacing: 0.05em; transition: all 0.2s;
      font-family: 'Outfit', sans-serif;
    }
    .done-btn:hover { background: rgba(34,197,94,0.2); }

    @keyframes fadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
    @keyframes pulse-dot { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.7); } }
    @keyframes orb-drift { 0%, 100% { transform: translate(0,0) scale(1); } 33% { transform: translate(20px,-15px) scale(1.05); } 66% { transform: translate(-10px,10px) scale(0.97); } }
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
  `}</style>
);

const workoutData = {
  Beginner: [
    {
      day: "Day 1 - Chest & Triceps",
      exercises: [
        { name: "Push Ups", sets: "3 x 15", video: "/exercises/pushup.mp4" },
        { name: "Bench Press", sets: "3 x 8" },
      ],
    },
  ],
  Intermediate: [
    {
      day: "Day 1 - Push Day",
      exercises: [
        { name: "Incline Bench Press", sets: "4 x 10" },
        { name: "Shoulder Press", sets: "3 x 12" },
        { name: "Tricep Dips", sets: "3 x 15" },
      ],
    },
  ],
  Advanced: [
    {
      day: "Day 1 - Heavy Chest",
      exercises: [
        { name: "Flat Bench Press", sets: "5 x 5" },
        { name: "Weighted Dips", sets: "4 x 8" },
        { name: "Cable Flyes", sets: "4 x 12" },
      ],
    },
  ],
};

export default function Workout() {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : { name: "Athlete" };

  const [level, setLevel] = useState("Beginner");
  const [activeVideo, setActiveVideo] = useState(null);

  const navItems = [
    { icon: "🏋️", label: "Workout", path: "/workout" },
    { icon: "🥗", label: "Diet", path: "/diet" },
    { icon: "🔥", label: "Calories", path: "/calories" },
    { icon: "📈", label: "Progress", path: "/progress" },
    { icon: "🤖", label: "Chatbot", path: "/coach" },
  ];

  const handleComplete = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      await fetch("http://localhost:5001/api/progress/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id }),
      });
      alert("Workout Completed ✅");
    } catch (err) {
      console.error(err);
    }
  };

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
                  className={`sidebar-item ${item.path === "/workout" ? "active" : ""}`}
                  onClick={() => navigate(item.path)}
                >
                  <span style={{ fontSize: 15, lineHeight: 1 }}>{item.icon}</span>
                  {item.label}
                  {item.path === "/workout" && (
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
              TRAINING CENTER
            </p>
            <h1 style={{ fontSize: 46, fontWeight: 700, marginBottom: 8, letterSpacing: "-0.01em", lineHeight: 1.1, color: "#f0f0f0" }}>
              Workout <span className="shimmer-text">Plans</span> 🏋️
            </h1>
            <p style={{ fontSize: 14, color: "var(--muted2)" }}>Choose your level and crush today's session</p>
          </div>

          {/* Level Buttons */}
          <div style={{ display: "flex", gap: 12, marginBottom: 28 }} className="fade-up-2">
            {["Beginner", "Intermediate", "Advanced"].map((lvl) => (
              <button
                key={lvl}
                className="level-btn"
                onClick={() => setLevel(lvl)}
                style={{ background: level === lvl ? "linear-gradient(135deg, #ff5500, #ff8844)" : "var(--surface2)", border: level === lvl ? "none" : "1px solid var(--border)", boxShadow: level === lvl ? "0 4px 20px rgba(255,85,0,0.35)" : "none" }}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Workout Cards */}
          <div className="fade-up-3">
            {workoutData[level]?.map((day, index) => (
              <div key={index} style={S.dayCard}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                  <span style={{ fontSize: 16 }}>📅</span>
                  <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--orange)", letterSpacing: "0.05em" }}>{day.day.toUpperCase()}</h2>
                </div>
                <div style={{ height: 1, background: "var(--border)", marginBottom: 4 }} />

                {day.exercises.map((ex, i) => (
                  <div key={i} className="exercise-row">
                    <div>
                      <div style={{ fontWeight: 600, color: "#e0e0e0", fontSize: 14 }}>{ex.name}</div>
                      <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 3, letterSpacing: "0.04em" }}>{ex.sets}</div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      {ex.video && (
                        <button className="watch-btn" onClick={() => setActiveVideo(ex.video)}>▶ Watch</button>
                      )}
                      <button className="done-btn" onClick={handleComplete}>✅ Done</button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <div style={S.modalOverlay} onClick={() => setActiveVideo(null)}>
          <div style={S.modalContent} onClick={(e) => e.stopPropagation()}>
            <button style={S.closeBtn} onClick={() => setActiveVideo(null)}>✕</button>
            <video src={activeVideo} controls autoPlay style={{ width: "100%", borderRadius: 12 }} />
          </div>
        </div>
      )}
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
  content: { flex: 1, padding: "40px 44px", position: "relative", overflow: "auto" },
  dayCard: { background: "var(--surface)", padding: "24px", borderRadius: 16, border: "1px solid var(--border)", marginBottom: 20 },
  modalOverlay: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backdropFilter: "blur(8px)", background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
  modalContent: { position: "relative", width: "60%", maxWidth: 800 },
  closeBtn: { position: "absolute", top: -44, right: 0, background: "#ff5500", border: "none", padding: "8px 14px", borderRadius: 8, color: "white", cursor: "pointer", fontSize: 14, fontWeight: 700 },
};