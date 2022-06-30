const express = require('express');
// index require過express了,這邊再一次不會浪費記憶體,會丟原來的參照


const router = express.Router(); // 建立 router 物件

router.get('/r1/:action?/:id?', (req, res) => {
    res.json({

        baseUrl: req.baseUrl,// /admins
        url: req.url, // /r1/abc/123
        originalUrl: req.originalUrl, // /admins/r1/abc/123
        params: req.params,
        code: 'admins.js',
    });
});
router.get('/r2/:action?/:id?', (req, res) => {
    res.json({
        url: req.url,
        params: req.params,
        code: 'admins.js',
    });
});


module.exports = router;

