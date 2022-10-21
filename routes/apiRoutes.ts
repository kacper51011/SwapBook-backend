import express from "express";

const apiRoutes = require("./booksRoutes")
const app = express()


app.use("/books", apiRoutes)

module.exports = app