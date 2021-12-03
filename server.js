const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const router = express.Router();
const mongoose = require("mongoose");
const Student = require("./models/Students");
const Instructor = require("./models/Instructor");
const Admin = require("./models/Admin");
const classes = require("./models/Classes");

const dbURI = "mongodb+srv://aviglazer:Password123@chalkboard.mc7fa.mongodb.net/chalkboard?retryWrites=true&w=majority";
mongoose
	.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then((result) => app.listen(process.env.PORT || 8000))
	.catch((err) => console.log(err));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (request, response) => {
	response.sendFile(__dirname + "/public/HTML/index.html");
});

app.get("/sign-up", (req, res) => {
	const student = new Student({
		firstName: "Avi",
		lastName: "G",
		email: "aviG@gmail.com",
		password: "Password123!",
		type: "student",
		classes: [],
	});
	student.save();
	res.send("student added");
});

app.post("/student-sign-up", (req, res) => {
	const student = new Student({
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		password: req.body.password,
		type: "student",
		classes: [],
	});
	student.save();
	res.sendFile(__dirname + "/public/HTML/index.html");
});

app.post("/instructor-sign-up", (req, res) => {
	const instructor = new Instructor({
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		password: req.body.password,
		type: "instructor",
		classes: [],
	});
	instructor.save();
});

app.get("/instructor-sign-in", (req, res) => {
	Instructor.findOne({ email: req.body.email }, (err, instructor) => {
		if (err) {
			console.log(err);
		} else {
			if (instructor) {
				res.sendFile(__dirname + "/public/HTML/homePageInstructor.html");
			} else {
				res.send("invalid");
			}
		}
	});
});
//these need to pull from the database

app.post("/student-sign-in", (req, res) => {
	Student.findOne({ email: req.body.email, password: req.body.password }, (err, student) => {
		if (err) {
			console.log(err);
		} else {
			if (student) {
				res.sendFile(__dirname + "/public/HTML/homePageStudent.html");
			} else {
				res.send("invalid");
			}
		}
	});
});

app.post("/admin-sign-in", (req, res) => {
	Admin.findOne({ email: req.body.email, password: req.body.password }, (err, admin) => {
		if (err) {
			console.log(err);
		} else {
			if (admin) {
				res.sendFile(__dirname + "/public/HTML/adminView.html");
			} else {
				res.send("invalid");
			}
		}
	});
});

app.get("one-student", (req, res) => {
	Student.findOne({ email: req.query.email }, (err, student) => {
		if (err) {
			console.log(err);
		} else {
			res.send(student);
		}
	});
});

app.get("/all-instructors", (req, res) => {
	Instructor.find({}, (err, instructors) => {
		if (err) {
			console.log(err);
		} else {
			res.send(instructors);
		}
	});
});

app.listen(() => {
	console.log(`App listening on port 8000`);
});
