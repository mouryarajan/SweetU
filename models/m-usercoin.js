const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userCoinSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'tblusers'
    },
    coin: {
        type: Number,
        required: false
    },
    status: {
        type: Boolean,
        required: false
    },
    remark: {
        type: String,
        required: false
    },
    sendTo: {
        type: Schema.Types.ObjectId,
        ref: 'tblusers'
    }
},{ timestamps: true });

module.exports = mongoose.model('tblusercoin', userCoinSchema);