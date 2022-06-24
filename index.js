require("dotenv").config();
const express = require("express");

const app = express();

app.set("view engine", "ejs");

app.get('/try-qs', (req, res)=>{
    res.json(req.query);
});

app.get("/", (req, res) => {
    res.render("main", { name: "binghan" });
});
// -------------static folder-------------
app.use(express.static("public"));
app.use("/bootstrap", express.static("node_modules/bootstrap/dist"));
// ------------------404------------------
app.use((req, res) => {
    res.send(`<h2>找不到頁面 404</h2>
    <img src="/imgs/6c0519f6e0e0d42e458daef829c74ae4.jpg" alt="" width="500px" />`);
});

app.listen(process.env.PORT, () => {
    console.log(`server started:${process.env.PORT}`);
    console.log({ NODE_ENV: process.env.NODE_ENV });
});