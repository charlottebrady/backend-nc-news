const { getTopics } = require("../models/topics-models");

exports.sendTopics = (req, res, next) => {
  getTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};
