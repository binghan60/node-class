const db = require(__dirname + '/../modules/mysql-connect');

(async () => {

    const [results, fields] = await db.query("SELECT * FROM `news` LIMIT 5");

    console.log(results);
    看看fileds是什麼
    // console.log(fields);
    process.exit();  // 結束行程
})();