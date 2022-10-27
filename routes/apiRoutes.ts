import express from "express";

const app = express()

const booksRoutes = require("./booksRoutes")
app.use("/books", booksRoutes)
const userRoutes = require("./userRoutes")
app.use("/users", userRoutes)

module.exports = app