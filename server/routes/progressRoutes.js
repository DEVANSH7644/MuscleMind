const express = require("express");
const router = express.Router();
const Progress = require("../Models/Progress");


// Update progress
router.post("/update", async (req, res) => {
  try {
    const { userId } = req.body;

    let progress = await Progress.findOne({ userId });

    if (!progress) {
      progress = new Progress({ userId, workoutsCompleted: 1, streak: 1 });
    } else {
      progress.workoutsCompleted += 1;
      progress.streak += 1;
    }

    await progress.save();

    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: "Error updating progress" });
  }
});

// Get progress
router.get("/:userId", async (req, res) => {
  try {
    const progress = await Progress.findOne({
      userId: req.params.userId,
    });

    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: "Error fetching progress" });
  }
});

module.exports = router;