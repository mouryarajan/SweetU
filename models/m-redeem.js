const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const redeemSchema = new Schema({
    amount: {
       type: Number,
       required: true
    },
    coin: {
        type: Number,
       required: true
    },
    match: {
        type: Number,
       required: true
    },
    remark: {
        type: String,
       required: false
    }
});

module.exports = mongoose.model('tblredeem', redeemSchema);