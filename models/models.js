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
      `SELECT reviews.*, COUNT(review_id) AS comment_count
  FROM reviews
  JOIN users ON reviews.owner = users.username
  JOIN comments ON review.review_id = comments.review_id
  ORDER BY created_at DESC
  GROUP BY reviews.review_id;`
    )
    .then((result) => {
      if (result.rows.length === 0) {
        throw {
          status: 400,
          msg: `No reviews`,
        };
      }
      return result.rows;
    });
};
