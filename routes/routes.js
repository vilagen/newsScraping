const express = require("express")
const router = express.Router()
const axios = require("axios");
const cheerio = require("cheerio")
const mongojs = require("mongojs");
const db = require("../models")
const mongoose = require("mongoose");

const databaseUrl = "mongoHeadlines";
const collections = ["Articles"];

const mongoDB = mongojs(databaseUrl, collections);
mongoDB.on("error", function(error) {
  console.log("Database Error:", error);
});

router.get("/", function(req, res) {
  db.Article.find({})
    .populate("comment")
    .then ((dbArticle) => {
      var hbsArticleObject = {
        articles: dbArticle
      };
      console.log(hbsArticleObject)
      res.render("index", hbsArticleObject)
    })
}) 

router.get("/scrape", (req, res) => {
  axios.get("https://www.nytimes.com/").then(function(response) {
      let $ = cheerio.load(response.data);

      // Grabbing articles 
      $("article").each(function(i, element) {

          // starting with empty results
          let results = {}

          results.title = $(this).find("h2").text()
          results.link = $(this).find("a").attr("href")
          results.summary = ($(this).find("li").text() || $(this).find("p").text())
          results.image = $(this).find("img").attr("src")

          db.Article.create(results)
          .then((dbArticle) => {
              //checking for results
              console.log(dbArticle)
          })
          .catch((err) => {
              if (err) throw "Error creating articles. " + err;
          })
      });
      res.send("Articles Retrieved")
  });
});

router.get("/articles", function(req, res) {
  db.Article.find({})
    .populate("comment")
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

router.get("/articles/:id", function(req, res) {
    db.Article.findOne({ _id: req.params.id })
      .populate("comment")
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });
  
router.post("/articles/:id", function(req, res) {
  db.Comment.create(req.body)
    .then(function(dbComment) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { comment: dbComment._id }, { new: true });
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// router.put("/articles/:id", function(req, res) {
//  db.Article.update({ comment: req.params._id }, {comment: req.body.body })
//     .then(function(dbArticle) {
//       res.json(dbArticle);
//     })
//     .catch(function(err) {
//       res.json(err);
//     });
// })

router.delete("/articles/:id", (req, res) => {
  db.Article.findOneAndDelete({ _id: req.params.id })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

module.exports = router
