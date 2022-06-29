const multer = require("multer");
// uuid.v4()設定成uuidv4()
const { v4: uuidv4 } = require("uuid");

// 有對到字串就有,沒對到就是undefined
const extMap = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/gif": ".gif",
};

// 如果mimetype是這三種
function fileFilter(req, file, cb) {
    // 第二個參數如果是true代表是要的
    cb(null, !!extMap[file.mimetype]);
}

const storage = multer.diskStorage({
    // 上傳目標資料夾
    destination: function (req, file, cb) {
        cb(null, __dirname + "/../public/imgs");
    },
    // 上傳檔案名稱
    filename: function (req, file, cb) {
        // extMap[file.mimetype]是副檔名
        const filename = uuidv4() + extMap[file.mimetype];
        cb(null, filename);
    },
});

module.exports = multer({fileFilter, storage});