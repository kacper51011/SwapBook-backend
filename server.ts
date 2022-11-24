import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

dotenv.config();
const port = process.env.PORT || 4000;
const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.status(200).send("SwapBook");
});

// setting mongoDB connection
const connectDB = require("./config/db");
connectDB();

const apiRoutes = require("./routes/apiRoutes");
app.use("/api", apiRoutes);

app.listen(port, () => {
  console.log("new server started");
});
