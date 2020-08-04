const knex = require("../db/connection");

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
