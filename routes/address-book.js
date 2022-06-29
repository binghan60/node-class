const express = require('express');
const db = require(__dirname + '/../modules/mysql-connect');

const router = express.Router(); // 建立 router 物件

router.get('/', async (req, res)=>{
    let output = {
        perPage: 10,
        page: 1,
        totalRows: 0,
        totalPages: 0,
        rows: []
    };
    let page = +req.query.page || 1;
    // 頁碼小於1就轉向1並結束
    if(page<1){
        return res.redirect('?page=1');
    }


// 算總筆數
    const sql01 = "SELECT COUNT(1) totalRows FROM address_book";
    const [[{totalRows}]] = await db.query(sql01);
    let totalPages = 0;
    if(totalRows) {
        totalPages = Math.ceil(totalRows/output.perPage);
        // 頁碼大於總頁碼轉向最大頁
        if(page>totalPages){
            return res.redirect(`?page=${totalPages}`);
        }
// 取得每一頁的資料
        const sql02 = `SELECT * FROM address_book LIMIT ${(page-1)*output.perPage}, ${output.perPage}`;
        const [r2] = await db.query(sql02);
        output.rows = r2;
    }
// 展開設定每次都複製新資料進去output
    output = {...output, page, totalRows, totalPages};

    // render views底下的檔案
    res.render('address-book/main', output);
});

module.exports = router;
