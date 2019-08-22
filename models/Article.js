const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },

    link: {
        type: String,
        required: true,
        unique: true
    },

    // store a Note Id, linking the ObjectId to the Note model
    // will populate Article with an assocaited Note
    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }
});

const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article

