const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminSchema = new Schema({
	firstName: String,
	lastName: String,
	email: String,
	password: String,
	type: String,
});

const Admin = mongoose.model("Admin", adminSchema);

module.exports = {
	fetchData: function (callback) {
		var userData = Admin.find({});
		userData.exec(function (err, data) {
			if (err) throw err;
			return callback(data);
		});
	},
};
