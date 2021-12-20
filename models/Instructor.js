const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const instructorSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  type: String,
  //   classes: [
  //     {
  //       className: String,
  //       classId: String,
  //       classStart: String,
  //       classEnd: String,
  //       classDays: String,
  //       classCapacity: Number,
  //       classDescription: String,
  //     },
  //   ],
  classes: [],
});

const Instructor = mongoose.model('Instructor', instructorSchema);

module.exports = Instructor;
