const http = require("http");
// 讀寫檔案 內建套件不用加路徑直接用
const fs = require("fs");

const server = http.createServer((req, res) => {
    // writeFileSync會卡在這裡等他寫完
    fs.writeFile(
        // 存在這裡
        __dirname + "./../data/header01.text",
        // 寫入的東西
        JSON.stringify(req.headers),
        (err) => {
            res.writeHead(200, {
                "Content-Type": "text/html; charset=utf8",
            });
            if (err) {
                console.log(err);
                res.end("發生錯誤")
            } else {
                res.end("完成寫檔")
            }
        }
    )
});

server.listen(3000);
