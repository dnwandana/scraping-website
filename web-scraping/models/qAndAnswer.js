const mongoose = require("../config/mongodb");

const questionsSchema = new mongoose.Schema(
  {
    question: { type: String, index: true, },
    answer: { type: String },
  },
  { timestamps: true, collection: "questions" }
);

const qAndAnswer = mongoose.model("questions", questionsSchema);

module.exports = qAndAnswer;
