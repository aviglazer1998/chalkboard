const express = require("express");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3000;
const app = express();
const uri = process.env.MONGODB_URI;

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
