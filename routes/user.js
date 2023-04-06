import express from "express";
import {
  getProfile,
  Login,
  Logout,
  SignUp,
  changeProfile,
  changePassword,
  updatePic,
  forgetPassword,
  resetPassword
} from "../controllers/user.js";
import { isAuth } from "../middlewares/auth.js";
import { singleUpload } from "../middlewares/multer.js";
const router = express.Router();

router.post("/login", Login); // no need enter /api/vi again!
router.post("/signup", singleUpload , SignUp);
router.post("/logout", isAuth, Logout);
router.get("/me", isAuth, getProfile);

router.put("/updateprofile", isAuth, changeProfile);
router.put("/changepassword", isAuth, changePassword);
router.put("/updatepic" , isAuth , singleUpload , updatePic)

router.route("/forgetpassword").post(forgetPassword).put(resetPassword)
export default router;
