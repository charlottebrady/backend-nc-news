const express = require("express");
const { sendTopics } = require("../controllers/topics-controllers");

const topicsRouter = express.Router();

topicsRouter.route("/").get(sendTopics);

module.exports = topicsRouter;
