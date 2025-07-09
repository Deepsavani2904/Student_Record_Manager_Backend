const router = require("express").Router();
const {
  addStudentByAdmin,
  getStudentsByAdmin,
  getOneStudentByAdmin,
  updateStudentByAdmin,
  deleteStudentByAdmin,
} = require("../controllers/studentRecords");
const authorize = require("../middlewares/authorization.js");

router.post("/addStudent", authorize(["Admin"]), addStudentByAdmin);
router.get("/getStudents", authorize(["Admin"]), getStudentsByAdmin);
router.get("/getStudentById/:id", authorize(["Admin"]), getOneStudentByAdmin);
router.put("/updateStudent", authorize(["Admin"]), updateStudentByAdmin);
router.delete("/deleteStudent/:id", authorize(["Admin"]), deleteStudentByAdmin);

module.exports = router;
