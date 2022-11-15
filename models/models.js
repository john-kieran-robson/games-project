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

exports.selectReviewByReviewId = (reviewId) => {
  return db
    .query(` SELECT * FROM reviews WHERE review_id = $1;`, [reviewId])
    .then((result) => {
      const review = result.rows[0];
      if (!review) {
        return Promise.reject({
          status: 404,
          msg: `no review found with review_id`,
        });
      }
      return review;
    });
};
