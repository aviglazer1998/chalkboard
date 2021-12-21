const express = require('express');
const session = require('express-session');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Student = require('./models/Students');
const Instructor = require('./models/Instructor');
const Admin = require('./models/Admin');
const Class = require('./models/Classes');
const Classes = require('./models/Classes');

var id = 0;
app.set('view engine', 'ejs');

const dbURI =
  'mongodb+srv://aviglazer:Password123@chalkboard.mc7fa.mongodb.net/chalkboard?retryWrites=true&w=majority';
const db = mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => app.listen(process.env.PORT || 8000))
  .catch((err) => console.log(err));

app.use(
  session({
    cookie: { maxAge: 1000 * 60 * 60 * 2, sameSite: true },
    secret: 'Super Secret',
    resave: true,
    saveUninitialized: false,
  })
);

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.listen(() => {
  console.log(`App listening on port 8000`);
});

const redirectLogin = (req, res, next) => {
  if (!req.session.userId) {
    res.redirect('/');
    console.log('redirected');
  } else {
    next();
  }
};

const redirectHome = (req, res, next) => {
  if (req.session.userId) {
    if (req.session.type == 'student') {
      res.redirect('/studentHomePage');
    } else if (req.session.type == 'instructor') {
      res.redirect('/instructorHomePage');
    } else if (req.session.type == 'admin') {
      res.redirect('/adminView');
    }
  } else {
    next();
  }
};

app.get('/', (request, response) => {
  //   response.sendFile(__dirname + '/public/HTML/index.html');
  response.render('index');
});

app.post('/sign-up', (req, res) => {
  if (req.body.box !== 'on') {
    console.log('is instructor');
    const instructor = new Instructor({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      type: 'instructor',
      classes: [],
    });
    instructor.save();
    // res.sendFile(__dirname + '/public/HTML/index.html');
    res.render('index');
  } else {
    console.log('is student');
    const student = new Student({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      type: 'student',
      classes: [],
    });
    student.save();
    // res.sendFile(__dirname + '/public/HTML/index.html');
    res.render('index');
  }
});

app.post('/sign-in', (req, res) => {
  Instructor.findOne(
    { email: req.body.email, password: req.body.password },
    (err, instructor) => {
      if (err) {
        console.log(err);
      } else {
        if (instructor) {
          req.session.userId = instructor.id;
          console.log('id: ' + instructor.id);
          res.redirect(`${instructor.id}/instructorHomePage`);
        } else if (!instructor) {
          Student.findOne(
            { email: req.body.email, password: req.body.password },
            (err, student) => {
              if (err) {
                console.log(err);
              } else {
                if (student) {
                  console.log('id: ' + student.id);
                  req.session.userId = student.id;
                  res.redirect(`${student.id}/studentHomePage`);

                  // console.log("id: " + student.id)
                  // res.redirect(`${student.id}/studentHomePage`)
                } else if (!student) {
                  Admin.findOne(
                    { email: req.body.email, password: req.body.password },
                    (err, admin) => {
                      if (err) {
                        console.log(err);
                      } else {
                        if (admin) {
                          req.session.userId = req.body.email;
                          res.redirect(`${admin.id}/admin-view`);
                        } else {
                          console.log('no user');
                          // alert('No User Found')
                          //   return res.render(
                          //     __dirname + '/public/HTML/index.html'
                          //   );

                          res
                            .status(500)
                            .send(
                              'Incorrect Login! Please go back and try again.'
                            );
                        }
                      }
                    }
                  );
                }
              }
            }
          );
        }
      }
    }
  );
});

app.get('/:id/admin-view', redirectLogin, (req, res) => {
  //how to get instructors here too?
  Student.find({}, function (err, studentData) {
    Instructor.find({}, (err, instructorData) => {
      res.render('admin', {
        practices: studentData,
        instructors: instructorData,
      });
    });
  });
});

app.get('/:studentId/studentHomePage', redirectLogin, (req, res) => {
  const { studentId } = req.params;
  Student.findById(studentId, (err, student) => {
    // const classes = student.classes;
    // console.log(student.classes);
    // Class.find({ classStudents: student }, function (err, classData) {
    //   res.render('studentHomePage', {
    //     // practices: null,
    //     practices: classData,
    //     user: student,
    //   });
    // });

    res.render('studentHomePage', {
      user: student,
      practices: student.classes,
    });
  });
});

