var express = require("express");
var mongoose = require("mongoose");
var cheerio = require("cheerio")
var mongojs = require("mongojs");
var axios = require("axios");

var logger = require("morgan");

var PORT = 3000;

var db = require("./models");

var app = express();

// Using morgan to log requests
app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines"

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

app.get("/scrape", function(req, res) {
    axios.get("https://www.nytimes.com/").then(function(response) {
        var $ = cheerio.load(response.data);

        // Grabbing articles 
        $("article").each(function(i, element) {

            // starting with empty results
            var results = {}

            results.title = $(this).find("h2").text()
            results.link = $(this).find("a").attr("href")


            db.Article.create(results)
            .then(function(dbArticle) {
                //checking for results
                console.log(dbArticle)
            })
            .catch(function(err){
                if (err) throw "Error creating articles. " + err;
            })
        });
        res.send("Articles Retrieved")
    });
});

app.listen(PORT, function() {
    console.log("App running on port " + PORT)
})