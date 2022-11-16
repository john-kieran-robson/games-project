const {
  selectCategories,
  selectReviews,
  selectReviewByReviewId,
  selectCommentsByReviewId,
  insertCommentsByReviewId,
} = require("../models/models.js");

exports.getCategories = (req, res, next) => {
  return selectCategories()
    .then((categories) => {
      res.status(200).send({ categories });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviews = (req, res, next) => {
  return selectReviews()
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviewByReviewId = (req, res, next) => {
  const { review_id } = req.params;
  return selectReviewByReviewId(review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsByReviewId = (req, res, next) => {
  const { review_id } = req.params;
  return selectCommentsByReviewId(review_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentsByReviewId = (req, res, next) => {
  const commentInfo = req.body;
  const reviewId = req.params.review_id;
  return insertCommentsByReviewId(reviewId, commentInfo)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};
