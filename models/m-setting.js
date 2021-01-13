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
        required: true
    },
    gender_change_both: {
        type: Number,
        required: true
    },
    gender_change_female: {
        type: Number,
        required: true
    },
    gender_change_male: {
        type: Number,
        required: true
    },
    start_call_rate: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('tblsetting', settingSchema);