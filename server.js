const express = require("express");
const apiRouter = require("./routers/api-routes");
const {
  customErrorHandler,
  psqlErrorHandler,
  handle500Errors,
  handleInvalidURLs,
} = require("./error handling/error-handlers");

const app = express();

app.use(express.json());

app.use("/api", apiRouter);

app.all("*", handleInvalidURLs);
app.use(customErrorHandler);
app.use(psqlErrorHandler);
app.use(handle500Errors);

module.exports = app;
