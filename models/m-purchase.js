const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const purchaseSchema = new Schema({
    coin: {
       type: Number,
       required: true
    },
    amount: {
        type: Number,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    google_play: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('tblpurchase', purchaseSchema);