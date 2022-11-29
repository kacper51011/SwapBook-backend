import express from "express";
import { verifyIsLoggedIn } from "../controllers/authController";
import { deleteBook, uploadBookPhoto } from "../controllers/booksController";
const {
  getBooks,
  createBook,
  getOneBook,
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
router.route("/create").post(uploadBookPhoto, createBook);
router.route(`/deleteBook/:bookId`).delete(deleteBook);

module.exports = router;
