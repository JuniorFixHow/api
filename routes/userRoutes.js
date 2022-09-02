const { getAllUsers, updateUser, deleteUser, getUser, getUserAssignments } = require("../controllers/userController");
const { verifyUser, verifyAdmin } = require("../utils/verifyToken");
const express= require("express");
const router = express.Router();

router.get('/getallusers', verifyAdmin, getAllUsers);
router.patch('/updateuser/:id', verifyUser, updateUser);
router.delete("/deleteuser/:id", verifyAdmin, deleteUser);
router.get("/user/:id", verifyAdmin, getUser);

router.get('/assignment/:id', getUserAssignments);

module.exports = router;