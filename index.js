require("dotenv").config();
require("./config/dbConnect.js");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const router = require("./routes/index.js");
const app = express();
const port = process.env.PORT || 6000;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "https://student-manger-versel-frontend-4yjx.vercel.app",
    credentials: true,
    withCredentials: true,
  })
);

app.use("/api", router);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
