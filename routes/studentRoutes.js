const { createStudent, updateStudent, deleteStudent, getStudent, getAllStudents } = require("../controllers/studentController");
const {  verifyUser } = require("../utils/verifyToken");

const router = require("express").Router();

router.post("/create/:courseid", verifyUser, createStudent);
router.put("/update/:id", verifyUser, updateStudent);
router.delete("/delete/:id/:courseid", verifyUser, deleteStudent);
router.get("/one/:id", verifyUser, getStudent);
router.get("/all", verifyUser, getAllStudents);

module.exports = router;