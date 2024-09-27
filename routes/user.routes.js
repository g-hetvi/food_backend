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
router.post("/user/update-profile",userController.updateProfile)

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

// Account Type

const accountTypeControllers=require("../controller/item.controller")
router.get("/admin/dashboard",authenticateToken,accountTypeControllers.homeDeshboard)
router.get("/admin/sidebar",authenticateToken,accountTypeControllers.sideBar)

  router.post("/food/add",upload,authenticateToken,accountTypeControllers.addAccountType)
  router.post("/food/update",upload,authenticateToken,accountTypeControllers.accountTypeUpdate)
  router.post("/food/delete",authenticateToken,accountTypeControllers.accountTypeDelete)
  router.get("/food/list",authenticateToken,accountTypeControllers.accountTypes)
  router.get("/food/edit",authenticateToken,accountTypeControllers.accountEdit)
  router.get("/food/add",authenticateToken,accountTypeControllers.uiAdd)
  router.get("/food/active",authenticateToken,accountTypeControllers.Active)
  router.get("/food/deactive",authenticateToken,accountTypeControllers.Deactive)



module.exports = router;

