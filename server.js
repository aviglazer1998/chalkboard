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
app.get("*", (request, response) => {
	response.sendFile(path.join(__dirname, "public", "index.html"));
});

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
	// const student = new Student({
	// 	firstName: "Avi",
	// 	lastName: "G",
	// 	email: "aviG@gmail.com",
	// 	password: "Password123!",
	// 	type: "student",
	// 	classes: [],
	// });
	// student.save();
	// res.send("student added");
});

// app.post("/student-sign-up", (req, res) => {
// 	// console.log(req.body.box);
// 	if(req.body.box !== 'on'){
// 		console.log('is instructor')
// 	}
// 	else{
// 		console.log('is student')
// 	}
// 	const student = new Student({
// 		firstName: req.body.firstName,
// 		lastName: req.body.lastName,
// 		email: req.body.email,
// 		password: req.body.password,
// 		type: "student",
// 		classes: [],
// 	});
// 	student.save();
// 	res.sendFile(__dirname + "/public/HTML/index.html");
// });

// app.post("/instructor-sign-up", (req, res) => {
// 	const instructor = new Instructor({
// 		firstName: req.body.firstName,
// 		lastName: req.body.lastName,
// 		email: req.body.email,
// 		password: req.body.password,
// 		type: "instructor",
// 		classes: [],
// 	});
// 	instructor.save();
// });

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
										res.sendFile(__dirname + "/public/HTML/adminView.html");
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

// app.post("/student-sign-in", (req, res) => {
// 	Student.findOne({ email: req.body.email, password: req.body.password }, (err, student) => {
// 		if (err) {
// 			console.log(err);
// 		} else {
// 			if (student) {
// 				res.sendFile(__dirname + "/public/HTML/homePageStudent.html");
// 			} else {
// 				res.send("invalid");
// 			}
// 		}
// 	});
// });

// app.post("/admin-sign-in", (req, res) => {
// Admin.findOne({ email: req.body.email, password: req.body.password }, (err, admin) => {
// 	if (err) {
// 		console.log(err);
// 	} else {
// 		if (admin) {
// 			res.sendFile(__dirname + "/public/HTML/adminView.html");
// 		} else {
// 			res.send("invalid");
// 		}
// 	}
// 	});
// });
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
	classes.find({}, (err, classes) => {
		if (err) {
			console.log(err);
		} else {
			res.send(classes);
		}
	});
});

app.post("/all-admin", (req, res) => {
	Admin.findOne({}, (err, admin) => {
		if (err) {
			console.log(err);
		} else {
			res.send(admin);
			console.log(admin);
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

app.get("/createCourse.html", (req, res) => {
	res.sendFile(__dirname + "/public/HTML/createCourse.html");
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
