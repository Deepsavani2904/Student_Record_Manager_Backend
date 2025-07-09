const { studentPersonalRecord } = require("../controllers/individualRecord");
const authorize = require("../middlewares/authorization");

const router = require("express").Router();

router.get(
  "/studentSingleRecord",
  authorize(["Student"]),
  studentPersonalRecord
);

module.exports = router;
