import express from 'express';
import dotenv from 'dotenv';


dotenv.config();
const port = process.env.PORT || 4000
const app = express()
app.get('/', (req, res) => {
    res.status(200).send('SwapBook');
});

const connectDB = require("./config/db")

connectDB()

app.listen(port, ()=> {console.log("new server started")})

