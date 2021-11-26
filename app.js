const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;
const routes = require("./routes/api");

const PORT = process.env.PORT || 3000;
const app = express();

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/<reactreadinglist>", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
	console.log("Mongoose is connected");
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Express modules / packages

app.use(bodyParser.urlencoded({ extended: true }));
// Express modules / packages

app.use(express.static("public"));
// load the files that are in the public directory

app.get("/", (request, response) => {
	response.sendFile("/home/runner/chalkboard/index.html");
});

app.listen(PORT, () => {
	console.log(`App listening on port ${PORT}`);
});
