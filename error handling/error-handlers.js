exports.customErrorHandler = (err, req, res, next) => {
  if ("status" in err) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.badRequestErrorHandler = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Oh dear... Invalid article id!" });
  } else {
    console.log(err);
  }
};
