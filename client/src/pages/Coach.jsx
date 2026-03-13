import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
      --muted2: #888;
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
    .sidebar-item:hover { color: #ddd; }
    .sidebar-item:hover::before { opacity: 0.5; }
    .sidebar-item.active {
      color: var(--orange);
      background: var(--orange-glow);
      border: 1px solid rgba(255,85,0,0.2);
    }
    .sidebar-item.active::before { opacity: 1; }

    /* Chat bubbles */
    .bubble-user {
      align-self: flex-end;
      background: linear-gradient(135deg, #ff5500, #ff7733);
      color: #fff;
      padding: 12px 18px;
      border-radius: 18px 18px 4px 18px;
      max-width: 72%;
      font-size: 14px;
      line-height: 1.6;
      box-shadow: 0 4px 20px rgba(255,85,0,0.25);
      font-family: 'Outfit', sans-serif;
    }
    .bubble-ai {
      align-self: flex-start;
      background: var(--surface2);
      border: 1px solid rgba(255,255,255,0.07);
      color: #ddd;
      padding: 14px 18px;
      border-radius: 18px 18px 18px 4px;
      max-width: 80%;
      font-size: 14px;
      line-height: 1.7;
      font-family: 'Outfit', sans-serif;
      position: relative;
    }

    /* Typing dots */
    .typing-dot {
      width: 7px; height: 7px; border-radius: 50%;
      background: var(--muted2); display: inline-block;
      animation: typing-bounce 1.2s ease-in-out infinite;
    }
    .typing-dot:nth-child(2) { animation-delay: 0.2s; }
    .typing-dot:nth-child(3) { animation-delay: 0.4s; }
    @keyframes typing-bounce {
      0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
      30%            { transform: translateY(-6px); opacity: 1; }
    }

    /* Input */
    .chat-input {
      flex: 1;
      background: transparent;
      border: none;
      outline: none;
      color: var(--text);
      font-family: 'Outfit', sans-serif;
      font-size: 14px;
      resize: none;
      line-height: 1.5;
      max-height: 120px;
      min-height: 24px;
    }
    .chat-input::placeholder { color: var(--muted); }

    /* Send button */
    .send-btn {
      width: 42px; height: 42px; border-radius: 12px; flex-shrink: 0;
      background: linear-gradient(135deg, #ff5500, #ff8844);
      border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 16px rgba(255,85,0,0.4);
      transition: all 0.2s ease;
    }
    .send-btn:hover { transform: scale(1.05); box-shadow: 0 6px 24px rgba(255,85,0,0.55); }
    .send-btn:active { transform: scale(0.97); }
    .send-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

    /* Suggestion chips */
    .chip {
      padding: 8px 14px; border-radius: 100px;
      background: var(--surface2); border: 1px solid var(--border);
      color: var(--muted2); font-family: 'Outfit', sans-serif;
      font-size: 12px; font-weight: 500; cursor: pointer;
      transition: all 0.2s ease; white-space: nowrap; letter-spacing: 0.02em;
    }
    .chip:hover {
      border-color: rgba(255,85,0,0.3);
      color: #ccc;
      background: rgba(255,85,0,0.06);
    }

    /* Scrollbar */
    .chat-scroll::-webkit-scrollbar { width: 4px; }
    .chat-scroll::-webkit-scrollbar-track { background: transparent; }
    .chat-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 4px; }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(14px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes shimmer {
      0%   { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
    @keyframes pulse-dot {
      0%, 100% { opacity: 1; transform: scale(1); }
      50%       { opacity: 0.5; transform: scale(0.7); }
    }
    @keyframes orb-drift {
      0%, 100% { transform: translate(0, 0) scale(1); }
      33%       { transform: translate(20px, -15px) scale(1.05); }
      66%       { transform: translate(-10px, 10px) scale(0.97); }
    }
    @keyframes msg-in {
      from { opacity: 0; transform: translateY(10px) scale(0.97); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }

    .fade-up-1 { animation: fadeUp 0.5s ease both; }
    .shimmer-text {
      background: linear-gradient(90deg, #ff5500 0%, #ff8844 40%, #ffcc99 50%, #ff8844 60%, #ff5500 100%);
      background-size: 200% auto;
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text; animation: shimmer 3s linear infinite;
    }
    .orb { position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none; animation: orb-drift 8s ease-in-out infinite; }
    .streak-pulse { animation: pulse-dot 1.8s ease-in-out infinite; }
    .msg-in { animation: msg-in 0.3s ease both; }
  `}</style>
);

const SUGGESTIONS = [
  "Best exercises for building chest?",
  "How much protein do I need daily?",
  "Beginner workout plan for fat loss",
  "How to improve my squat form?",
  "What to eat before a workout?",
  "How to avoid muscle soreness?",
];

const navItems = [
  { icon: "🏋️", label: "Workout", path: "/workout" },
  { icon: "🥗", label: "Diet", path: "/diet" },
  { icon: "🔥", label: "Calories" },
  { icon: "📈", label: "Progress" },
  { icon: "🤖", label: "Chatbot", path: "/coach" },
];

export default function Coach() {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : { name: "Athlete" };

  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const q = (text || question).trim();
    if (!q || loading) return;

    const userMsg = { role: "user", content: q };
    setMessages((prev) => [...prev, userMsg]);
    setQuestion("");
    setLoading(true);

    if (textareaRef.current) textareaRef.current.style.height = "24px";

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer YOUR_API_KEY",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "You are a professional fitness coach. Be concise, motivating, and practical. Use short paragraphs." },
            ...messages,
            userMsg,
          ],
        }),
      });
      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn't process that. Please try again.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Connection error. Please check your API key and try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInput = (e) => {
    setQuestion(e.target.value);
    e.target.style.height = "24px";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  const isEmpty = messages.length === 0;

  return (
    <>
      <GlobalStyles />
      <div style={S.container}>

        {/* ── Sidebar ── */}
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
                  className={`sidebar-item ${item.path === "/coach" ? "active" : ""}`}
                  onClick={() => item.path && navigate(item.path)}
                >
                  <span style={{ fontSize: 15, lineHeight: 1 }}>{item.icon}</span>
                  {item.label}
                  {item.path === "/coach" && (
                    <span style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "var(--orange)", display: "inline-block" }} className="streak-pulse" />
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* Sidebar chat stats */}
          <div>
            {messages.length > 0 && (
              <div style={{ marginBottom: 12, padding: "14px 12px", borderRadius: 12, background: "rgba(255,85,0,0.06)", border: "1px solid rgba(255,85,0,0.12)" }}>
                <p style={{ fontSize: 10, color: "var(--muted)", letterSpacing: "0.1em", marginBottom: 8, fontWeight: 600 }}>SESSION</p>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 20, fontFamily: "'Bebas Neue', cursive", color: "var(--orange)" }}>{messages.filter(m => m.role === "user").length}</div>
                    <div style={{ fontSize: 10, color: "var(--muted)", letterSpacing: "0.06em" }}>ASKED</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 20, fontFamily: "'Bebas Neue', cursive", color: "#ff8844" }}>{messages.filter(m => m.role === "assistant").length}</div>
                    <div style={{ fontSize: 10, color: "var(--muted)", letterSpacing: "0.06em" }}>ANSWERED</div>
                  </div>
                </div>
              </div>
            )}
            <div style={S.sidebarFooter}>
              <div style={S.avatarCircle}>
                <span style={{ fontSize: 15, fontWeight: 700 }}>{user?.name?.[0]?.toUpperCase()}</span>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#ddd", letterSpacing: "0.02em" }}>{user?.name}</div>
                <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2, display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
                  Member
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Chat Area ── */}
        <div style={S.content}>
          <div className="orb" style={{ width: 400, height: 400, background: "radial-gradient(circle, rgba(255,85,0,0.05), transparent)", top: -80, right: -80, animationDelay: "2s" }} />

          {/* Header */}
          <div style={S.header} className="fade-up-1">
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={S.coachAvatar}>
                <span style={{ fontSize: 22 }}>🤖</span>
              </div>
              <div>
                <p style={{ fontSize: 11, color: "var(--muted2)", letterSpacing: "0.15em", fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} className="streak-pulse" />
                  AI POWERED
                </p>
                <h1 style={{ fontSize: 36, fontWeight: 700, letterSpacing: "-0.01em", lineHeight: 1.1, color: "#f0f0f0", marginTop: 2 }}>
                  Fitness <span className="shimmer-text">Coach</span>
                </h1>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 100, background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e" }} className="streak-pulse" />
              <span style={{ fontSize: 12, color: "#4ade80", fontWeight: 600, letterSpacing: "0.06em" }}>ONLINE</span>
            </div>
          </div>

          {/* ── Messages ── */}
          <div className="chat-scroll" style={S.chatBox}>

            {/* Empty state */}
            {isEmpty && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 24, padding: "40px 20px" }}>
                <div style={S.emptyIcon}>
                  <span style={{ fontSize: 40 }}>🤖</span>
                </div>
                <div style={{ textAlign: "center" }}>
                  <h2 style={{ fontSize: 22, fontWeight: 700, color: "#ddd", marginBottom: 8, letterSpacing: "-0.01em" }}>
                    Your AI Fitness Coach
                  </h2>
                  <p style={{ fontSize: 14, color: "var(--muted2)", lineHeight: 1.6, maxWidth: 380 }}>
                    Ask me anything about workouts, nutrition, recovery, or building your perfect fitness plan.
                  </p>
                </div>

                {/* Suggestion chips */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", maxWidth: 520 }}>
                  {SUGGESTIONS.map((s, i) => (
                    <button key={i} className="chip" onClick={() => sendMessage(s)}>{s}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            {messages.map((msg, i) => (
              <div key={i} className="msg-in" style={{ display: "flex", flexDirection: "column", gap: 0, alignItems: msg.role === "user" ? "flex-end" : "flex-start" }}>

                {/* Label */}
                <span style={{ fontSize: 10, color: "var(--muted)", letterSpacing: "0.1em", fontWeight: 600, marginBottom: 6, paddingLeft: msg.role === "user" ? 0 : 4, paddingRight: msg.role === "user" ? 4 : 0 }}>
                  {msg.role === "user" ? "YOU" : "AI COACH"}
                </span>

                <div className={msg.role === "user" ? "bubble-user" : "bubble-ai"}>
                  {msg.role === "assistant" && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, paddingBottom: 10, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <div style={{ width: 22, height: 22, borderRadius: "50%", background: "linear-gradient(135deg, #ff5500, #ff8844)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, flexShrink: 0 }}>🤖</div>
                      <span style={{ fontSize: 11, color: "var(--orange)", fontWeight: 700, letterSpacing: "0.08em" }}>MUSCLE MIND COACH</span>
                    </div>
                  )}
                  <div style={{ whiteSpace: "pre-wrap" }}>{msg.content}</div>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="msg-in" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 0 }}>
                <span style={{ fontSize: 10, color: "var(--muted)", letterSpacing: "0.1em", fontWeight: 600, marginBottom: 6, paddingLeft: 4 }}>AI COACH</span>
                <div className="bubble-ai" style={{ padding: "14px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, paddingBottom: 10, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", background: "linear-gradient(135deg, #ff5500, #ff8844)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>🤖</div>
                    <span style={{ fontSize: 11, color: "var(--orange)", fontWeight: 700, letterSpacing: "0.08em" }}>MUSCLE MIND COACH</span>
                  </div>
                  <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span style={{ fontSize: 11, color: "var(--muted)", marginLeft: 4 }}>thinking...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* ── Input Area ── */}
          <div style={S.inputArea}>
            {/* Suggestion chips (shown after first message) */}
            {!isEmpty && (
              <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                {SUGGESTIONS.slice(0, 3).map((s, i) => (
                  <button key={i} className="chip" onClick={() => sendMessage(s)}>{s}</button>
                ))}
              </div>
            )}

            <div style={S.inputBox}>
              <div style={{ flex: 1 }}>
                <textarea
                  ref={textareaRef}
                  value={question}
                  onChange={handleInput}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask your fitness question... (Enter to send, Shift+Enter for new line)"
                  className="chat-input"
                  rows={1}
                />
              </div>
              <button className="send-btn" onClick={() => sendMessage()} disabled={loading || !question.trim()}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
            <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 10, letterSpacing: "0.03em", textAlign: "center" }}>
              Powered by GPT-4o Mini · Your personal AI fitness coach
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

const S = {
  container: {
    display: "flex",
    minHeight: "100vh",
    background: "var(--bg)",
    color: "var(--text)",
    fontFamily: "'Outfit', sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  sidebar: {
    width: 230,
    background: "var(--surface)",
    padding: "28px 16px",
    borderRight: "1px solid var(--border)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    position: "relative",
    overflow: "hidden",
    flexShrink: 0,
  },
  logoWrap: { display: "flex", alignItems: "center", gap: 12, marginBottom: 28, paddingLeft: 4 },
  logoIcon: {
    width: 38, height: 38,
    background: "linear-gradient(135deg, #ff5500, #ff8844)",
    borderRadius: 11,
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 4px 20px rgba(255,85,0,0.4)",
    fontWeight: 900, color: "#fff",
    fontFamily: "'Bebas Neue', cursive",
  },
  logoText: { fontSize: 17, fontWeight: 700, letterSpacing: "0.18em", color: "#e8e8e8", lineHeight: 1.1 },
  logoSub:  { fontSize: 17, fontWeight: 700, letterSpacing: "0.18em", color: "var(--orange)", lineHeight: 1.1 },
  sidebarDivider: {
    height: 1,
    background: "linear-gradient(90deg, transparent, rgba(255,85,0,0.2), transparent)",
    marginBottom: 16,
  },
  sidebarFooter: {
    display: "flex", alignItems: "center", gap: 12,
    padding: "14px 12px", borderRadius: 12,
    background: "rgba(255,255,255,0.03)",
    border: "1px solid var(--border)",
  },
  avatarCircle: {
    width: 36, height: 36, borderRadius: "50%",
    background: "linear-gradient(135deg, #ff5500, #ff8844)",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#fff", flexShrink: 0,
    boxShadow: "0 2px 12px rgba(255,85,0,0.35)",
  },
  content: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    position: "relative",
    overflow: "hidden",
  },
  header: {
    padding: "28px 40px 20px",
    borderBottom: "1px solid var(--border)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexShrink: 0,
    background: "rgba(13,13,16,0.8)",
    backdropFilter: "blur(12px)",
  },
  coachAvatar: {
    width: 52, height: 52, borderRadius: 16,
    background: "linear-gradient(135deg, rgba(255,85,0,0.2), rgba(255,136,68,0.1))",
    border: "1px solid rgba(255,85,0,0.25)",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  },
  chatBox: {
    flex: 1,
    overflowY: "auto",
    padding: "24px 40px",
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  emptyIcon: {
    width: 88, height: 88, borderRadius: 24,
    background: "linear-gradient(135deg, rgba(255,85,0,0.15), rgba(255,136,68,0.08))",
    border: "1px solid rgba(255,85,0,0.2)",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 8px 32px rgba(255,85,0,0.15)",
  },
  inputArea: {
    padding: "20px 40px 24px",
    borderTop: "1px solid var(--border)",
    flexShrink: 0,
    background: "rgba(13,13,16,0.9)",
    backdropFilter: "blur(12px)",
  },
  inputBox: {
    display: "flex",
    alignItems: "flex-end",
    gap: 12,
    padding: "14px 16px",
    borderRadius: 16,
    background: "var(--surface2)",
    border: "1px solid rgba(255,255,255,0.08)",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
};