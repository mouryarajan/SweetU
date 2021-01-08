const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const settingSchema = new Schema({
    bonus_coin: {
       type: Number,
       required: true
    },
    call_duration: {
        type: Number,
        required: true,
    },
    call_rate: {
        type: Number,
        required: false
    }
});

module.exports = mongoose.model('tblsetting', settingSchema);