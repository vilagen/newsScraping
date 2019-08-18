var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var cheerio = require("cheerio")

var PORT = 3000;

var db = require("./models");

var app = express();

// Using morgan to log requests
app.use(looger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines"

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

app.get("/scape", function(req, res) {
    axios.get("https://www.nytimes.com/").then(function(response) {
        var $ = cheerio.load(response.data);

        // Grabbing articles 
        $("article h2").each(function(i, element) {

            // starting with empty results
            var result = {}

            result.title = $(this)
            .children("a")
            .text()
            result.link = $(this)
            .children("a")
            .attr("href")

            db.Article.create(result)
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