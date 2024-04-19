const mongoose = require("mongoose");
require("dotenv");

exports.dbconnect = () => {
  mongoose
    .connect(process.env.DATABASE_URL)
    .then(conosle.log("Database connections successful"))
    .catch((error) => {
      console.log("Database connection failure");
      console.error(error);
      process.exit(1);
    });
};
