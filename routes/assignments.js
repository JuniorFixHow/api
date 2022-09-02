const { createAssignment, updateAssignment, deleteAssignment, getAssignment, getAllAssignments, getAssignmentSolutions } = require("../controllers/assignmentController");
const { verifyUser, verifyAdmin } = require("../utils/verifyToken");

const router = require("express").Router();

router.post("/create/:userid", verifyUser, createAssignment);
router.put("/update/:id", verifyUser, updateAssignment);
router.delete("/delete/:id/:userid", verifyAdmin, deleteAssignment);
router.get("/one/:id", verifyUser, getAssignment);
router.get("/all", verifyAdmin, getAllAssignments);

router.get('/solution/:id', getAssignmentSolutions);


module.exports = router;
