import { useState } from "react";

const workoutData = {
  Beginner: [
    {
      day: "Day 1 - Chest & Triceps",
      exercises: [
        {
          name: "Push Ups",
          sets: "3 x 15",
          video: "/exercises/pushup.mp4",
        },
        {
          name: "Bench Press",
          sets: "3 x 8",
        },
      ],
    },
  ],
};

export default function Workout() {
  const [level, setLevel] = useState("Beginner");
  const [activeVideo, setActiveVideo] = useState(null);
  const handleComplete = async () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));

    await fetch("http://localhost:5001/api/progress/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user._id,
      }),
    });

    alert("Workout Completed ✅");
  } catch (err) {
    console.error(err);
  }
};

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Workout Plans</h1>

      {/* Level Buttons */}
      <div style={styles.levelButtons}>
        {["Beginner", "Intermediate", "Advanced"].map((lvl) => (
          <button
            key={lvl}
            onClick={() => setLevel(lvl)}
            style={{
              ...styles.button,
              background: level === lvl ? "#ff5500" : "#222",
            }}
          >
            {lvl}
          </button>
        ))}
      </div>

      {/* Workout Content */}
      {workoutData[level]?.map((day, index) => (
        <div key={index} style={styles.dayCard}>
          <h2>{day.day}</h2>

          {day.exercises.map((ex, i) => (
            <div key={i} style={styles.exercise}>
              <div>
                <strong>{ex.name}</strong> — {ex.sets}
              </div>

              {ex.video && (
                <button
                  style={styles.watchBtn}
                  onClick={() => setActiveVideo(ex.video)}
                >
                  ▶ Watch Video
                </button>
                
              )}
              <button
              style={styles.doneBtn}
              onClick={() => handleComplete()}
            >
              ✅ Done
            </button>
            </div>
          ))}
        </div>
      ))}

      {/* VIDEO MODAL */}
      {activeVideo && (
        <div style={styles.modalOverlay} onClick={() => setActiveVideo(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <video
              src={activeVideo}
              controls
              autoPlay
              style={styles.video}
            />
            <button
              style={styles.closeBtn}
              onClick={() => setActiveVideo(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "30px",
    color: "white",
  },

  title: {
    marginBottom: "20px",
  },

  levelButtons: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },

  button: {
    padding: "10px 20px",
    border: "none",
    cursor: "pointer",
    color: "white",
    borderRadius: "6px",
  },

  dayCard: {
    background: "#111",
    padding: "20px",
    marginBottom: "20px",
    borderRadius: "10px",
  },

  exercise: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
    borderBottom: "1px solid #222",
    paddingBottom: "10px",
  },

  watchBtn: {
    background: "#ff5500",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer",
  },

  /* MODAL */

  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backdropFilter: "blur(8px)",
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },

  modalContent: {
    position: "relative",
    width: "60%",
    maxWidth: "800px",
  },

  video: {
    width: "100%",
    borderRadius: "10px",
  },

  closeBtn: {
    position: "absolute",
    top: "-40px",
    right: "0",
    background: "#ff5500",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer",
  },
};