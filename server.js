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

app.get("/articles", function(req, res) {
    db.Article.find({})
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
});

app.get("/articles/:id", function(req, res) {
    db.Article.findOne({ _id: req.params.id })
      .populate("note")
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });
  
  app.post("/articles/:id", function(req, res) {
    db.Note.create(req.body)
      .then(function(dbNote) {
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
      })
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });

app.listen(PORT, function() {
    console.log("App running on port " + PORT)
})
