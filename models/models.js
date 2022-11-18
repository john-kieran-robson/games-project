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

exports.selectReviews = (category, sort_by = "created_at", order = "DESC") => {
  let categoryString = "";
  let categoryArray = [];
  const orderOption = ["ASC", "DESC"];
  const columnArray = [
    "review_id",
    "title",
    "category",
    "designer",
    "owner",
    "review_body",
    "review_img_url",
    "created_at",
    "votes",
  ];
  if (!orderOption.includes(order) || !columnArray.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: `Does not exist` });
  }
  if (category) {
    categoryString = `WHERE category = $1`;
    categoryArray.push(category);
  }
  return db
    .query(
      `SELECT reviews.*, CAST(COUNT(reviews.review_id) AS int) AS comment_count
  FROM reviews
  LEFT JOIN comments ON reviews.review_id = comments.review_id
  ${categoryString}
  GROUP BY reviews.review_id
  ORDER BY ${sort_by} ${order};`,
      categoryArray
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
    .query(
      ` SELECT reviews.*, CAST(COUNT(comments.review_id)AS int) AS comment_count
    FROM reviews 
    FULL OUTER JOIN comments ON reviews.review_id = comments.review_id 
    WHERE reviews.review_id = $1
    GROUP BY reviews.review_id;`,
      [reviewId]
    )
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

exports.insertCommentsByReviewId = (reviewId, comment) => {
  const currentTime = new Date();
  return this.selectReviewByReviewId(reviewId)
    .then(() => {
      return db.query(
        `INSERT INTO comments
  (body, votes, author, review_id, created_at)
  VALUES
  ($1,0,$2,$3,$4)
  RETURNING *;`,
        [comment.body, comment.username, reviewId, currentTime]
      );
    })
    .then((response) => {
      return response.rows[0];
    });
};

exports.updateReviewByReviewId = (reviewId, requestBody) => {
  return this.selectReviewByReviewId(reviewId)
    .then(() => {
      return db.query(
        `UPDATE reviews
  SET votes = votes + $1
  WHERE review_id = $2
  RETURNING *;`,
        [requestBody.inc_votes, reviewId]
      );
    })
    .then((response) => {
      return response.rows[0];
    });
};

exports.selectUsers = () => {
  return db.query("SELECT * FROM users").then((result) => {
    return result.rows;
  });
};

exports.removeCommentById = (commentId) => {
  return db
    .query(
      `DELETE FROM comments
  WHERE comment_id = $1;`,
      [commentId]
    )
    .then((response) => {
      if (response.rowCount === 0) {
        throw {
          status: 404,
          msg: `comment does not exist`,
        };
      }
    });
};
