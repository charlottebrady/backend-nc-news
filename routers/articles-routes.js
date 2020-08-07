const express = require("express");
const {
  sendArticle,
  sendUpdatedArticle,
  sendNewComment,
  sendComments,
  sendArticles,
} = require("../controllers/articles-controllers");
const { handle405Errors } = require("../error handling/error-handlers");

const articlesRouter = express.Router();

articlesRouter.route("/").get(sendArticles).all(handle405Errors);

articlesRouter
  .route("/:article_id")
  .get(sendArticle)
  .patch(sendUpdatedArticle)
  .all(handle405Errors);

articlesRouter
  .route("/:article_id/comments")
  .post(sendNewComment)
  .get(sendComments)
  .all(handle405Errors);

module.exports = articlesRouter;
