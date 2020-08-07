const knex = require("../db/connection");

exports.updateComment = (comment_id, inc_votes = 0) => {
  return knex
    .select("*")
    .from("comments")
    .where("comment_id", "=", comment_id)
    .increment("votes", inc_votes)
    .returning("*")
    .then((commentArr) => {
      if (commentArr.length > 0) {
        return commentArr[0];
      } else {
        return Promise.reject({
          status: 404,
          msg: "Whoops... comment_id not found!",
        });
      }
    });
};

exports.deleteComment = (comment_id) => {
  return knex("comments")
    .where("comment_id", "=", comment_id)
    .del()
    .then((deleteCount) => {
      if (deleteCount === 0) {
        return Promise.reject({
          status: 404,
          msg: "Whoops... comment not found!",
        });
      }
    });
};
