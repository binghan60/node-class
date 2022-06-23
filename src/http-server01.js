const http = require("http");

const server = http.createServer((req, res) => {
    // 設定檔頭HTML才能讀,沒設定預設純文字
    res.writeHead(200, {
        "Content-Type": "text/html",
    });
    // 回應這些東西
    res.end(`<h2>Hello</h2>
    <p>${req.url}</p>`);
});

server.listen(3000);
