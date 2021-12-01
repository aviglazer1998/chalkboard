const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const studentSchema = new Schema({
	firstName: String,
	lastName: String,
	email: String,
	password: String,
	classes: [
		{
			className: String,
			classId: String,
			classStart: String,
			classEnd: String,
			classDays: String,
			classInstructor: String,
			classDescription: String,
		},
	],
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