//add student to waitlist
app.get('/:studentId/studentHomePage/:classId', redirectLogin, (req, res) => {
  const { studentId } = req.params;
  const { classId } = req.params;
  //   console.log('studentId: ' + studentId);
  console.log('classId: ' + classId);
  Class.findById(classId, (err, course) => {
    Student.findById(studentId, (err, student) => {
      course.classWaitlist.push(student);
      course.save();
      console.log(course.classWaitlist);
      res.render('studentHomePage', {
        // student: student,
        // course: course,
        practices: student.classes,
        user: student,
      });
    });
  });
});

app.get('/:instructorId/instructorHomePage', redirectLogin, (req, res) => {
  const { instructorId } = req.params;
  Instructor.findById(instructorId, (err, instructor) => {
    // console.log(instructor);
    Classes.find({}, (err, classes) => {
      res.render('instructorHomePage', {
        courses: classes,
        // practices: classData,
        user: instructor,
      });
    });
  });
});

app.get('/:id/deleteCourse', redirectLogin, (req, res) => {
  const { classId } = req.body;
  Class.deleteOne({ where: { id: classId } }, (err, course) => {
    Student.find({}, (err, students) => {
      students.forEach(function (student) {
        student.classes.forEach(function (course) {
          if (course._id == classId) {
            const index = student.classes.indexOf(course);
            student.classes.splice(index, 1);
            console.log(student.classes);
            student.save();
          }
        });
      });
    });
    console.log('course deleted');
    res.redirect('instructorHomePage');
  });
});

// app.get("/all-students", redirectLogin, (req, res) => {
app.get('/all-students', redirectLogin, (req, res) => {
  Student.find({}, (err, students) => {
    if (err) {
      console.log(err);
    } else {
      res.send(students);
    }
  });
});

app.get('/:id/class-search', redirectLogin, (req, res) => {
  res.render('searchClasses');
});

app.get('/:id/searchClasses', redirectLogin, (req, res) => {
  res.render('searchClasses');
});

app.post('/:id/search-result?', redirectLogin, (req, res) => {
  const { id } = req.params;
  Class.findOne({ className: req.body.className }, (err, course) => {
    if (course) {
      const array = course.classInstructors;
      const newArray = [];
      array.forEach(function (instructor) {
        Instructor.findById(id, (err, i) => {
          // console.log(i);
          newArray.push(i);
          // console.log(newArray);
        });
      });
      Instructor.find({}, (err, instructors) => {
        res.render('searchResults', {
          course: course,
          id: id,
          instructors: instructors,
        });
      });
    } else {
      res.redirect('searchClasses');
    }
  });
});

app.get('/:id/class-search-student', redirectLogin, (req, res) => {
  res.render('studentSearchClasses');
});

app.get('/:id/studentSearchClasses', redirectLogin, (req, res) => {
  res.render('studentSearchClasses');
});

app.post('/:id/search-result-student?', redirectLogin, (req, res) => {
  const { id } = req.params;
  Class.findOne({ className: req.body.className }, (err, course) => {
    if (course) {
      const array = course.classInstructors;
      const newArray = [];
      array.forEach(function (instructor) {
        Instructor.findById(id, (err, i) => {
          // console.log(i);
          newArray.push(i);
          // console.log(newArray);
        });
      });
      Instructor.find({}, (err, instructors) => {
        res.render('studentSearchResult', {
          course: course,
          id: id,
          instructors: instructors,
        });
      });
    } else {
      res.redirect('studentSearchClasses');
    }
  });
});

app.get('/all-instructors', redirectLogin, (req, res) => {
  Instructor.find({}, (err, instructors) => {
    if (err) {
      console.log(err);
    } else {
      res.send(instructors);
    }
  });
});

app.get('/all-classes', redirectLogin, (req, res) => {
  Class.find({}, (err, classes) => {
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

app.get('/:id/logout/:otherId', redirectLogin, (req, res) => {
  console.log('TIME TO LOGOUT');
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    } else {
      //   res.redirect(__dirname + '/public/HTML/index.html');
      res.redirect('index');
    }
  });
});

app.get('/:id/logout', redirectLogin, (req, res) => {
  console.log('TIME TO LOGOUT');
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    } else {
      //   res.redirect(__dirname + '/public/HTML/index.html');
      res.redirect('index');
    }
  });
});

app.get('/logout', redirectLogin, (req, res) => {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('index');
    }
  });
});

app.get('/:id/index', redirectLogin, (req, res) => {
  res.sendFile('index');
});

