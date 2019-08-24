const express = require("express");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars")
const routes = require("./routes/routes")
const logger = require("morgan");

const PORT = 3000;

const db = require("./models");

const app = express();

// Using morgan to log requests
app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

app.use(routes)

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


const MONGODB_URI = process.env.MONGODB_URI || "mongodb://user1:password123@ds143683.mlab.com:43683/heroku_q3fbmblj";

mongoose.connect(
    MONGODB_URI,
    {useMongoClient: true});

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

app.listen(PORT, function() {
    console.log("App running on port " + PORT)
})
