# newsScraping
Learning to Scrape a site while saving and displaying information on MongoDB

## https://github.com/vilagen/newsScraping

There were a few goals for this project. To allow someone to scrap a site: in this case New York Times, and for people to leave comments and to view comments. When the site launches, it will show a list of articles already scraped. You can hit the scrape button to scrape NYT again. Still working on a way to view all the comments instead of just one at this time. When the page is scraped it is being saved to an online Mongo DB. Then when a comment is made, it also being saved to a new collection. The Article and Comment collections have a relationship, so that users are supposed to be able to view comments that were made for each article.
