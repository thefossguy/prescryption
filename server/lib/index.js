const express = require("express");
const bodyparser = require("body-parser");
const app = express();
const port = process.env.PORT || 3000;

const log = require("debug")("pxc:index");

const morgan = require("morgan");

function clientErrorHandler(err, req, res, next) {
  log(err);
  if (req.xhr) {
    res.status(500).send({ error: "Something failed!" });
  } else {
    next(err);
  }
}

app.use(bodyparser.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);

app.use(require("./server").router);
app.get("/", (req, res) => res.send({ message: "prescryption!" }));

app.use(clientErrorHandler);

const db = require("./db");
db.connect().then(() => {
  app.listen(port, () =>
    log(`Example app listening at http://localhost:${port}`)
  );
});
