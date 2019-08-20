var express = require("express");
var mongoose = require("mongoose");
var cheerio = require("cheerio")
var mongojs = require("mongojs");
var axios = require("axios");
var exphbs = require("express-handlebars")
var routes = require("./routes/routes")

var logger = require("morgan");

var PORT = 3000;

var db = require("./models");

var app = express();

// Using morgan to log requests
app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

app.use(routes)

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines"

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

app.listen(PORT, function() {
    console.log("App running on port " + PORT)
})
