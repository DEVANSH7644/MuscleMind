import { useState, useEffect } from "react";
import axios from "axios";

export default function Diet() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [weight, setWeight] = useState(60);
  const [dietType, setDietType] = useState("veg");
  const [selectedMeals, setSelectedMeals] = useState([]);

  // Calories Goal
  const targetCalories = Math.round(weight * 33);

  // Diet Data
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

  // Total Calories Consumed
  const totalCalories = selectedMeals.reduce(
    (sum, meal) => sum + meal.calories,
    0
  );

  // Add Meal
  const addMeal = (meal) => {
    setSelectedMeals([...selectedMeals, meal]);
  };

  // Remove Meal
  const removeMeal = (index) => {
    const updated = [...selectedMeals];
    updated.splice(index, 1);
    setSelectedMeals(updated);
  };

  // Send calories to backend
  useEffect(() => {
    const sendCalories = async () => {
      try {
        await axios.post("http://localhost:5000/api/calories/update", {
          userId: user._id,
          calories: totalCalories,
          goal: targetCalories,
        });
      } catch (err) {
        console.error(err);
      }
    };

    if (user?._id) sendCalories();
  }, [totalCalories]);

  const progress = Math.min(
    Math.round((totalCalories / targetCalories) * 100),
    100
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700&display=swap');

        .diet-container {
          padding: 36px 40px;
          color: #f0f0f0;
          font-family: 'Outfit', sans-serif;
          background: #060608;
          min-height: 100vh;
        }

        .diet-container h1 {
          font-family: 'Bebas Neue', cursive;
          font-size: 42px;
          letter-spacing: 0.05em;
          margin-bottom: 28px;
          background: linear-gradient(90deg, #f0f0f0, #888);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .diet-card {
          background: #0d0d10;
          padding: 24px 26px;
          margin-bottom: 20px;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.05);
          box-shadow: 0 4px 24px rgba(0,0,0,0.3);
        }

        .diet-card h3 {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          color: #666;
          margin-bottom: 16px;
          text-transform: uppercase;
        }

        .diet-card p {
          font-size: 14px;
          color: #888;
          margin-top: 10px;
        }

        .diet-card p b {
          color: #f0f0f0;
          font-weight: 600;
        }

        .diet-input {
          padding: 11px 16px;
          margin-top: 10px;
          width: 140px;
          background: #111116;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px;
          color: #f0f0f0;
          font-family: 'Outfit', sans-serif;
          font-size: 15px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .diet-input:focus {
          border-color: rgba(255,85,0,0.4);
          box-shadow: 0 0 0 3px rgba(255,85,0,0.08);
        }

        .diet-progress-bar {
          height: 8px;
          background: rgba(255,255,255,0.05);
          border-radius: 8px;
          margin-top: 14px;
          overflow: hidden;
        }
        .diet-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #ff5500, #ff8844);
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(255,85,0,0.4);
          transition: width 0.4s ease;
          position: relative;
          overflow: hidden;
        }
        .diet-progress-fill::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
          background-size: 200% 100%;
          animation: shimmer 2s linear infinite;
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        .diet-toggle-btn {
          padding: 10px 24px;
          margin-right: 10px;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 8px;
          color: white;
          font-family: 'Outfit', sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .diet-toggle-btn:hover {
          transform: translateY(-1px);
        }
        .diet-toggle-btn.active {
          box-shadow: 0 4px 16px rgba(255,85,0,0.35);
        }

        .diet-meal-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          margin: 8px 0;
          padding: 13px 16px;
          background: #111116;
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 10px;
          color: #ccc;
          font-family: 'Outfit', sans-serif;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s, transform 0.15s;
          text-align: left;
        }
        .diet-meal-btn:hover {
          border-color: rgba(255,85,0,0.25);
          background: rgba(255,85,0,0.05);
          color: #f0f0f0;
          transform: translateX(4px);
        }
        .diet-meal-btn .kcal-badge {
          font-size: 11px;
          font-weight: 600;
          color: #ff5500;
          background: rgba(255,85,0,0.1);
          border: 1px solid rgba(255,85,0,0.15);
          padding: 3px 10px;
          border-radius: 100px;
          letter-spacing: 0.05em;
          flex-shrink: 0;
        }

        .diet-meal-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 10px;
          padding: 12px 16px;
          background: #111116;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.05);
          font-size: 13px;
          color: #ccc;
        }

        .diet-remove-btn {
          background: rgba(255, 60, 60, 0.1);
          border: 1px solid rgba(255,60,60,0.2);
          border-radius: 7px;
          color: #ff6060;
          cursor: pointer;
          padding: 4px 10px;
          font-size: 12px;
          transition: background 0.2s;
        }
        .diet-remove-btn:hover {
          background: rgba(255,60,60,0.2);
        }
      `}</style>

      <div className="diet-container">
        <h1>Diet Planner</h1>

        {/* Weight */}
        <div className="diet-card">
          <h3>Your Weight</h3>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
            className="diet-input"
          />

          <p>Calories Goal: <b>{targetCalories} kcal</b></p>
          <p>Consumed: <b>{totalCalories} kcal</b></p>

          <div className="diet-progress-bar">
            <div
              className="diet-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Diet Type Toggle */}
        <div className="diet-card">
          <h3>Select Diet Type</h3>

          <button
            className={`diet-toggle-btn ${dietType === "veg" ? "active" : ""}`}
            style={{ background: dietType === "veg" ? "#ff5500" : "#111116" }}
            onClick={() => setDietType("veg")}
          >
            🥦 Veg
          </button>

          <button
            className={`diet-toggle-btn ${dietType === "nonveg" ? "active" : ""}`}
            style={{ background: dietType === "nonveg" ? "#ff5500" : "#111116" }}
            onClick={() => setDietType("nonveg")}
          >
            🍗 Non-Veg
          </button>
        </div>

        {/* Meals */}
        <div className="diet-card">
          <h3>Meals</h3>

          {dietData[dietType].map((meal, i) => (
            <button
              key={i}
              className="diet-meal-btn"
              onClick={() => addMeal(meal)}
            >
              <span>{meal.name}</span>
              <span className="kcal-badge">+{meal.calories} kcal</span>
            </button>
          ))}
        </div>

        {/* Selected Meals */}
        <div className="diet-card">
          <h3>Your Meals</h3>

          {selectedMeals.map((meal, i) => (
            <div key={i} className="diet-meal-row">
              <span>{meal.name} — {meal.calories} kcal</span>
              <button
                className="diet-remove-btn"
                onClick={() => removeMeal(i)}
              >
                ❌
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}