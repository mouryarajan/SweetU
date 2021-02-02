const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const coinSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'tblusers'
    },
    name: {
        type: String,
        required: false
    },
    amount: {
        type: Number,
        required: false
    },
    coin: {
        type: Number,
        required: false
    }
},{ timestamps: true });

module.exports = mongoose.model('tblcoinlog', coinSchema);