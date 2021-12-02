const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Student = require("./Students");


const classesSchema = new Schema({
	className: String,
	classId: String,
	classStart: String,
	classEnd: String,
	classDays: String,
	classInstructor: String,
    classCapacity: Number,
    classLocation: String,
	classDescription: String,
});

// const Classes = mongoose.model("Classes", studentSchema);

// module.exports = Classes;
