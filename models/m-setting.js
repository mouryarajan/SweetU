const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const settingSchema = new Schema({
    bonus_coin: {
       type: Number,
       required: true
    },
    bonus_amount: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model('tblsetting', settingSchema);