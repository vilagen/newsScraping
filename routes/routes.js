var express = require("express")
var router = express.Router()
var db = require("../models");

router.get("/", function(req, res) {
    db.Article.find({})
    .then(function(dbArticle) {
      var hbsArticleObject = {
        articles: dbArticle
      };
      console.log(hbsArticleObject)
      res.render("index", hbsArticleObject)
  });
});

router.get("/scrape", function(req, res) {
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

router.get("/articles", function(req, res) {
    db.Article.find({})
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
});

router.get("/articles/:id", function(req, res) {
    db.Article.findOne({ _id: req.params.id })
      .populate("note")
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });
  
router.post("/articles/:id", function(req, res) {
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

module.exports = router