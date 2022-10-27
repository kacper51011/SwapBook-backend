import express from "express"
const {getBooks, createBook, getOneBook} = require("../controllers/booksController")
 


const router = express.Router()

router.route("/").get(getBooks).post(createBook)
router.get("/category/:category/search/:searchQuery", getBooks)
router.get("/category/:category", getBooks)
router.get("/search/:searchQuery", getBooks)
router.get("/", getBooks)

router.route("/:id").get(getOneBook)




module.exports = router