const { login, logout, registerStudent } = require("../controllers/user");
const authorize = require("../middlewares/authorization");

const router = require("express").Router();

router.post("/studentRegister", registerStudent);
router.post("/login", login);
router.get("/logout",  logout);

module.exports = router;
