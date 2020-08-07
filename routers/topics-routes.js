const express = require("express");
const { sendTopics } = require("../controllers/topics-controllers");
const { handle405Errors } = require("../error handling/error-handlers");

const topicsRouter = express.Router();

topicsRouter.route("/").get(sendTopics).all(handle405Errors);

module.exports = topicsRouter;
