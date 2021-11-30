const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require('mongoose');
const Student = require('./models/Students');


const dbURI = 'mongodb+srv://aviglazer:Password123@chalkboard.mc7fa.mongodb.net/chalkboard?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
.then((result)=> app.listen(8000))
.catch((err)=> console.log(err));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", (request, response) => {
	response.sendFile("/home/runner/chalkboard/index.html");
});


app.get('/sign-up',(req,res)=>{
	const student = new Student({
		name: 'miriam A',
		email: 'miriamA@gmail.com',
		password: 'Password123!',
		classes: [
			{
				className: 'CSCI 355',
				classId: '355',
				classStart: '8:00',
				classEnd: '9:00',
				classDays: 'MWF',
				classInstructor: 'Abromov',
				classDescription: 'This is a class',
			},
		],
	});
	student.save()
	.then((result)=>{
		res.send(result);
	})
	.catch((err)=>{
		console.log(err);
	});
});


