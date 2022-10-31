import express from "express";
import {
  signIn,
  signUp,
  verifyIsLoggedIn,
} from "../controllers/authController";
import { getUsers } from "../controllers/userControllers";

const router = express.Router();

router.route("/signup").post(signUp);
router.route("/login").post(signIn);

router.use(verifyIsLoggedIn);
router.route("/").get(getUsers);
router.route("/:nickname").get(getUsers);

module.exports = router;
