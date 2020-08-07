const knex = require("../db/connection");
const { formatCommentCount } = require("../db/utils/utils");

exports.getArticles = (
  sort_by = "created_at",
  order = "desc",
  author,
  topic
) => {
  if (order !== "asc" && order !== "desc") {
    return Promise.reject({
      status: 400,
      msg: "Oh no... invalid order query!",
    });
  } else {
    return knex
      .select(
        "articles.article_id",
        "articles.title",
        "articles.votes",
        "articles.topic",
        "articles.created_at",
        "articles.author"
      )
      .count("comments.comment_id", { as: "comment_count" })
      .from("articles")
      .leftJoin("comments", "articles.article_id", "comments.article_id")
      .groupBy("articles.article_id")
      .orderBy(sort_by, order)
      .modify((query) => {
        if (author) query.where("articles.author", "=", author);
        else if (topic) query.where("articles.topic", "=", topic);
      })
      .then((articles) => {
        const formattedArticles = formatCommentCount(articles);
        return formattedArticles;
      });
  }
};

exports.getArticle = (article_id) => {
  return knex
    .select("articles.*")
    .count("comments.comment_id", { as: "comment_count" })
    .from("articles")
    .where("articles.article_id", article_id)
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .then((articleArr) => {
      if (articleArr.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Uh oh... article not found!",
        });
      } else {
        const article = articleArr[0];
        article.comment_count = parseInt(article.comment_count);
        return article;
      }
    });
};

exports.updateArticle = (article_id, inc_votes = 0) => {
  if (typeof inc_votes !== "number") {
    return Promise.reject({
      status: 400,
      msg:
        "Hmmm, please specify an integer value for your requests inc_votes key!",
    });
  } else {
    return knex
      .select("*")
      .from("articles")
      .where("article_id", "=", article_id)
      .increment({ votes: inc_votes })
      .returning("*")
      .then((articleArr) => {
        if (articleArr.length === 0) {
          return Promise.reject({
            status: 404,
            msg: "Uh oh... article not found!",
          });
        } else {
          const article = articleArr[0];
          return article;
        }
      });
  }
};

exports.postComment = (article_id, username, body) => {
  return knex
    .insert({ author: username, article_id, body })
    .into("comments")
    .returning("*")
    .then((commentArr) => {
      const comment = commentArr[0];
      return comment;
    });
};

exports.getComments = (article_id, sort_by = "created_at", order = "desc") => {
  return knex
    .select("*")
    .from("comments")
    .where("article_id", "=", article_id)
    .orderBy(sort_by, order)
    .then((comments) => {
      if (order !== "asc" && order !== "desc") {
        return Promise.reject({
          status: 400,
          msg: "Oh no... invalid order query!",
        });
      } else {
        return comments;
      }
    });
};

exports.getCommentsByArticleID = (article_id) => {
  return knex
    .select("*")
    .from("articles")
    .where("article_id", "=", article_id)
    .then((article) => {
      if (article.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Uh oh... article not found!",
        });
      }
    });
};
