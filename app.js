const express = require("express");
const {
  getCategories,
  getReviews,
  getReviewByReviewId,
  getCommentsByReviewId,
  postCommentsByReviewId,
  patchReviewByReviewId,
  getUsers,
  deleteCommentByCommentId,
} = require("./controllers/controllers");

const app = express();
app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);
app.get("/api/reviews/:review_id", getReviewByReviewId);
app.post("/api/reviews/:review_id/comments", postCommentsByReviewId);
app.patch("/api/reviews/:review_id", patchReviewByReviewId);
app.get("/api/users", getUsers);
app.delete("/api/comments/:comment_id", deleteCommentByCommentId);

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "bad request" });
  } else if (err.code === "23502") {
    res.status(400).send({ msg: "bad request" });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: "Does not exist" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = { app };
