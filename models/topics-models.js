const knex = require("../db/connection");

exports.getTopics = () => {
  return knex.select("*").from("topics").orderBy("slug");
};

exports.getTopicsBySlug = (slug) => {
  return knex
    .select("*")
    .from("topics")
    .where("slug", "=", slug)
    .then((topic) => {
      if (topic.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Whoops... topic not found!",
        });
      }
    });
};
