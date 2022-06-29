const moment = require('moment-timezone');

const dateFormat = 'YYYY-MM-DD';
const datetimeFormat = 'YYYY-MM-DD HH:mm:ss';

const toDateString = (t) => moment(t).format(dateFormat);
const toDatetimeString = (t) => moment(t).format(datetimeFormat);
// 建立函式丟出去
module.exports = {
    toDateString,
    toDatetimeString,
};