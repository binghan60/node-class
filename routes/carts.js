const express = require('express');
const db = require(__dirname + '/../modules/mysql-connect');
const {
    toDateString,
    toDatetimeString,
} = require(__dirname + '/../modules/date-tools');
const moment = require('moment-timezone');
const Joi = require('joi');
const upload = require(__dirname + '/../modules/upload-images')

const router = express.Router(); // 建立 router 物件



router.use((req, res, next)=>{

    next();
});
// CRUD

router.post('/', async (req, res)=>{
    // product_id, quantity
});

router.get('/', async (req, res)=>{

});

router.put('/', async (req, res)=>{
    // product_id, quantity
});
router.delete('/', async (req, res)=>{
    // product_id
});

module.exports = router;