import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
const cookieParser = require("cookie-parser");

dotenv.config();
const port = process.env.PORT || 4000;
const app = express();

app.use(express.json());
app.use(cookieParser());

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
