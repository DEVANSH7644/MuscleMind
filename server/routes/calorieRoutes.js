const express = require("express");
const router = express.Router();
const Calories = require("../Models/Calories");


// GET USER CALORIES
router.get("/:userId", async (req, res) => {
  try {

    const today = new Date().toISOString().slice(0, 10);

    let data = await Calories.findOne({
      userId: req.params.userId,
      date: today
    });

    if (!data) {
      data = await Calories.create({
        userId: req.params.userId,
        calories: 0,
        goal: 0,
        date: today
      });
    }

    res.json(data);

  } catch (err) {
    res.status(500).json({ message: "Error fetching calories" });
  }
});


// UPDATE CALORIES
router.post("/update", async (req, res) => {

  try {

    const { userId, calories, goal } = req.body;

    const today = new Date().toISOString().slice(0, 10);

    let data = await Calories.findOne({
      userId,
      date: today
    });

    if (!data) {

      data = new Calories({
        userId,
        calories,
        goal,
        date: today
      });

    } else {

      // replace calories (not add)
      data.calories = calories;
      data.goal = goal;

    }

    await data.save();

    res.json(data);

  } catch (err) {

    res.status(500).json({ message: "Error updating calories" });

  }

});

module.exports = router;