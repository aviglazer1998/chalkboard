const express = require("express");
const session = require("express-session");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Student = require("./models/Students");
const Instructor = require("./models/Instructor");
const Admin = require("./models/Admin");
const Class = require("./models/Classes");

var id = 0;
app.set("view engine", "ejs");

const dbURI = "mongodb+srv://aviglazer:Password123@chalkboard.mc7fa.mongodb.net/chalkboard?retryWrites=true&w=majority";
const db = mongoose
	.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then((result) => app.listen(process.env.PORT || 8000))
	.catch((err) => console.log(err));

app.use(
	session({
		cookie: { maxAge: 1000 * 60 * 60 * 2, sameSite: true },
		secret: "Super Secret",
		resave: true,
		saveUninitialized: false,
	})
);

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.listen(() => {
	console.log(`App listening on port 8000`);
});

const redirectLogin = (req, res, next) => {
	if (!req.session.userId) {
		res.redirect("/");
		console.log("redirected");
	} else {
		next();
	}
};

const redirectHome = (req, res, next) => {
	if (req.session.userId) {
		if (req.session.type == "student") {
			res.redirect("/studentHomePage");
		} else if (req.session.type == "instructor") {
			res.redirect("/instructorHomePage");
		} else if (req.session.type == "admin") {
			res.redirect("/adminView");
		}
	} else {
		next();
	}
};

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
		// Instructor.register(new Instructor({ email: email }),
		//     password, function (err, user) {
		// if (err) {
		//     console.log(err);
		//     return res.sendFile(__dirname + "/public/HTML/index.html");
		// }

		// passport.authenticate("local")(
		//     req, res, function () {
		//     res.render("instructorHomePage");
		// });
		// });
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
				req.session.userId = req.body.email;
				console.log("id: " + instructor.id)
				res.redirect(`${instructor.id}/instructorHomePage`)

				
			} else if (!instructor) {
				Student.findOne({ email: req.body.email, password: req.body.password }, (err, student) => {
					if (err) {
						console.log(err);
					} else {
						if (student) {
							console.log("id: " + student.id);
							req.session.userId = req.body.email;
							res.redirect(`${student.id}/studentHomePage`);

							// console.log("id: " + student.id)
							// res.redirect(`${student.id}/studentHomePage`)
						} else if (!student) {
							Admin.findOne({ email: req.body.email, password: req.body.password }, (err, admin) => {
								if (err) {
									console.log(err);
								} else {
									if (admin) {
										req.session.userId = req.body.email;
										res.redirect("admin-view");
									} else {
										console.log("no user");
										// alert('No User Found')
										return res.redirect(__dirname + "/public/HTML/index.html");
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

app.get("/admin-view", redirectLogin, (req, res) => {
	//how to get instructors here too?
	Student.find({}, function (err, studentData) {
		res.render("admin", {
			practices: studentData,
		});
	});
});

// app.get("/studentHomePage", redirectLogin, (req, res) => {
// 	Class.find({}, function (err, classData) {
// 		res.render("studentHomePage", {
// 			practices: classData,
// 		});
// 		// console.log(classData);
// 	});
// });

// app.get("/instructorHomePage", redirectLogin, (req, res) => {
// 	Class.find({}, function (err, classData) {
// 		res.render("instructorHomePage", {
// 			practices: classData,
// 		});
// 		// console.log(classData);
// 	});
// });


app.get("/:studentId/studentHomePage",redirectLogin, (req, res) => {
	const { studentId } = req.params;
	Student.findOne({where: {id: studentId}}, (err, student) => {
		const classes = student.classes;
		Class.find({}, function (err, classData){
			res.render('studentHomePage', {
			// practices: null,
			practices: classData,
			user: student
		})
		})
	})
})

app.put("/:studentId/studentHomePage/:classId", redirectLogin, (req,res) => {
	const { studentId } = req.params;
	const { classId } = req.params;
	Class.findOne({where: {id: classId}}, (err, course) => {
		Student.findOne({where: {id: studentId}}, (err, student) => {
			course.students.add(student);

			course.save(function (err) {
				if(err){
					console.log('couldnt add course')
					render(":studentId/studentHomePage/:classId")
				} else{
					console.log(course)
					res.render(':studentId/studentHomePage/:classId', {
						user: student,
						course: course
					})
				}
			})
		})
	
	})


})

app.get("/:instructorId/instructorHomePage",redirectLogin , (req, res) => {
	const { instructorId } = req.params;
	Instructor.findOne({where: {id: instructorId}}, (err, instructor) => {
			res.render('instructorHomePage', {
			practices: null,
			// practices: classData,
			user: instructor
		})
	})
});



// app.get("/all-students", redirectLogin, (req, res) => {
app.get("/all-students", redirectLogin,(req, res) => {
	Student.find({}, (err, students) => {
		if (err) {
			console.log(err);
		} else {
			res.send(students);
		}
	});
});

app.get("/:id/class-search", (req,res) =>{	
	res.render('searchClasses');

})

app.get('/:id/search-result?', (req, res) => {
	console.log('here');
	const { id } = req.params;
	Class.findOne({ where: { className: req.body.className, classId: req.body.classId, ClassInstructor: req.body.instructorName}}, (err, course) => {
		if (course) {
			// course.instructors[0] = course.ClassInstructor
			//FOR SOME REASON THE INSTRUCTOR NAME DOESNT SHOW UP
			console.log(course.id)
			res.render('searchResults', {
				course: course,
				id: id
			})
			
		}else {
			res.redirect('searchClasses')
		}
})
})

//this is to the student course page- when a student clicks on a class that they already have 
app.get("/:id/one-class", (req, res) => {
	Class.findOne({ className: req.query.className }, (err, course) => {
		if (err) {
			console.log(err);
		} else {
			res.render('studentCoursePage', {
				course: course
			})
		}
	});
});

app.get("/all-instructors", redirectLogin, (req, res) => {
	Instructor.find({}, (err, instructors) => {
		if (err) {
			console.log(err);
		} else {
			res.send(instructors);
		}
	});
});

app.get("/all-classes", redirectLogin, (req, res) => {
	Classes.find({}, (err, classes) => {
		if (err) {
			console.log(err);
		} else {
			res.send(classes);
		}
		// res.render('admin', {
		// 	practices: studentData,
		// 	// practices: instructorData
		// });
	});
});

app.get("/one-class", redirectLogin, (req, res) => {
	Classes.findOne({ className: req.query.className }, (err, className) => {
		if (err) {
			console.log(err);
		} else {
			res.send(className);
		}
	});
});

app.post("/logout", redirectLogin, (req, res) => {
	req.session.destroy(function (err) {
		if (err) {
			console.log(err);
		} else {
			res.redirect(__dirname + "/public/HTML/index.html");
		}
	});
});

app.get("/index.html", redirectLogin, (req, res) => {
	res.sendFile(__dirname + "/public/HTML/index.html");
});

app.get("/studentCoursePage.html", redirectLogin, (req, res) => {
	res.sendFile(__dirname + "/public/HTML/studentCoursePage.html");
});

app.get("/AssignmentPage.html", redirectLogin, (req, res) => {
	res.sendFile(__dirname + "/public/HTML/AssignmentPage.html");
});

app.get("/searchClasses.html", redirectLogin, (req, res) => {
	res.sendFile(__dirname + "/public/HTML/searchClasses.html");
});

app.get("/classResults", redirectLogin, (req, res) => {
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

app.get("/createCourse.html", redirectLogin, (req, res) => {
	res.sendFile(__dirname + "/public/HTML/createCourse.html");
});

app.post("/createClass", redirectLogin, (req, res) => {
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
app.get("/deleteCourse", redirectLogin, (req, res) => {
	Classes.deleteOne({ className: "csci 355" }, (err) => {
		if (err) {
			console.log(err);
		} else {
			console.log("Class Deleted");
		}

		res.sendFile(__dirname + "/public/HTML/homePageInstructor.html");
	});
});

app.get("/roster.html", redirectLogin, (req, res) => {
	res.sendFile(__dirname + "/public/HTML/roster.html");
});

app.get("/coursePageInstructor.html", redirectLogin, (req, res) => {
	res.sendFile(__dirname + "/public/HTML/coursePageInstructor.html");
});

app.get("/searchResults.html", redirectLogin, (req, res) => {
	res.sendFile(__dirname + "/public/HTML/searchResults.html");
});

app.get("/homePageStudent", redirectLogin, (req, res) => {
	res.sendFile(__dirname + "/public/HTML/homePageStudent.html");
});
