const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const router = express.Router();
const mongoose = require("mongoose");
const Student = require("./models/Students");
const Instructor = require("./models/Instructor");
const Admin = require("./models/Admin");
const Classes = require("./models/Classes");
const path = require('path');

var id = 0;
// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


const dbURI = "mongodb+srv://aviglazer:Password123@chalkboard.mc7fa.mongodb.net/chalkboard?retryWrites=true&w=majority";
mongoose
	.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then((result) => app.listen(process.env.PORT || 8000))
	.catch((err) => console.log(err));


app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

// add this back in to allow it on the public website (heroku)

// app.get("*", (request, response) => {
// 	response.sendFile(path.join(__dirname, "public", "index.html"));
// });

app.listen(() => {
	console.log(`App listening on port 8000`);
});


app.get("/", (request, response) => {
	response.sendFile(__dirname + "/public/HTML/index.html");
	
});

app.post("/sign-up", (req, res) => {
	if (req.body.box !== "on") {
		console.log("is instructor");
		const instructor = new Instructor({
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email,
			password: req.body.password,
			type: "instructor",
			classes: [],
		});
		instructor.save();
		res.sendFile(__dirname + "/public/HTML/index.html");
	} else {
		console.log("is student");
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
	}
});



app.post("/sign-in", (req, res) => {
	Instructor.findOne({ email: req.body.email, password: req.body.password }, (err, instructor) => {
		if (err) {
			console.log(err);
		} else {
			if (instructor) {
				res.sendFile(__dirname + "/public/HTML/homePageInstructor.html");
			} else if (!instructor) {
				Student.findOne({ email: req.body.email, password: req.body.password }, (err, student) => {
					if (err) {
						console.log(err);
					} else {
						if (student) {
							res.sendFile(__dirname + "/public/HTML/homePageStudent.html");
						} else if (!student) {
							Admin.findOne({ email: req.body.email, password: req.body.password }, (err, admin) => {
								if (err) {
									console.log(err);
								} else {
									if (admin) {
										// res.sendFile(__dirname + "/public/HTML/adminView.html");
										res.render('admin');
									} else {
										console.log("no user");
									}
								}
							});
						}
					}
				});
			}
		}
	});
});

app.get('/admin-view', (req, res) => {
	Student.find({}, function (err, studentData) {
		// if (err) {
		// 	console.log(err);
		// } else {
		// 	Instructor.find({}, function (err, instructorData) {
		// 		if (err) {
		// 			console.log(err);
				// } else {
					res.render('admin', {
						practices: studentData,
						// practices: instructorData
					});
				// }
			// });
		// }	
	});
});

app.get("/all-students", (req, res) => {
	Student.find({}, (err, students) => {
		if (err) {
			console.log(err);
		} else {
			res.send(students);
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



app.get("/all-classes", (req, res) => {
	Classes.find({}, (err, classes) => {
		if (err) {
			console.log(err);
		} else {
			res.send(classes);
		}
	});
});

app.get("/one-class", (req, res) => {
	Classes.findOne({ className: req.query.className }, (err, className) => {
		if (err) {
			console.log(err);
		} else {
			res.send(className);
		}
	});
});

app.get("/index.html", (req, res) => {
	res.sendFile(__dirname + "/public/HTML/index.html");
});

app.get("/homePageStudent.html", (req, res) => {
	res.sendFile(__dirname + "/public/HTML/homePageStudent.html");
});

app.get("/studentCoursePage.html", (req, res) => {
	res.sendFile(__dirname + "/public/HTML/studentCoursePage.html");
});

app.get("/AssignmentPage.html", (req, res) => {
	res.sendFile(__dirname + "/public/HTML/AssignmentPage.html");
});

app.get("/searchClasses.html", (req, res) => {
	res.sendFile(__dirname + "/public/HTML/searchClasses.html");
});

app.get("/classResults", (req, res) => {
	Classes.findOne({ className: req.query.className }, (err, className) => {
		if (err) {
			console.log(err);
			console.log("no class");
		} else {
			res.send(className);
			console.log(className);
		}
	});
});

app.get("/createCourse.html", (req, res) => {
	res.sendFile(__dirname + "/public/HTML/createCourse.html");
});

app.post("/createClass", (req, res) => {
	const newClass = new Classes({
		className: req.body.className,
		classId: id++,
		classStartDate: req.body.classStartDate,
		classEndDate: req.body.classEndDate,
		classStartTime: req.body.classStartTime,
		classEndTime: req.body.classEndTime,
		classDays: req.body.classDays,
		classInstructor: req.body.classInstructor,
		classCapacity: req.body.classCapacity,
		classLocation: req.body.classLocation,
		classDescription: req.body.classDescription,
	});
	newClass.save();
	console.log("Class Created");
	res.sendFile(__dirname + "/public/HTML/homePageInstructor.html");
});

//make this so that its deleting the right course and not 355 as the default
app.get("/deleteCourse", (req, res) => {
	Classes.deleteOne({ className: "csci 355" }, (err) => {
		if (err) {
			console.log(err);
		} else {
			console.log("Class Deleted");
		}

		res.sendFile(__dirname + "/public/HTML/homePageInstructor.html");
	});
});

app.get("/roster.html", (req, res) => {
	res.sendFile(__dirname + "/public/HTML/roster.html");
});

app.get("/homePageInstructor.html", (req, res) => {
	res.sendFile(__dirname + "/public/HTML/homePageInstructor.html");
});

app.get("/coursePageInstructor.html", (req, res) => {
	res.sendFile(__dirname + "/public/HTML/coursePageInstructor.html");
});

app.get("/searchResults.html", (req, res) => {
	res.sendFile(__dirname + "/public/HTML/searchResults.html");
});

// use passport js for user authentication
