const express = require("express");
const { sendArticle } = require("../controllers/articles-controllers");

const articlesRouter = express.Router();

articlesRouter.route("/:article_id").get(sendArticle);

module.exports = articlesRouter;
