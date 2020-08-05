const express = require("express");
const apiRouter = require("./routers/api-routes");
const {
  customErrorHandler,
  psqlErrorHandler,
} = require("./error handling/error-handlers");

const app = express();
app.use(express.json());

app.use("/api", apiRouter);

app.use(customErrorHandler);
app.use(psqlErrorHandler);

module.exports = app;
