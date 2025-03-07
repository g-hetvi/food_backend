const Router = require("express");
const router = Router();
const {authenticateToken}=require("../middleware/auth")
const multer=require("multer")

const store = multer.diskStorage({
  destination: "public/images",
  filename: (req, File, cb) => {
    cb(null, Date.now() + File.originalname);
  },
});
const upload = multer({
  storage: store,
}).single("icon");


const  userController  = require("../controller/user.controller");
router.post("/user/signup", userController.signup )
router.post("/user/login",userController.login)  

const adminController=require("../controller/admin.controller")

router.post("/admin/signup",upload,adminController.registerUser)//
router.get("/admin/signup",adminController.signupGet)
router.get("/admin/login",adminController.loginGet)
router.post("/admin/login",adminController.loginUser)//
router.get("/user/logout",adminController.logoutUser)
router.post("/admin/forgot-password",adminController.forgotPassword);
router.get("/admin/forgot",adminController.forgot)
router.post("/admin/otpverify",adminController.otpVerify)
router.get("/admin/verify",adminController.Verify)
router.post("/admin/resetpassword",adminController.resetPassword);
router.get("/admin/reset",adminController.reset)

// collection

const Controllers=require("../controller/collections.controller")
router.get("/admin/dashboard",authenticateToken,Controllers.homeDeshboard)
router.get("/admin/sidebar",authenticateToken,Controllers.sideBar)

  router.post("/collection/add",upload,authenticateToken,Controllers.addCollection)
  router.post("/collection/update",upload,authenticateToken,Controllers.collectionUpdate)
  router.post("/collection/delete",authenticateToken,Controllers.collectionDelete)
  router.get("/collection/list",authenticateToken,Controllers.collections)
  router.get("/collection/edit",authenticateToken,Controllers.collectionEdit)
  router.get("/collection/add",authenticateToken,Controllers.uiAdd)
  router.get("/collection/active",authenticateToken,Controllers.Active)
  router.get("/collection/deactive",authenticateToken,Controllers.Deactive)



module.exports = router;

