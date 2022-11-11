import express from "express";
import {
  getToken,
  signIn,
  signUp,
  verifyIsLoggedIn,
} from "../controllers/authController";
import {
  getUserById,
  getUsers,
  updateUser,
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
router.route("/profile/:id").get(getUserById);
// created to change the data in personal profile page
router.route("/profile/settings").put(updateUser);

module.exports = router;
