const mongoose = require("mongoose");

const expertSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    experience: {
      type: Number,
      required: true
    },
    rating: {
      type: Number,
      default: 4.5
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expert", expertSchema);