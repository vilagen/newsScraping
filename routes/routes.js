var express = require("express")
var router = express.Router()
var axios = require("axios");
var cheerio = require("cheerio")
var mongojs = require("mongojs");
var db = require("../models")


var databaseUrl = "mongoHeadlines";
var collections = ["Articles"];

var mongoDB = mongojs(databaseUrl, collections);
mongoDB.on("error", function(error) {
  console.log("Database Error:", error);
});

router.get("/", function(req, res) {
    mongoDB.articles.find(function(err, dbArticle){
        var hbsArticleObject = {
        articles: dbArticle
      };
      console.log(hbsArticleObject)
      res.render("index", hbsArticleObject)
    }) 
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
  mongoDB.articles.find(function(err, dbArticle){
    if (err) throw "Can't retrieve info from db. " + err
    res.json(dbArticle)
  })
})

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


// router.get("/scrape", function(req, res) {
//   axios.get("https://www.nytimes.com/").then(function(response) {
//       var $ = cheerio.load(response.data);

//       // Grabbing articles 
//       $("article").each(function(i, element) {

//           // starting with empty results

//           title = $(this).find("h2").text()
//           link = $(this).find("a").attr("href")

//           if (title && link) {
//             db.Article.save({
//               title: title,
//               link: link
//             },
//           function(err, dbArticle) {
//               if (err) throw "Error Creating articles. " + err;
//               //checking for results
//               console.log(dbArticle)
//         })
//       }
//     })
//   });
// res.send("Articles Retrieved")
// });
