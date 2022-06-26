require("dotenv").config();
// 載入特定設定檔寫法
// require("dotenv").config({ path: 'custom/path/to/.env' });


const { DB_USER, DB_PASS, NODE_ENV } = process.env;

console.log({ DB_USER, DB_PASS, NODE_ENV });
