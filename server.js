const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const router = express.Router();
const mongoose = require("mongoose");
const Student = require("./models/Students");
const Instructor = require("./models/Instructor");
const classes = require("./models/Classes");
const PORT = process.env.PORT || 3000;

const dbURI = "mongodb+srv://aviglazer:Password123@chalkboard.mc7fa.mongodb.net/chalkboard?retryWrites=true&w=majority";
mongoose
	.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then((result) => {
    app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    });
  })
	.catch((err) => console.log(err));
app.use(express.static('public'));
 // load the files that are in the public directory

app.get('/', (request, response) => {
  response.sendFile(__dirname + '/public/index.html');
});

app.post("/sign-up", (req, res) => {
	const student = new Student({
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		password: req.body.password,
		classes: [],
	});

	student.save();
});

app.get("/student-sign-up", (req, res) => {
	const student = new Student({
		firstName: "miriam",
		lastName: "A",
		email: "miriamA@gmail.com",
		password: "Password123!",
		classes: [
			{
				className: "CSCI 355",
				classId: "355",
				classStart: "8:00",
				classEnd: "9:00",
				classDays: "MWF",
				classInstructor: "Abromov",
				classDescription: "This is a class",
			},
		],
	});
	student
		.save()
		.then((result) => {
			res.send(result);
		})
		.catch((err) => {
			console.log(err);
		});
});

app.get("/instructor-sign-up", (req, res) => {
	const instructor = new Instructor({
		firstName: "mark",
		lastName: "A",
		email: "markA@gmail.com",
		password: "Password123!",
		classes: [
			{
				className: "CSCI 355",
				classId: "355",
				classStart: "8:00",
				classEnd: "9:00",
				classDays: "MWF",
				classCapacity: "20",
				classDescription: "This is a class",
			},
		],
	});
	instructor
		.save()
		.then((result) => {
			res.send(result);
		})
		.catch((err) => {
			console.log(err);
		});
});
