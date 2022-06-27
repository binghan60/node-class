require("dotenv").config();

// 拿到一個function
const express = require("express");
const multer = require('multer');
// const upload = multer({ dest: 'tmp-uploads' });改用自己寫的
const upload = require(__dirname + '/modules/upload-images');

// 也可以這樣寫
// const app = require("express")();
// app=呼叫function
const app = express();
// 區分大小寫
app.set('case sensitive routing', true);

app.set("view engine", "ejs");

// 頂級路由設在最上層,所有資料都會經過這裡
// Top-level middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// .get接受get的方法
app.get('/try-qs', (req, res) => {
    res.json(req.query);
});

// middleware: 中介軟體 是一個(function)
// const bodyParser = express.urlencoded({extended: false});
app.post('/try-post', (req, res) => {
    res.json(req.body);
});

app.route('/try-post-form')
    .get((req, res) => {
        res.render('try-post-form');
    })
    .post((req, res) => {
        const { email, password } = req.body;
        res.render('try-post-form', { email, password });
    });

app.post('/try-upload', upload.single('avatar'), (req, res) => {
    res.json(req.file);
});

app.post('/try-uploads', upload.array('photos'), (req, res) => {
    res.json(req.files);
});

// 越寬鬆的放越下面,不然會一開始就吃掉全部
app.get('/try-params1/:action/:id', (req, res) => {
    res.json({ code: 2, params: req.params });
})
app.get('/try-params1/:action', (req, res) => {
    res.json({ code: 3, params: req.params });
})
app.get('/try-params1/:action?/:id?', (req, res) => {
    res.json({ code: 1, params: req.params });
});

//  /後有包含HI就可以
app.get(/^\/hi\/?/i, (req, res) => {
    res.send({ url: req.url });
});
app.get(['/aaa', '/bbb'], (req, res) => {
    res.send({ url: req.url, code: 'array' });
});

const adminsRouter = require(__dirname + '/routes/admins');
// prefix 前綴路徑
app.use('/admins', adminsRouter);
app.use(adminsRouter);


app.use('/admins', require(__dirname + '/routes/admins'));

// 樣板(ejs)要用render 改成從views找
// 沒設定檔頭預設HTML
app.get("/", (req, res) => {
    res.render("main", { name: "binghan" });
});
// -------------static folder-------------

// 相當於app.use("/", express.static("public"));
app.use(express.static("public"));
// 網址列掛在虛擬bootstrap/再找
app.use("/bootstrap", express.static("node_modules/bootstrap/dist"));
// ------------------404------------------
// use接收所有的方法,querystring亂打都會來這裡
app.use((req, res) => {
    res.send(`<h2>找不到頁面 404</h2>
    <img src="/imgs/6c0519f6e0e0d42e458daef829c74ae4.jpg" alt="" width="500px" />`);
});

// process下的.env設定檔的PORT
app.listen(process.env.PORT, () => {
    console.log(`server started:${process.env.PORT}`);
    console.log({ NODE_ENV: process.env.NODE_ENV });
});