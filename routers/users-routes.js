const express = require("express");
const { sendUser } = require("../controllers/users-controllers");
const { handle405Errors } = require("../error handling/error-handlers");

const usersRouter = express.Router();

usersRouter.route("/:username").get(sendUser).all(handle405Errors);

module.exports = usersRouter;
