const {
  selectCategories,
  selectReviews,
  selectReviewByReviewId,
  selectCommentsByReviewId,
  insertCommentsByReviewId,
  updateReviewByReviewId,
  selectUsers,
  removeCommentById,
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
  const { category, sort_by, order } = req.query;

  return selectReviews(category, sort_by, order)
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
      next(err);
    });
};

exports.patchReviewByReviewId = (req, res, next) => {
  const reviewId = req.params.review_id;
  return updateReviewByReviewId(reviewId, req.body)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUsers = (req, res, next) => {
  return selectUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteCommentByCommentId = (req, res, next) => {
  const commentId = req.params.comment_id;
  return removeCommentById(commentId)
    .then(() => {
      res.sendStatus(204);
    })
    .catch((err) => next(err));
};
