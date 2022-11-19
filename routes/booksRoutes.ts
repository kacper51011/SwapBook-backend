import express from "express";
import { verifyIsLoggedIn } from "../controllers/authController";
const {
  getBooks,
  createBook,
  getOneBook,
  uploadImage,
} = require("../controllers/booksController");

const router = express.Router();

// public routes
router.route("/").get(getBooks);
router.route("/category/:category/search/:searchQuery").get(getBooks);
router.route("/category/:category").get(getBooks);
router.route("/search/:searchQuery").get(getBooks);
router.route("/getBook/:id").get(getOneBook);
// protected routes (only for logged in users)
router.use(verifyIsLoggedIn);
router.route("/create").post(createBook);

module.exports = router;
