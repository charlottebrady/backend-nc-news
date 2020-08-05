const knex = require("../db/connection");

exports.getArticles = (
  sort_by = "created_at",
  order = "asc",
  author,
  topic
) => {
  if (order !== "asc" && order !== "desc") {
    return Promise.reject({
      status: 400,
      msg: "Oh no... invalid order query!",
    });
  } else if (author) {
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
      .where("articles.author", "=", author)
      .leftJoin("comments", "articles.article_id", "comments.article_id")
      .groupBy("articles.article_id")
      .orderBy(sort_by, order)
      .then((articles) => {
        const formattedArticles = [];
        articles.forEach((article) => {
          const articleCopy = { ...article };
          articleCopy.comment_count = parseInt(article.comment_count);
          formattedArticles.push(articleCopy);
        });
        if (formattedArticles.length > 0) {
          return formattedArticles;
        } else {
          return knex
            .select("username")
            .from("users")
            .then((users) => {
              const validAuthor = users.filter((user) => {
                return user.username === author;
              });
              if (validAuthor.length > 0) {
                return Promise.reject({
                  status: 442,
                  msg:
                    "Oh dear, the queried author has not created any articles!",
                });
              } else {
                return Promise.reject({
                  status: 404,
                  msg: "Whoops... author not found!",
                });
              }
            });
        }
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
      .then((articles) => {
        const formattedArticles = [];
        articles.forEach((article) => {
          const articleCopy = { ...article };
          articleCopy.comment_count = parseInt(article.comment_count);
          formattedArticles.push(articleCopy);
        });
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
          msg: "Uh oh... Article not found!",
        });
      } else {
        const article = articleArr[0];
        article.comment_count = parseInt(article.comment_count);
        return article;
      }
    });
};

exports.updateArticle = (article_id, inc_votes) => {
  return knex
    .select("articles.*")
    .count("comments.comment_id", { as: "comment_count" })
    .from("articles")
    .where("articles.article_id", article_id)
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .then((articleArr) => {
      const article = articleArr[0];
      if (!inc_votes) {
        article.comment_count = parseInt(article.comment_count);
        return article;
      } else if (typeof inc_votes === "number") {
        const votes = article.votes;
        article.votes = votes + inc_votes;
        article.comment_count = parseInt(article.comment_count);
        return article;
      } else {
        return Promise.reject({
          status: 400,
          msg:
            "Hmmm, please specify an integer value for your requests inc_votes key!",
        });
      }
    });
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

exports.getComments = (article_id, sort_by = "created_at", order = "asc") => {
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
      } else if (comments.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Uh oh... Article not found!",
        });
      } else return comments;
    });
};
