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
  JOIN users ON reviews.owner = users.username
  JOIN comments ON reviews.review_id = comments.review_id
  GROUP BY reviews.review_id
  ORDER BY created_at DESC;`
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
