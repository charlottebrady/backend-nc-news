const express = require("express");
const { sendUser } = require("../controllers/users-controllers");

const usersRouter = express.Router();

usersRouter.route("/:username").get(sendUser);

module.exports = usersRouter;
