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
  date: {
    type: String,   
  },
});

module.exports = mongoose.model("Calories", caloriesSchema);