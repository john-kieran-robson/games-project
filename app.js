const express = require("express");
const { getCategories, getReviews } = require("./controllers/controllers");

const app = express();
app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);

const routeDoesNotExist = (req, res, next) => {
  next({ status: 404, msg: "Route does not exist" });
};

app.get("*", routeDoesNotExist);

app.use((err, req, res, next) => {
  if (err.status && err.msg) res.status(err.status).send({ msg: err.msg });
  else next(err);
});

module.exports = { app };
