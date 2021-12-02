const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const router = express.Router();
const mongoose = require("mongoose");
const Student = require("./models/Students");
const Instructor = require("./models/Instructor");
const classes = require("./models/Classes");
const Admin = require("./models/Admin");
const dbURI = "mongodb+srv://aviglazer:Password123@chalkboard.mc7fa.mongodb.net/chalkboard?retryWrites=true&w=majority";
mongoose
	.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then((result) => app.listen(8000))
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
	res.send("student added");
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
	res.send("instructor added");
});

app.get("/instructor-sign-in", (req, res) => {
	if (req.query.email && req.query.password && req.query.type === "instructor") {
		Instructor.findOne({ email: req.query.email, password: req.query.password }, (err, instructor) => {
			if (err) {
				console.log(err);
			} else {
				if (instructor) {
					res.send(instructor);
				} else {
					res.send("invalid");
				}
			}
		});
	} else {
		res.send("invalid");
	}
});
app.get("/student-sign-in", (req, res) => {
	if (req.query.email && req.query.password && req.query.type === "student") {
		Student.findOne({ email: req.query.email, password: req.query.password }, (err, student) => {
			if (err) {
				console.log(err);
			} else {
				if (student) {
					res.send(student);
				} else {
					res.send("invalid");
				}
			}
		});
	} else {
		res.send("invalid");
	}
});
app.get("/admin-sign-in", (req, res) => {
	if (req.query.email && req.query.password && req.query.type === "admin") {
		Admin.findOne({ email: req.query.email, password: req.query.password }, (err, admin) => {
			if (err) {
				console.log(err);
			} else {
				if (admin) {
					res.send(admin);
				} else {
					res.send("invalid");
				}
			}
		});
	} else {
		res.send("invalid");
	}
});
app.listen(() => {
	console.log(`App listening on port 8000`);
});
