import express from "express"
const {getBooks, createBook} = require("../controllers/booksController")
 


const router = express.Router()


router.get("/", getBooks)

router.post("/", createBook)


module.exports = router