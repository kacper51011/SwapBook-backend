import express from "express"
const {getBooks, createBook, getOneBook} = require("../controllers/booksController")
 


const router = express.Router()

router.route("/").get(getBooks).post(createBook)

router.route("/:id").get(getOneBook)




module.exports = router