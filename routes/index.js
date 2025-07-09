const router = require("express").Router();
const auth = require("./user.js");
const student = require("./studentRecords.js");
const individualRecord = require("./individualRecord.js");

router.use("/auth", auth);
router.use("/studentRecords", student);
router.use("/individualRecord", individualRecord);

module.exports = router;
