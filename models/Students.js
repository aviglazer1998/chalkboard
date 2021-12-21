const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const bcrypt = require('bcrypt');

const studentSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  // passwordHash: String,
  // password: {type: String, select: false},
  password: String,
  type: String,
  classes: [Object],
  // classes: [],
});

// studentSchema.pre("save", (password) =>{
// 	if(password){
// 		passwordHash = bcrypt.hashSync(password, 10);
// 	}
// })

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
