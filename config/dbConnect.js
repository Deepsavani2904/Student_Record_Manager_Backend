const mongoose = require("mongoose");
const { MONGO_URL } = process.env;
mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("Database Connected!");
  })
  .catch((err) => {
    console.log(err);
  });
