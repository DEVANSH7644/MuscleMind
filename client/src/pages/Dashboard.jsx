import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --orange: #ff5500;
      --orange-glow: rgba(255,85,0,0.18);
      --orange-light: #ff8844;
      --bg: #060608;
      --surface: #0d0d10;
      --surface2: #111116;
      --border: rgba(255,255,255,0.05);
      --text: #f0f0f0;
      --muted: #555;
      --muted2: #ffffff;
    }

    body { background: var(--bg); }

    .sidebar-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 11px 14px;
      border-radius: 10px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      color: var(--muted2);
      letter-spacing: 0.03em;
      transition: all 0.2s ease;
      position: relative;
      overflow: hidden;
    }
    .sidebar-item::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, var(--orange-glow), transparent);
      opacity: 0;
      transition: opacity 0.2s ease;
    }
    .sidebar-item:hover { color: #fff; }
    .sidebar-item:hover::before { opacity: 0.5; }
    .sidebar-item.active {
      color: var(--orange);
      background: var(--orange-glow);
      border: 1px solid rgba(255,85,0,0.2);
    }
    .sidebar-item.active::before { opacity: 1; }

    .stat-card {
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 40px rgba(255,85,0,0.12);
    }

    .module-card {
      transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
    }
    .module-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 16px 48px rgba(255,85,0,0.15);
      border-color: rgba(255,85,0,0.3) !important;
    }
    .module-card:hover .module-icon {
      transform: scale(1.2) rotate(-5deg);
    }
    .module-icon {
      display: block;
      font-size: 28px;
      margin-bottom: 10px;
      transition: transform 0.25s ease;
    }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(18px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes barFill {
      from { width: 0%; }
    }
    @keyframes pulse-dot {
      0%, 100% { opacity: 1; transform: scale(1); }
      50%       { opacity: 0.5; transform: scale(0.7); }
    }
    @keyframes shimmer {
      0%   { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
    @keyframes orb-drift {
      0%, 100% { transform: translate(0, 0) scale(1); }
      33%       { transform: translate(20px, -15px) scale(1.05); }
      66%       { transform: translate(-10px, 10px) scale(0.97); }
    }

    .fade-up-1 { animation: fadeUp 0.5s ease both; }
    .fade-up-2 { animation: fadeUp 0.5s ease 0.1s both; }
    .fade-up-3 { animation: fadeUp 0.5s ease 0.2s both; }
    .fade-up-4 { animation: fadeUp 0.5s ease 0.3s both; }
    .fade-up-5 { animation: fadeUp 0.5s ease 0.4s both; }

    .progress-bar-fill {
      animation: barFill 1s cubic-bezier(0.4, 0, 0.2, 1) 0.6s both;
    }

    .streak-pulse {
      animation: pulse-dot 1.8s ease-in-out infinite;
    }

    .shimmer-text {
      background: linear-gradient(90deg, #ff5500 0%, #ff8844 40%, #ffcc99 50%, #ff8844 60%, #ff5500 100%);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: shimmer 3s linear infinite;
    }

    .orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      pointer-events: none;
      animation: orb-drift 8s ease-in-out infinite;
    }
  `}</style>
);

export default function Dashboard() {
  const location = useLocation();
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : { name: "Athlete" };

  const navigate = useNavigate();
  const hour = new Date().getHours();

  const [userProgress, setUserProgress] = useState({
    workoutsCompleted: 0,
    streak: 0,
    calories: 0,
  });

  let greeting = "GOOD MORNING";
  if (hour >= 12 && hour < 18) greeting = "GOOD AFTERNOON";
  if (hour >= 18) greeting = "GOOD EVENING";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const progressRes = await axios.get(
          `http://localhost:5001/api/progress/${user._id}`
        );
        const caloriesRes = await axios.get(
          `http://localhost:5001/api/calories/${user._id}`
        );
        const progressData = progressRes.data;
        const workoutsCompleted = progressData.length;
        let streak = 0;
        const today = new Date();
        progressData.forEach((p) => {
          const diff = (today - new Date(p.date)) / (1000 * 60 * 60 * 24);
          if (diff <= 1) streak++;
        });
        setUserProgress({
          workoutsCompleted,
          streak,
          calories: caloriesRes.data.calories || 0,
        });
      } catch (err) {
        console.error(err);
      }
    };
    if (user?._id) fetchData();
  }, [user?._id]);

  const completed = userProgress.workoutsCompleted || 0;
  const total = 30;
  const progress = Math.min(Math.round((completed / total) * 100), 100);

  const navItems = [
    { icon: '🏋️', label: 'Workout', path: "/workout" },
    { icon: '🥗', label: 'Diet', path: "/diet" },
    { icon: '🔥', label: 'Calories', path: "/calories" },
    { icon: '📈', label: 'Progress', path: "/progress" },
    { icon: '🤖', label: 'Chatbot', path: "/coach" },
  ];

  const moduleItems = [
    { icon: '🏋️', label: 'Workout Plans', sub: 'View your routines', path: "/workout" },
    { icon: '🥗', label: 'Diet Plans', sub: 'Track nutrition', path: "/diet" },
    { icon: '🔥', label: 'Calorie Tracker', sub: 'Daily intake log', path: "/calories" },
    { icon: '🤖', label: 'AI Chatbot', sub: 'Your fitness coach', path: "/coach" },
  ];

  return (
    <>
      <GlobalStyles />
      <div style={styles.container}>

        {/* Sidebar */}
        <div style={styles.sidebar}>
          <div className="orb" style={{ width: 160, height: 160, background: 'radial-gradient(circle, rgba(255,85,0,0.12), transparent)', top: 60, left: -60, animationDelay: '0s' }} />

          <div>
            <div style={styles.logoWrap}>
              <div style={styles.logoIcon}>
                <span style={{ fontSize: 20, filter: 'drop-shadow(0 0 6px rgba(255,85,0,0.8))' }}>M</span>
              </div>
              <div>
                <div style={styles.logoText}>MUSCLE</div>
                <div style={styles.logoSub}>MIND</div>
              </div>
            </div>

            <div style={styles.sidebarDivider} />

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              {navItems.map((item, i) => (
                <div
                  key={i}
                  className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
                  onClick={() => item.path && navigate(item.path)}
                >
                  <span style={{ fontSize: 15, lineHeight: 1 }}>{item.icon}</span>
                  {item.label}
                  {location.pathname === item.path && (
                    <span style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: 'var(--orange)', display: 'inline-block' }} className="streak-pulse" />
                  )}
                </div>
              ))}
            </nav>
          </div>

          <div style={styles.sidebarFooter}>
            <div style={styles.avatarCircle}>
              <span style={{ fontSize: 15, fontWeight: 700 }}>{user?.name?.[0]?.toUpperCase()}</span>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#ddd', letterSpacing: '0.02em' }}>
                {user?.name}
              </div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
                Member
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={styles.content}>

          <div className="orb" style={{ width: 400, height: 400, background: 'radial-gradient(circle, rgba(255,85,0,0.06), transparent)', top: -100, right: -100, animationDelay: '2s' }} />
          <div className="orb" style={{ width: 300, height: 300, background: 'radial-gradient(circle, rgba(255,136,68,0.04), transparent)', bottom: 100, left: 100, animationDelay: '4s' }} />

          {/* Header */}
          <div style={styles.header} className="fade-up-1">
            <p style={styles.headerLabel}>
              <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: 'var(--orange)', marginRight: 8, verticalAlign: 'middle' }} className="streak-pulse" />
              {greeting}
            </p>
            <h1 style={styles.headerTitle}>
              Hey, <span className="shimmer-text">{user?.name}</span> 👋
            </h1>
            <p style={styles.headerSub}>
              Ready to crush your fitness goals today?
            </p>
          </div>

          {/* Progress Bar */}
          <div style={styles.goalBar} className="fade-up-2">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div>
                <span style={{ fontSize: 11, letterSpacing: '0.12em', color: 'var(--muted2)', fontWeight: 600 }}>MONTHLY GOAL PROGRESS</span>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 3 }}>{completed} of {total} workouts completed</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: 28, fontFamily: "'Bebas Neue', cursive", color: 'var(--orange)', lineHeight: 1 }}>{progress}%</span>
              </div>
            </div>
            <div style={{ height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 8, overflow: 'hidden', position: 'relative' }}>
              <div
                className="progress-bar-fill"
                style={{
                  height: '100%',
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, #ff5500, #ff8844, #ffaa66)',
                  borderRadius: 8,
                  boxShadow: '0 0 16px rgba(255,85,0,0.5)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 2s linear infinite',
                }} />
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div style={styles.cards} className="fade-up-3">
            {[
              { icon: '🔥', label: 'Calories', value: `${userProgress.calories} kcal`, accent: '#ff5500' },
              { icon: '🏋️', label: 'Workouts Done', value: String(userProgress.workoutsCompleted), accent: '#ff8844' },
              { icon: '📈', label: 'Day Streak', value: `${userProgress.streak} days`, accent: '#ffaa55' },
            ].map((card, i) => (
              <div key={i} style={{ ...styles.card, borderColor: i === 0 ? 'rgba(255,85,0,0.15)' : 'var(--border)' }} className="stat-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: `rgba(255,85,0,${0.12 - i * 0.02})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                    {card.icon}
                  </div>
                  <div
                    className="streak-pulse"
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: card.accent,
                      boxShadow: `0 0 12px ${card.accent}`,
                      animationDelay: `${i * 0.3}s`,
                    }}
                  />
                </div>
                <div style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.1em', marginBottom: 6, fontWeight: 500 }}>{card.label.toUpperCase()}</div>
                <div style={{ fontSize: 30, fontFamily: "'Bebas Neue', cursive", color: 'var(--text)', letterSpacing: '0.05em', lineHeight: 1 }}>{card.value}</div>
              </div>
            ))}
          </div>

          {/* Module Cards */}
          <div style={styles.modules} className="fade-up-4">
            {moduleItems.map((m, i) => (
              <div
                key={i}
                style={styles.moduleCard}
                className="module-card"
                onClick={() => m.path && navigate(m.path)}
              >
                <span className="module-icon">{m.icon}</span>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#ddd', marginBottom: 4, letterSpacing: '0.02em' }}>{m.label}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.03em' }}>{m.sub}</div>
                <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--orange)', fontWeight: 600, letterSpacing: '0.08em' }}>
                  OPEN <span style={{ fontSize: 14 }}>→</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    background: 'var(--bg)',
    color: 'var(--text)',
    fontFamily: "'Outfit', sans-serif",
    position: 'relative',
    overflow: 'hidden',
  },
  sidebar: {
    width: '230px',
    background: 'var(--surface)',
    padding: '28px 16px',
    borderRight: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden',
    flexShrink: 0,
  },
  logoWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 28,
    paddingLeft: 4,
  },
  logoIcon: {
    width: 38,
    height: 38,
    background: 'linear-gradient(135deg, #ff5500, #ff8844)',
    borderRadius: 11,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 20px rgba(255,85,0,0.4)',
    fontWeight: 900,
    color: '#fff',
    fontFamily: "'Bebas Neue', cursive",
  },
  logoText: {
    fontSize: 17,
    fontWeight: 700,
    letterSpacing: '0.18em',
    color: '#e8e8e8',
    lineHeight: 1.1,
  },
  logoSub: {
    fontSize: 17,
    fontWeight: 700,
    letterSpacing: '0.18em',
    color: 'var(--orange)',
    lineHeight: 1.1,
  },
  sidebarDivider: {
    height: 1,
    background: 'linear-gradient(90deg, transparent, rgba(255,85,0,0.2), transparent)',
    marginBottom: 16,
  },
  sidebarFooter: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '14px 12px',
    borderRadius: 12,
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--border)',
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #ff5500, #ff8844)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    flexShrink: 0,
    boxShadow: '0 2px 12px rgba(255,85,0,0.35)',
  },
  content: {
    flex: 1,
    padding: '40px 44px',
    position: 'relative',
    overflow: 'hidden',
  },
  header: {
    marginBottom: 32,
  },
  headerLabel: {
    fontSize: 11,
    color: 'var(--muted2)',
    marginBottom: 10,
    letterSpacing: '0.15em',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 46,
    fontWeight: 700,
    marginBottom: 8,
    letterSpacing: '-0.01em',
    lineHeight: 1.1,
    color: '#f0f0f0',
  },
  headerSub: {
    fontSize: 14,
    color: 'var(--muted2)',
    fontWeight: 400,
  },
  goalBar: {
    marginBottom: 28,
    background: 'var(--surface)',
    padding: '20px 24px',
    borderRadius: 16,
    border: '1px solid var(--border)',
    position: 'relative',
    overflow: 'hidden',
  },
  cards: {
    display: 'flex',
    gap: 16,
    marginBottom: 28,
  },
  card: {
    flex: 1,
    background: 'var(--surface)',
    padding: '20px 22px',
    borderRadius: 16,
    border: '1px solid var(--border)',
    cursor: 'default',
    position: 'relative',
    overflow: 'hidden',
  },
  modules: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 16,
  },
  moduleCard: {
    background: 'var(--surface)',
    padding: '24px 26px',
    borderRadius: 16,
    cursor: 'pointer',
    border: '1px solid var(--border)',
    position: 'relative',
    overflow: 'hidden',
  },
};