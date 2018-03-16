var express = require("express");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");
// var logger = require("morgan");
var mongoose = require("mongoose");

// var mongojs = require("mongojs");  // <––– need it??????


var PORT = 3000;

var app = express();

// app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

app.use(express.static("public"));

// By default mongoose uses callbacks for async queries, 
//     we're setting it to use promises (.then syntax) instead
// Connect to the Mongo DB
mongoose.Promise = Promise;
const MONGODB_URI = "mongodb://heroku_5p8tsm83:jr18m3cfui1lb1tb82kmmgch4r@ds119210.mlab.com:19210/heroku_5p8tsm83";
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI);

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var routes = require("./routes/routes.js")(app);

app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});