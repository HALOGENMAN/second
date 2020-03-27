const exoress = require("express")

const router = exoress.Router();

const authController = require("../controllers/auth");

router.get("/login",authController.getLogin);

router.post("/login",authController.postLogin);

router.post("/logout",authController.postLogout);

router.get("/signup",authController.getSignup);

router.post("/signup",authController.postSignup);


module.exports = router;