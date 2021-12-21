const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const classesSchema = new Schema({
  className: String,
  classId: Number,
  classStartDate: Date,
  classEndDate: Date,
  classStartTime: String,
  classEndTime: String,
  classDays: [String],
  classInstructor: String,
  classCapacity: Number,
  classLocation: String,
  classDescription: String,
  classStudents: [Object],
  classInstructors: [Object],
  classWaitlist: [Object],
  classWaitlistCapacity: Number,
});

const Classes = mongoose.model('Classes', classesSchema);

module.exports = Classes;
