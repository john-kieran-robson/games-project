const express = require("express");
const { getCategories, getReviews } = require("./controllers/controllers");

const app = express();
app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);

module.exports = { app };
