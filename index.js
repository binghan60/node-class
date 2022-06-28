require("dotenv").config();

// 拿到一個function
const express = require("express");
// multer檔案上傳,dest目的地
const multer = require('multer');
// const upload = multer({ dest: 'tmp-uploads' });改用自己寫的
const upload = require(__dirname + '/modules/upload-images');

const session = require('express-session');
const moment = require('moment-timezone');


// 也可以這樣寫
// const app = require("express")();
// app=呼叫function
const app = express();
// 區分大小寫

app.set("view engine", "ejs");
app.set('case sensitive routing', true);

// 頂級路由設在最上層,所有資料都會經過這裡
// Top-level middlewares
app.use(session({
    saveUninitialized: false,
    resave: false,
    secret: 'dkfdl85493igdfigj9457394573irherer',
    // cookie存活時間
    cookie: {
        maxAge: 1800000, // 30 min
    }
}));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use((req, res, next) => {
    res.locals.shinder = '哈囉';
    next();
});

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
// 欄位名稱 avatar middleware
app.post('/try-upload', upload.single('avatar'), (req, res) => {
    res.json(req.file);
});
// 欄位名稱 photos middleware
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


app.get('/try-json', (req, res) => {
    // require會自動jsonParse轉成array    
    const data = require(__dirname + '/data/data01');
    console.log(data);
    // rows掛到locals
    res.locals.rows = data;
    res.render('try-json');
});

app.get('/try-moment', (req, res)=>{
    const fm = 'YYYY-MM-DD HH:mm:ss';
    const m1 = moment();
    const m2 = moment('2022-02-28');

    res.json({
        m1: m1.format(fm),
        m1a: m1.tz('Europe/London').format(fm),
        m2: m2.format(fm),
        m2a: m2.tz('Europe/London').format(fm),
    })
});



const adminsRouter = require(__dirname + '/routes/admins');
// prefix 前綴路徑
app.use('/admins', adminsRouter);
app.use(adminsRouter);
// app.use('/admins', require(__dirname + '/routes/admins'));


app.get('/try-session', (req, res) => {
    req.session.my_var = req.session.my_var || 0;
    req.session.my_var++;
    res.json({
        my_var: req.session.my_var,
        session: req.session,
    });
})

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