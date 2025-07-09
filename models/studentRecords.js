const mongoose = require("mongoose");

const studentRecordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },

  rollNumber: {
    type: Number,
    required: true,
    unique: true,
  },

  course: {
    type: String,
    required: true,
  },

  age: {
    type: Number,
    required: true,
  },

  standard: {
    type: Number,
    required: true,
  },

  division: {
    type: String,
    required: true,
  },
});

const studentData = mongoose.model("student", studentRecordSchema);
module.exports = studentData;
