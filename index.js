require("dotenv").config();
const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.send(`<h2>泥好</h2>`);
});

app.listen(process.env.PORT, () => {
    console.log(`server started:${process.env.PORT}`);
});