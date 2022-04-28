const qAndAnswer = require("../models/qAndAnswer");

class QandAnswerController {
  static async insertMany(data) {
    try {
      await qAndAnswer.insertMany(data);
      console.log(data.length + " Data inserted");
    } catch (error) {
      console.log(error);
    }
  }

  static async findAll() {
    try {
      const response = await qAndAnswer.find();
      return response;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = QandAnswerController;
