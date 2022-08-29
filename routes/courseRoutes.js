const {createCourse, updateCourse, deleteCourse, getCourse, getAllCourses} = require("../controllers/courseController");
const { verifyAdmin } = require("../utils/verifyToken");
const router = require("express").Router();

router.post("/create", verifyAdmin, createCourse);

//update
router.put("/update/:id", verifyAdmin, updateCourse);

//delete
router.delete("/delete/:id", verifyAdmin, deleteCourse);
 
//get
router.get("/one/:id", getCourse);

//getall
router.get("/all", getAllCourses);

module.exports = router;