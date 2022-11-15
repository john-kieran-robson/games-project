const express = require("express");
const { getCategories } = require("./controllers/controllers");

const app = express();
app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api/reviews/:review_id", getReviewByReviewId);

module.exports = { app };
