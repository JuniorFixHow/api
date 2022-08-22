const express =  require( "express");
const { login, register, verificationFile, verify, requestPasswordReset, resetPass, gloginFailed, gloginCallBack, gloginAuth, glogout, loginSuccess } = require( "../controllers/authController");

const router = express.Router();

router.post("/createuser", register);
router.post("/login", login);
router.get("/verified", verificationFile);
router.get("/verify/:userId/:uniqueString", verify);

router.post("/requestPasswordReset", requestPasswordReset);
router.post("/resetPassword", resetPass);

//google

router.get("/login/failed", gloginFailed);
router.get("/auth/google/callback", gloginCallBack);
router.get("/auth/google", gloginAuth);
router.get("/googleLogout", glogout);
router.get("/login/success", loginSuccess);

module.exports = router;