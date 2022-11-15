const express = require("express");
const {
  getCategories,
  getReviews,
  getReviewByReviewId,
} = require("./controllers/controllers");

const app = express();
app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id", getReviewByReviewId);

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    console.log(err);
    res.status(500).send({ msg: "Internal Server Error" });
  }
});

module.exports = { app };
