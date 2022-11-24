import express from "express";
import {
  getToken,
  logout,
  signIn,
  signUp,
  verifyIsLoggedIn,
} from "../controllers/authController";
import {
  getUserById,
  getUsers,
  uploadUserPhoto,
  updateUser,
  updatePhoto,
} from "../controllers/userControllers";

const router = express.Router();
// sign up, sign in and getToken routes (auth)
router.route("/signup").post(signUp);
router.route("/login").post(signIn);
router.route("/getToken").get(getToken);

// Protected routes (only for logged in users)
router.use(verifyIsLoggedIn);
router.route("/").get(getUsers);
router.route("/:nickname").get(getUsers);
// created to fill the inputs with default values in personal profile page
router.route("/account/profile").get(getUserById);
// created to change the data in personal profile page
router.route("/account/update").put(updateUser);
router.route("/account/upload").post(uploadUserPhoto, updatePhoto);
router.route("/logout").delete(logout);

module.exports = router;
