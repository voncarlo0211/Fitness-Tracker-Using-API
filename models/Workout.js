const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, "UserID is required"],
  },
  name: {
    type: String,
    required: [true, "name is required"],
  },
  duration: {
    type: String,
    required: [true, "duration is required"],
  },
  status: {
    type: String,
    default: "pending",
  },
  dateAdded: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("workout", workoutSchema);
