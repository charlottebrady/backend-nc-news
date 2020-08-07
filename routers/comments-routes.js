const express = require("express");
const {
  sendUpdatedComment,
  removeComment,
} = require("../controllers/comments-controllers");
const { handle405Errors } = require("../error handling/error-handlers");

const commentsRouter = express.Router();

commentsRouter
  .route("/:comment_id")
  .patch(sendUpdatedComment)
  .delete(removeComment)
  .all(handle405Errors);

module.exports = commentsRouter;
