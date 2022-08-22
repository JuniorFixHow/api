const { getAllUsers, updateUser, deleteUser, getUser } = require("../controllers/userController");
const { verifyUser, verifyAdmin } = require("../utils/verifyToken");
const express= require("express");
const router = express.Router();

router.get('/getallusers', verifyAdmin, getAllUsers);
router.patch('/updateuser/:id', verifyUser, updateUser);
router.delete("/deleteuser/:id", verifyAdmin, deleteUser);
router.get("/user/:id", verifyAdmin, getUser);

module.exports = router;