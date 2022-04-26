const mongoose = require("../config/mongodb");

const questionsSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, index: true },
    answer: { type: String, required: true },
  },
  { timestamps: true, collection: "questions" }
);

const qAndAnswer = mongoose.model("questions", questionsSchema);

module.exports = qAndAnswer;
