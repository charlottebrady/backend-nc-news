//error-handling middleware
exports.customErrorHandler = (err, req, res, next) => {
  if ("status" in err) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.psqlErrorHandler = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Uh oh... bad request!" });
  } else if (err.code === "23503") {
    if (err.constraint === "comments_article_id_foreign") {
      res.status(404).send({ msg: "Whoops... article_id not found!" });
    } else
      res.status(422).send({
        msg:
          "Woah, you're new here! To post comments you need to be a registered user...",
      });
  } else if (err.code === "42703") {
    res.status(404).send({ msg: "Oh no... sort_by column not found!" });
  } else if (err.code === "23502") {
    res.status(400).send({
      msg: "Error! Please provide a valid username and body for your comment!",
    });
  } else {
    next(err);
  }
};

exports.handle500Errors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "server error!" });
};

//controllers
exports.handle405Errors = (req, res, next) => {
  res.status(405).send({ msg: "Oops... invalid method!" });
};

exports.handleInvalidURLs = (req, res, next) => {
  res.status(404).send({ msg: "Uh oh... path not found!" });
};
