exports.customErrorHandler = (err, req, res, next) => {
  if ("status" in err) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.psqlErrorHandler = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Oh dear... Invalid article id!" });
  } else if (err.code === "23503") {
    res.status(404).send({
      msg:
        "Woah, you're new here! To post comments you need to be a registered user...",
    });
  } else if (err.code === "42703") {
    res.status(404).send({ msg: "Oh no... sort_by query not found!" });
  } else {
    console.log(err);
  }
};
