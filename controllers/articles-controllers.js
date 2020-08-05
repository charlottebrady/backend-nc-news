const {
  getArticles,
  getArticle,
  updateArticle,
  postComment,
  getComments,
} = require("../models/articles-models");

exports.sendArticles = (req, res, next) => {
  const { sort_by, order, author, topic } = req.query;
  getArticles(sort_by, order, author, topic)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.sendArticle = (req, res, next) => {
  const { article_id } = req.params;
  getArticle(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.sendUpdatedArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateArticle(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.sendNewComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  postComment(article_id, username, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.sendComments = (req, res, next) => {
  const { article_id } = req.params;
  const { sort_by, order } = req.query;
  getComments(article_id, sort_by, order)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};
