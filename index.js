require("dotenv").config();
const express = require("express");

const app = express();

app.use(express.static("public"));
app.use("/bootstrap", express.static("node_modules/bootstrap/dist"));

app.get("/", (req, res) => {
    res.send(`<h2>泥好</h2>`);
});

app.use((req, res) => {
    res.send(`<h2>找不到頁面 404</h2>
    <img src="/imgs/6c0519f6e0e0d42e458daef829c74ae4.jpg" alt="" width="300px" />`);
});

app.listen(process.env.PORT, () => {
    console.log(`server started:${process.env.PORT}`);
    console.log({ NODE_ENV: process.env.NODE_ENV });
});