//take students off the waitlist and add to classlist
app.post(
  '/:id/instructorCoursePage/:courseId/:studentId/true',
  redirectLogin,
  (req, res) => {
    console.log('true');
    const { id } = req.params;
    const { courseId } = req.params;
    const { studentId } = req.params;

    Class.findById(courseId, (err, course) => {
      Student.findById(studentId, (err, student1) => {
        student1.classes.push(course);
        student1.save();
        course.classWaitlist.forEach(function (student2) {
          if (student1.id == student2._id) {
            const index = course.classWaitlist.indexOf(student2);
            course.classWaitlist.splice(index, 1);
            console.log(course.classWaitlist);
            course.save();
          }
        });
        Instructor.find({}, (err, instructors) => {
          Instructor.findById(id, (err, instructor) => {
            res.render('instructorCoursePage', {
              course: course,
              instructors: instructors,
              user: instructor,
            });
          });
        });
      });
    });
  }
);

//remove student from waitlist
app.post(
  '/:id/instructorCoursePage/:courseId/:studentId/false',
  redirectLogin,
  (req, res) => {
    //   const box = req.body;
    console.log('false');
    const { id } = req.params;
    const { courseId } = req.params;
    const { studentId } = req.params;

    Class.findById(courseId, (err, course) => {
      Student.findById(studentId, (err, student1) => {
        course.classWaitlist.forEach(function (student2) {
          if (student1.id == student2._id) {
            const index = course.classWaitlist.indexOf(student2);
            course.classWaitlist.splice(index, 1);
            console.log(course.classWaitlist);
            course.save();
          }
        });
        Instructor.find({}, (err, instructors) => {
          Instructor.findById(id, (err, instructor) => {
            res.render('instructorCoursePage', {
              course: course,
              instructors: instructors,
              user: instructor,
            });
          });
        });
      });
    });
  }
);
//   }
// );

app.get('/:id/instructorCoursePage/:courseId', redirectLogin, (req, res) => {
  const { id } = req.params;

  const { courseId } = req.params;
  console.log(courseId);

  Class.findById(courseId, (err, course) => {
    Instructor.find({}, (err, instructors) => {
      Instructor.findById(id, (err, instructor) => {
        res.render('instructorCoursePage', {
          course: course,
          instructors: instructors,
          user: instructor,
        });
      });
    });
    // console.log(course);
  });
});

app.get('/:id/studentCoursePage/:courseId', redirectLogin, (req, res) => {
  const { courseId } = req.params;
  console.log(courseId);
  Class.findById(courseId, (err, course) => {
    console.log(course);
    res.render('studentCoursePage', {
      course: course,
    });
  });
  //   res.render('studentCoursePage');
});

app.get('/:id/assignmentPage', redirectLogin, (req, res) => {
  res.render('assignmentPage');
});

app.get('/classResults', redirectLogin, (req, res) => {
  Class.findOne({ className: req.query.className }, (err, className) => {
    if (err) {
      console.log(err);
      console.log('no class');
    } else {
      res.send(className);
      console.log(className);
    }
  });
});

app.get('/:id/createCourse', redirectLogin, (req, res) => {
  const { id } = req.params;
  Instructor.findById(id, (err, instructor) => {
    console.log(instructor);
    res.render('createCourse', {
      instructor: instructor,
    });
  });
  //   console.log('create course');
});

app.post('/:id/createCourse', redirectLogin, (req, res) => {
  console.log('in create course');
  const { id } = req.params;
  console.log(id);
  Instructor.findById(id, (err, instructor) => {
    Class.find({}, (err, allCourses) => {
      const newClass = new Class({
        className: req.body.className,
        // classId: ,
        classStartDate: req.body.classStartDate,
        classEndDate: req.body.classEndDate,
        classStartTime: req.body.classStartTime,
        classEndTime: req.body.classEndTime,
        classDays: req.body.classDays,
        classCapacity: req.body.classCapacity,
        classLocation: req.body.classLocation,
        classDescription: req.body.classDescription,
        classInstructors: instructor,
      });
      newClass.save();
      var classes = [];
      allCourses.forEach(function (course) {
        course.classInstructors.forEach(function (instructor2) {
          if (instructor == instructor2) {
            classes.push(instructor2);
          }
        });
      });
      console.log(classes);
      res.render('instructorHomePage', {
        user: instructor,
        courses: classes,
      });
    });
  });
});

app.get('/:id/roster', redirectLogin, (req, res) => {
  const { id } = req.params;
  Instructor.findById(id, (err, instructor) => {
    Class.find({}, (err, classes) => {
      res.render('roster', {
        user: instructor,
        classes: classes,
      });
    });
  });
});
