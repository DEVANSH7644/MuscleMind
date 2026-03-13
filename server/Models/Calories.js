const mongoose = require("mongoose");

const caloriesSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  calories: {
    type: Number,
    default: 0,
  },

  goal: {
    type: Number,
    default: 0,
  },

  date: {
    type: String,
    default: () => new Date().toISOString().split("T")[0],
  }

});

// prevent duplicate records for same user per day
caloriesSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Calories", caloriesSchema);