const express = require("express");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const router = require("./src/routes/api.js");
require("dotenv").config()

const app = new express();


app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const dbUrl = process.env.DB_URL;

mongoose.connect(dbUrl).then((res) => {
    console.log("---Database connected---")
}).catch((e) => {
    console.log("---Database connect fail");
})

app.use('/api/v1', router);


module.exports = app;