const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI, {
  authSource: "admin",
  user: process.env.MONGO_USERNAME,
  pass: process.env.MONGO_PASSWORD,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = mongoose;
