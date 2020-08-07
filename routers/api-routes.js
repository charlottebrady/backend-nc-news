const express = require("express");
const topicsRouter = require("./topics-routes");
const usersRouter = require("./users-routes");
const articlesRouter = require("./articles-routes");
const commentsRouter = require("./comments-routes");
const {
  handle405Errors,
  handleInvalidURLs,
} = require("../error handling/error-handlers");

const apiRouter = express.Router();

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter
  .route("/")
  .get((req, res, next) => {
    res.status(200).send({
      endpoints: {
        "GET: /api/topics": "responds with all registered topics",
        "GET: /api/articles":
          "responds with al registered article objects, accepts sort_by, order, author and topic queries",
        "GET: /api/articles/:article_id":
          "responds with the specified article corresponding to the given id",
        "PATCH: /api/articles/:article_id":
          "allows the user to vote on the specified article, user must provide an object in the form {inc_votes: user_vote} where user_vote is an integer, responds with the updated article",
        "POST: /api/articles/:article_id/comments":
          "allows a registered user to post a comment on the specified article, the user must provide an object in the form {username: user, body: your_comment}, responds with the posted comment",
        "GET: /api/articles/:article_id/comments":
          "responds with all comments related to the specified article_id",
        "GET: /api/users/:username":
          "responds with the specified user if registered",
        "PATCH: /api/comments/:comment_id":
          "allows the user to vote on a specified comment, user must provide an object in the form {inc_votes: user_votes} where user_votes is an integer, responds with the updated comment",
        "DELETE: /api/comments/:comment_id":
          "allows the user to delete the specified comment",
      },
    });
  })
  .all(handle405Errors);

module.exports = apiRouter;
