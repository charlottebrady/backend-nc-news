const express = require("express");
const topicsRouter = require("./topics-routes");
const usersRouter = require("./users-routes");
const articlesRouter = require("./articles-routes");

const apiRouter = express.Router();

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);

module.exports = apiRouter;
