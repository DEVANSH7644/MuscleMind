const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  workoutsCompleted: {
    type: Number,
    default: 0,
  },
  caloriesBurned: {
    type: Number,
    default: 0,
  },
  streak: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Progress", progressSchema);