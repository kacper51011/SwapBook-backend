import express from "express";
import { verifyIsLoggedIn } from "../controllers/authController";
const {
  getBooks,
  createBook,
  getOneBook,
  uploadImage,
} = require("../controllers/booksController");

const router = express.Router();

router.route("/").get(getBooks).post(verifyIsLoggedIn, createBook);
router.get("/category/:category/search/:searchQuery", getBooks);
router.get("/category/:category", getBooks);
router.get("/search/:searchQuery", getBooks);
router.get("/", getBooks);
router.post("/upload/", uploadImage);

router.route("/:id").get(getOneBook);

module.exports = router;
