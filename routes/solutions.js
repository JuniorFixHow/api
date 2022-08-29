const { createSolution, updateSolution, deleteSolution, getSolution, getAllSolutions } = require("../controllers/solutionController");
const { verifyAdmin, verifyUser } = require("../utils/verifyToken");

const router = require("express").Router();

router.post("/create/:assignmentid", verifyAdmin, createSolution);
router.put("/update/:id", verifyAdmin, updateSolution);
router.delete("/delete/:id/:assignmentid", verifyAdmin, deleteSolution);
router.get("/one/:id", verifyUser, getSolution);
router.get("/all", verifyAdmin, getAllSolutions);

module.exports = router;