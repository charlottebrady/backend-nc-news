const express = require("express");
const {
  sendArticle,
  sendUpdatedArticle,
  sendNewComment,
  sendComments,
  sendArticles,
} = require("../controllers/articles-controllers");

const articlesRouter = express.Router();

articlesRouter.route("/").get(sendArticles);

articlesRouter.route("/:article_id").get(sendArticle).patch(sendUpdatedArticle);

articlesRouter
  .route("/:article_id/comments")
  .post(sendNewComment)
  .get(sendComments);

module.exports = articlesRouter;
