const db = require("../db/connection.js");

exports.selectCategories = () => {
  return db.query("SELECT * FROM categories").then((result) => {
    if (result.rows.length === 0) {
      throw {
        status: 400,
        msg: `No catagories`,
      };
    }
    return result.rows;
  });
};

exports.selectReviews = () => {
  return db
    .query(
      `SELECT reviews.*, CAST(COUNT(reviews.review_id) AS int) AS comment_count
  FROM reviews
  LEFT JOIN comments ON reviews.review_id = comments.review_id
  GROUP BY reviews.review_id
  ORDER BY created_at DESC;`
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 400, msg: `No reviews` });
      }
      return result.rows;
    });
};

exports.selectReviewByReviewId = (reviewId) => {
  return db
    .query(` SELECT * FROM reviews WHERE review_id = $1;`, [reviewId])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `invalid ID`,
        });
      }
      return result.rows[0];
    });
};

exports.selectCommentsByReviewId = (reviewId) => {
  return this.selectReviewByReviewId(reviewId)
    .then(() => {
      return db.query(
        `SELECT * FROM comments
  WHERE review_id = $1
  ORDER BY created_at DESC;`,
        [reviewId]
      );
    })
    .then((result) => result.rows);
};
