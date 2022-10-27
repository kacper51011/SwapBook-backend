import express from "express"
import { signUp } from "../controllers/authController"
import { getUsers } from "../controllers/userControllers"

const router = express.Router()

router.route("/signup").post(signUp)

router.route("/").get(getUsers)