import { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
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
      --muted2: #ffffff;
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
      color: var(--orange);
      background: var(--orange-glow);
      border: 1px solid rgba(255,85,0,0.2);
    }
    .sidebar-item.active::before { opacity: 1; }

    .goal-btn {
      flex: 1; padding: 12px 10px; border-radius: 12px; cursor: pointer;
      border: 1px solid var(--border); background: var(--surface2);
      color: var(--muted2); font-family: 'Outfit', sans-serif;
      font-size: 12px; font-weight: 600; letter-spacing: 0.06em;
      text-align: center; transition: all 0.2s ease;
      display: flex; flex-direction: column; align-items: center; gap: 6px;
    }
    .goal-btn .goal-icon { font-size: 20px; }
    .goal-btn:hover { border-color: rgba(255,85,0,0.25); color: #ccc; }
    .goal-btn.active {
      background: var(--orange-glow);
      border-color: rgba(255,85,0,0.4);
      color: var(--orange);
      box-shadow: 0 4px 20px rgba(255,85,0,0.15);
    }

    .diet-type-btn {
      flex: 1; padding: 11px 14px; border-radius: 10px; cursor: pointer;
      border: 1px solid var(--border); background: var(--surface2);
      color: var(--muted2); font-family: 'Outfit', sans-serif;
      font-size: 13px; font-weight: 600; letter-spacing: 0.04em;
      text-align: center; transition: all 0.2s ease;
      display: flex; align-items: center; justify-content: center; gap: 8px;
    }
    .diet-type-btn:hover { border-color: rgba(255,85,0,0.2); color: #ccc; }
    .diet-type-btn.active {
      background: var(--orange-glow);
      border-color: rgba(255,85,0,0.4);
      color: var(--orange);
    }

    .meal-option-btn {
      display: flex; align-items: center; justify-content: space-between;
      width: 100%; padding: 14px 16px; border-radius: 12px;
      background: var(--surface2); border: 1px solid var(--border);
      color: #bbb; font-family: 'Outfit', sans-serif; font-size: 13px;
      font-weight: 500; cursor: pointer; text-align: left;
      transition: all 0.2s ease; position: relative; overflow: hidden;
    }
    .meal-option-btn::before {
      content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
      background: var(--orange); opacity: 0; transition: opacity 0.2s;
    }
    .meal-option-btn:hover {
      border-color: rgba(255,85,0,0.25);
      background: rgba(255,85,0,0.04);
      color: #f0f0f0;
      transform: translateX(3px);
    }
    .meal-option-btn:hover::before { opacity: 1; }

    .meal-row {
      display: flex; align-items: center; justify-content: space-between;
      padding: 12px 16px; border-radius: 10px;
      background: var(--surface2); border: 1px solid var(--border);
      font-size: 13px; color: #ccc; transition: border-color 0.2s;
    }
    .meal-row:hover { border-color: rgba(255,85,0,0.15); }

    .remove-btn {
      background: rgba(255,60,60,0.08); border: 1px solid rgba(255,60,60,0.15);
      border-radius: 7px; color: #ff7070; cursor: pointer;
      padding: 5px 10px; font-size: 11px; font-weight: 600;
      letter-spacing: 0.04em; transition: all 0.2s;
      font-family: 'Outfit', sans-serif;
    }
    .remove-btn:hover { background: rgba(255,60,60,0.18); border-color: rgba(255,60,60,0.3); }

    .plan-meal-block {
      padding: 16px; border-radius: 12px;
      background: var(--surface2); border: 1px solid var(--border);
      transition: border-color 0.2s;
    }
    .plan-meal-block:hover { border-color: rgba(255,85,0,0.15); }

    .download-btn {
      display: inline-flex; align-items: center; gap: 10px;
      padding: 14px 28px; border-radius: 12px; cursor: pointer;
      background: linear-gradient(135deg, #ff5500, #ff8844);
      border: none; color: #fff; font-family: 'Outfit', sans-serif;
      font-size: 13px; font-weight: 700; letter-spacing: 0.08em;
      transition: all 0.2s ease;
      box-shadow: 0 4px 20px rgba(255,85,0,0.35);
    }
    .download-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 32px rgba(255,85,0,0.5);
    }
    .download-btn:active { transform: translateY(0); }

    .weight-input {
      padding: 12px 16px; width: 120px;
      background: var(--surface2); border: 1px solid rgba(255,255,255,0.08);
      border-radius: 10px; color: var(--text);
      font-family: 'Outfit', sans-serif; font-size: 22px; font-weight: 700;
      outline: none; transition: border-color 0.2s, box-shadow 0.2s;
      text-align: center;
    }
    .weight-input:focus {
      border-color: rgba(255,85,0,0.45);
      box-shadow: 0 0 0 3px rgba(255,85,0,0.1);
    }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(16px); }
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
    @keyframes barFill {
      from { width: 0%; }
    }

    .fade-up-1 { animation: fadeUp 0.5s ease both; }
    .fade-up-2 { animation: fadeUp 0.5s ease 0.08s both; }
    .fade-up-3 { animation: fadeUp 0.5s ease 0.16s both; }
    .fade-up-4 { animation: fadeUp 0.5s ease 0.24s both; }
    .fade-up-5 { animation: fadeUp 0.5s ease 0.32s both; }
    .fade-up-6 { animation: fadeUp 0.5s ease 0.40s both; }

    .shimmer-text {
      background: linear-gradient(90deg, #ff5500 0%, #ff8844 40%, #ffcc99 50%, #ff8844 60%, #ff5500 100%);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: shimmer 3s linear infinite;
    }
    .orb {
      position: absolute; border-radius: 50%; filter: blur(80px);
      pointer-events: none; animation: orb-drift 8s ease-in-out infinite;
    }
    .streak-pulse { animation: pulse-dot 1.8s ease-in-out infinite; }
    .progress-fill { animation: barFill 1s cubic-bezier(0.4,0,0.2,1) 0.5s both; }
  `}</style>
);

export default function Diet() {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const navigate = useNavigate();

  const [weight, setWeight] = useState(60);
  const [dietType, setDietType] = useState("veg");
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [goalType, setGoalType] = useState("maintenance");

  let multiplier = 30;
  if (goalType === "cut") multiplier = 25;
  if (goalType === "bulk") multiplier = 35;
  const targetCalories = Math.round(weight * multiplier);

  const dietData = {
    veg: [
      { name: "Oats + Milk", calories: 350 },
      { name: "Paneer 100g", calories: 265 },
      { name: "Rice + Dal", calories: 400 },
      { name: "Peanut Butter Sandwich", calories: 300 },
      { name: "Banana Shake", calories: 250 },
    ],
    nonveg: [
      { name: "Eggs (3)", calories: 210 },
      { name: "Chicken Breast 150g", calories: 250 },
      { name: "Rice + Chicken Curry", calories: 500 },
      { name: "Fish Fry", calories: 300 },
      { name: "Milk Shake", calories: 280 },
    ],
  };

  const totalCalories = selectedMeals.reduce((sum, m) => sum + m.calories, 0);
  const remaining = Math.max(targetCalories - totalCalories, 0);
  const progress = Math.min(Math.round((totalCalories / targetCalories) * 100), 100);

  const addMeal = (meal) => setSelectedMeals((prev) => [...prev, meal]);
  const removeMeal = (index) => {
    const updated = [...selectedMeals];
    updated.splice(index, 1);
    setSelectedMeals(updated);
  };

  useEffect(() => {
    const sendCalories = async () => {
      try {
        await axios.post("http://localhost:5001/api/calories/update", {
          userId: user._id,
          calories: totalCalories,
          goal: targetCalories,
        });
      } catch (err) {
        console.error(err);
      }
    };
    if (user?._id) sendCalories();
  }, [totalCalories, targetCalories]);

  const generateDietPlan = () => {
    const breakfast = dietType === "veg"
      ? ["Oats + Milk", "Banana", "Peanut Butter Toast"]
      : ["3 Eggs", "Toast", "Milk"];
    const lunch = dietType === "veg"
      ? ["Rice + Dal", "Paneer", "Salad"]
      : ["Rice + Chicken", "Boiled Eggs"];
    const dinner = dietType === "veg"
      ? ["Chapati + Paneer", "Vegetables"]
      : ["Chicken Breast", "Chapati"];
    return [
      { meal: "Breakfast", icon: "🌅", items: breakfast },
      { meal: "Lunch", icon: "☀️", items: lunch },
      { meal: "Dinner", icon: "🌙", items: dinner },
    ];
  };
  const dietPlan = generateDietPlan();

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("MuscleMind Diet Plan", 20, 20);
    doc.setFontSize(12);
    doc.text(`Weight: ${weight} kg`, 20, 40);
    doc.text(`Goal: ${goalType}`, 20, 50);
    doc.text(`Target Calories: ${targetCalories}`, 20, 60);
    let y = 80;
    dietPlan.forEach((meal) => {
      doc.text(meal.meal, 20, y); y += 10;
      meal.items.forEach((item) => { doc.text(`• ${item}`, 30, y); y += 10; });
      y += 10;
    });
    doc.save(`musclemind-diet-${goalType}.pdf`);
  };

  // ✅ FIXED: all paths added
  const navItems = [
    { icon: "🏋️", label: "Workout", path: "/workout" },
    { icon: "🥗", label: "Diet", path: "/diet" },
    { icon: "🔥", label: "Calories", path: "/calories" },
    { icon: "📈", label: "Progress", path: "/progress" },
    { icon: "🤖", label: "Chatbot", path: "/coach" },
  ];

  const goalOptions = [
    { key: "cut", icon: "🔥", label: "FAT LOSS", cal: weight * 25 },
    { key: "maintenance", icon: "⚖️", label: "MAINTAIN", cal: weight * 30 },
    { key: "bulk", icon: "💪", label: "MUSCLE GAIN", cal: weight * 35 },
  ];

  const macroData = [
    { label: "Protein", pct: goalType === "cut" ? 40 : goalType === "bulk" ? 30 : 35, color: "#ff5500" },
    { label: "Carbs",   pct: goalType === "cut" ? 30 : goalType === "bulk" ? 50 : 40, color: "#ff8844" },
    { label: "Fats",    pct: goalType === "cut" ? 30 : goalType === "bulk" ? 20 : 25, color: "#ffaa55" },
  ];

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
                  className={`sidebar-item ${item.path === "/diet" ? "active" : ""}`}
                  onClick={() => item.path && navigate(item.path)}
                >
                  <span style={{ fontSize: 15, lineHeight: 1 }}>{item.icon}</span>
                  {item.label}
                  {item.path === "/diet" && (
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
              <div style={{ fontSize: 13, fontWeight: 600, color: "#ddd", letterSpacing: "0.02em" }}>{user?.name}</div>
              <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2, display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
                Member
              </div>
            </div>
          </div>
        </div>

        {/* ── Main Content ── */}
        <div style={S.content}>
          <div className="orb" style={{ width: 400, height: 400, background: "radial-gradient(circle, rgba(255,85,0,0.06), transparent)", top: -100, right: -100, animationDelay: "2s" }} />
          <div className="orb" style={{ width: 300, height: 300, background: "radial-gradient(circle, rgba(255,136,68,0.04), transparent)", bottom: 100, left: 100, animationDelay: "4s" }} />

          {/* Header */}
          <div style={{ marginBottom: 32 }} className="fade-up-1">
            <p style={{ fontSize: 11, color: "var(--muted2)", marginBottom: 10, letterSpacing: "0.15em", fontWeight: 600, display: "flex", alignItems: "center" }}>
              <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "var(--orange)", marginRight: 8 }} className="streak-pulse" />
              NUTRITION CENTER
            </p>
            <h1 style={{ fontSize: 46, fontWeight: 700, marginBottom: 8, letterSpacing: "-0.01em", lineHeight: 1.1, color: "#f0f0f0" }}>
              Diet <span className="shimmer-text">Planner</span>
            </h1>
            <p style={{ fontSize: 14, color: "var(--muted2)" }}>Build your perfect meal plan and hit your calorie targets</p>
          </div>

          {/* ── Row 1: Weight + Calorie Stats ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16, marginBottom: 16 }} className="fade-up-2">
            <div style={S.card}>
              <p style={S.cardLabel}>YOUR WEIGHT</p>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 10, marginTop: 8 }}>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="weight-input"
                />
                <span style={{ fontSize: 16, color: "var(--muted2)", marginBottom: 14, fontWeight: 600 }}>kg</span>
              </div>
              <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 12, letterSpacing: "0.04em" }}>
                Adjust to recalculate your daily targets
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              {[
                { label: "TARGET", value: `${targetCalories}`, unit: "kcal", accent: "#ff5500", icon: "🎯" },
                { label: "CONSUMED", value: `${totalCalories}`, unit: "kcal", accent: "#ff8844", icon: "🍽️" },
                { label: "REMAINING", value: `${remaining}`, unit: "kcal", accent: remaining === 0 ? "#22c55e" : "#ffaa55", icon: "⚡" },
              ].map((stat, i) => (
                <div key={i} style={{ ...S.card, position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 14, right: 14, fontSize: 18 }}>{stat.icon}</div>
                  <p style={S.cardLabel}>{stat.label}</p>
                  <div style={{ marginTop: 10, display: "flex", alignItems: "baseline", gap: 4 }}>
                    <span style={{ fontSize: 28, fontFamily: "'Bebas Neue', cursive", color: stat.accent, letterSpacing: "0.03em", lineHeight: 1 }}>{stat.value}</span>
                    <span style={{ fontSize: 11, color: "var(--muted2)", fontWeight: 600 }}>{stat.unit}</span>
                  </div>
                  <div style={{ marginTop: 10, height: 3, background: "rgba(255,255,255,0.05)", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: i === 0 ? "100%" : i === 1 ? `${progress}%` : `${100 - progress}%`, background: stat.accent, borderRadius: 4, transition: "width 0.5s ease" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Calorie Progress Bar ── */}
          <div style={S.card} className="fade-up-3">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div>
                <span style={S.cardLabel}>DAILY CALORIE PROGRESS</span>
                <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
                  {totalCalories} / {targetCalories} kcal consumed
                </div>
              </div>
              <span style={{ fontSize: 32, fontFamily: "'Bebas Neue', cursive", color: progress >= 100 ? "#22c55e" : "var(--orange)", lineHeight: 1 }}>
                {progress}%
              </span>
            </div>
            <div style={{ height: 10, background: "rgba(255,255,255,0.05)", borderRadius: 10, overflow: "hidden", position: "relative" }}>
              <div
                className="progress-fill"
                style={{
                  height: "100%",
                  width: `${progress}%`,
                  background: progress >= 100
                    ? "linear-gradient(90deg, #22c55e, #4ade80)"
                    : "linear-gradient(90deg, #ff5500, #ff8844, #ffaa66)",
                  borderRadius: 10,
                  boxShadow: `0 0 16px ${progress >= 100 ? "rgba(34,197,94,0.5)" : "rgba(255,85,0,0.5)"}`,
                  position: "relative", overflow: "hidden",
                }}
              >
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)", backgroundSize: "200% 100%", animation: "shimmer 2s linear infinite" }} />
              </div>
            </div>
          </div>

          {/* ── Row 2: Goal + Macros ── */}
          <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 16, marginBottom: 16 }} className="fade-up-3">
            <div style={S.card}>
              <p style={S.cardLabel}>SELECT YOUR GOAL</p>
              <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                {goalOptions.map((g) => (
                  <button key={g.key} className={`goal-btn ${goalType === g.key ? "active" : ""}`} onClick={() => setGoalType(g.key)}>
                    <span className="goal-icon">{g.icon}</span>
                    {g.label}
                    <span style={{ fontSize: 11, color: goalType === g.key ? "var(--orange)" : "var(--muted)", fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.05em" }}>
                      ~{Math.round(g.cal)} kcal
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div style={S.card}>
              <p style={S.cardLabel}>MACRO SPLIT</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
                {macroData.map((m) => (
                  <div key={m.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 11, color: "var(--muted2)", width: 48, fontWeight: 600, letterSpacing: "0.06em" }}>{m.label}</span>
                    <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 6, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${m.pct}%`, background: m.color, borderRadius: 6, boxShadow: `0 0 8px ${m.color}60`, transition: "width 0.6s ease" }} />
                    </div>
                    <span style={{ fontSize: 13, fontFamily: "'Bebas Neue', cursive", color: m.color, letterSpacing: "0.05em", width: 34, textAlign: "right" }}>{m.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Row 3: Diet Type + Meals ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16, marginBottom: 16 }} className="fade-up-4">
            <div style={S.card}>
              <p style={S.cardLabel}>DIET TYPE</p>
              <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                {[
                  { key: "veg", icon: "🥦", label: "Vegetarian" },
                  { key: "nonveg", icon: "🍗", label: "Non-Veg" },
                ].map((d) => (
                  <button key={d.key} className={`diet-type-btn ${dietType === d.key ? "active" : ""}`} onClick={() => setDietType(d.key)}>
                    <span style={{ fontSize: 18 }}>{d.icon}</span>
                    {d.label}
                  </button>
                ))}
              </div>
              {selectedMeals.length > 0 && (
                <div style={{ marginTop: 20, padding: "10px 14px", borderRadius: 10, background: "var(--orange-glow)", border: "1px solid rgba(255,85,0,0.2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: "var(--muted2)", fontWeight: 600, letterSpacing: "0.06em" }}>MEALS LOGGED</span>
                  <span style={{ fontSize: 20, fontFamily: "'Bebas Neue', cursive", color: "var(--orange)" }}>{selectedMeals.length}</span>
                </div>
              )}
            </div>

            <div style={S.card}>
              <p style={S.cardLabel}>ADD MEALS</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 14 }}>
                {dietData[dietType].map((meal, i) => (
                  <button key={i} className="meal-option-btn" onClick={() => addMeal(meal)}>
                    <span style={{ fontWeight: 500 }}>{meal.name}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 11, color: "var(--muted)" }}>+{meal.calories} kcal</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "var(--orange)", background: "rgba(255,85,0,0.1)", border: "1px solid rgba(255,85,0,0.15)", padding: "3px 10px", borderRadius: 100, letterSpacing: "0.05em" }}>ADD</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Row 4: Selected Meals + Diet Plan ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }} className="fade-up-5">
            <div style={S.card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={S.cardLabel}>TODAY'S MEALS</p>
                {selectedMeals.length > 0 && (
                  <span style={{ fontSize: 13, fontFamily: "'Bebas Neue', cursive", color: "var(--orange)", letterSpacing: "0.05em" }}>{totalCalories} KCAL</span>
                )}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 14 }}>
                {selectedMeals.length === 0 ? (
                  <div style={{ padding: "32px 16px", textAlign: "center", borderRadius: 12, background: "var(--surface2)", border: "1px dashed rgba(255,255,255,0.07)" }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>🍽️</div>
                    <p style={{ fontSize: 13, color: "var(--muted)", letterSpacing: "0.03em" }}>No meals logged yet</p>
                    <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>Add from the meal list</p>
                  </div>
                ) : (
                  selectedMeals.map((meal, i) => (
                    <div key={i} className="meal-row">
                      <div>
                        <div style={{ fontWeight: 500, color: "#ccc", fontSize: 13 }}>{meal.name}</div>
                        <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{meal.calories} kcal</div>
                      </div>
                      <button className="remove-btn" onClick={() => removeMeal(i)}>REMOVE</button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div style={S.card}>
              <p style={S.cardLabel}>SUGGESTED PLAN</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
                {dietPlan.map((meal, i) => (
                  <div key={i} className="plan-meal-block">
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <span style={{ fontSize: 14 }}>{meal.icon}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "var(--orange)", letterSpacing: "0.1em" }}>{meal.meal.toUpperCase()}</span>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {meal.items.map((item, j) => (
                        <span key={j} style={{ fontSize: 11, color: "#bbb", background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)", borderRadius: 6, padding: "3px 9px", letterSpacing: "0.02em" }}>{item}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Download ── */}
          <div className="fade-up-6">
            <button className="download-btn" onClick={downloadPDF}>
              <span>📄</span>
              DOWNLOAD DIET PLAN PDF
            </button>
            <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 10, letterSpacing: "0.04em" }}>
              Exports your goal, weight, target calories & full meal plan
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
  card: { background: "var(--surface)", padding: "20px 22px", borderRadius: 16, border: "1px solid var(--border)", position: "relative", overflow: "hidden", marginBottom: 0 },
  cardLabel: { fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", color: "var(--muted2)", textTransform: "uppercase" },
};