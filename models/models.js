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
