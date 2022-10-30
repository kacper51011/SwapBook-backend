import express from "express";
import { signIn, signUp } from "../controllers/authController";
import { getUsers } from "../controllers/userControllers";

const router = express.Router();

router.route("/signup").post(signUp);
router.route("/login").post(signIn);

router.route("/").get(getUsers);
router.route("/:nickname").get(getUsers);

module.exports = router;
