require("dotenv").config();

// 拿到一個function
const express = require("express");
const multer = require('multer');
// multer檔案上傳,dest目的地
// const upload = multer({ dest: 'tmp-uploads' });因為要用storage跟filefilter所以改用自己寫的
const upload = require(__dirname + '/modules/upload-images');

const session = require('express-session');
const moment = require('moment-timezone');
const axios = require('axios');
const bcrypt = require('bcryptjs');



const {
    toDateString,
    toDatetimeString,
} = require(__dirname + '/modules/date-tools');

// sessionStore
const db = require(__dirname + '/modules/mysql-connect');
const MysqlStore = require('express-mysql-session')(session);
// 官方文件const sessionStore = new MysqlStore(option);option是連線設定檔
// 第一個參數連線設定,第二個參數連線物件
const sessionStore = new MysqlStore({}, db);
const cors = require('cors')

// 也可以這樣寫
// const app = require("express")();
// app=呼叫function
const app = express();

// 建立view引擎
app.set("view engine", "ejs");
// 區分大小寫
app.set('case sensitive routing', true);

// 頂級路由設在最上層,所有資料都會經過這裡
// Top-level middlewares
const corsOptions = {
    credentials: true,
    origin: (origin, cb) => {
        console.log({ origin });
        //全部允許
        cb(null, true);
    }
};

app.use(cors(corsOptions));
app.use(session({
    saveUninitialized: false,
    // 沒變更要不要回存
    resave: false,
    // 加密cookie用字串
    secret: 'milkcat',
    store: sessionStore,
    // cookie存活時間
    cookie: {
        maxAge: 1800000, // 30 min
    }
}));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use((req, res, next) => {
    res.locals.shinder = '哈囉';

    // template helper functions
    res.locals.toDateString = toDateString;
    res.locals.toDatetimeString = toDatetimeString;
    res.locals.session = req.session;
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
        const { email, password, name } = req.body;
        res.render('try-post-form', { email, password, name });
    });
// 欄位名稱 avatar middleware,其他欄位的資料會放在req.body裡一起傳過來
app.post('/try-upload', upload.single('avatar'), (req, res) => {
    res.json(req.file);
});
// 欄位名稱 photos middleware
app.post('/try-uploads', upload.array('photos'), (req, res) => {
    res.json(req.files);
});

// 有:action跟:id就一定要有值,直接去/try-params1會404,有加問號才可以可有可無
app.get('/try-params1/:action/:id', (req, res) => {
    res.json({ code: 2, params: req.params });
})
app.get('/try-params1/:action', (req, res) => {
    res.json({ code: 3, params: req.params });
})
app.get('/try-params1/:action?/:id?', (req, res) => {
    res.json({ code: 1, params: req.params });
});

//  跳脫設定路由,/後有包含HI就可以
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
    // rows掛到locals下前端就有這個變數了
    res.locals.rows = data;
    res.render('try-json');
});


app.get('/try-moment', (req, res) => {
    const fm = 'YYYY-MM-DD HH:mm:ss';
    const m1 = moment();
    const m2 = moment('2022-02-28');

    res.json({
        m1: m1.format(fm),
        // tz切換時區
        m1a: m1.tz('Europe/London').format(fm),
        m2: m2.format(fm),
        m2a: m2.tz('Europe/London').format(fm),
    })
});



const adminsRouter = require(__dirname + '/routes/admins');
// prefix 前綴路徑admins
app.use('/admins', adminsRouter);
app.use(adminsRouter);
// app.use('/admins', require(__dirname + '/routes/admins'));


app.get('/try-session', (req, res) => {
    // 如果有my_var就顯示,不然就給0
    req.session.my_var = req.session.my_var || 0;
    req.session.my_var++;
    res.json({
        my_var: req.session.my_var,
        session: req.session,
    });
})

app.use('/address-book', require(__dirname + '/routes/address-book'));

app.use('/carts', require(__dirname + '/routes/carts'));

app.get('/yahoo', async (req, res) => {
    axios.get('https://tw.yahoo.com/')
        .then(function (response) {
            // handle success
            console.log(response);
            res.send(response.data);
        })
});

//登入
app.route('/login')
    .get(async (req, res) => {
        res.render('login');
    })
    .post(async (req, res) => {
        const output = {
            success: false,
            error: '',
            code: 0,
        };
        const sql = "SELECT * FROM admins WHERE account=?";
        const [r1] = await db.query(sql, [req.body.account]);

        if (!r1.length) {
            // 帳號錯誤
            output.code = 401;
            output.error = '帳密錯誤'
            return res.json(output)
        }
        //const row = r1[0];

        output.success = await bcrypt.compare(req.body.password, r1[0].pass_hash);
        if (!output.success) {
            // 密碼錯誤
            output.code = 402;
            output.error = '帳密錯誤'
        } else {
            req.session.admin = {
                sid: r1[0].sid,
                account: r1[0].account,
            };
        }

        res.json(output);
    });

// 登出
app.get("/logout", (req, res) => {
    delete req.session.admin;
    res.redirect("/");
});


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
app.use("/joi", express.static("node_modules/joi/dist"));
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