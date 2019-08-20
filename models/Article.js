var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    },

    link: {
        type: String,
        required: true
    },

    // store a Note Id, linking the ObjectId to the Note model
    // will populate Article with an assocaited Note
    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }
    
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article

