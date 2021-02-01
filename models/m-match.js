const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const matchSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'tblusers',
    },
    senderName: {
        type: String,
        required: true
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: 'tblusers',
    },
    receiverName: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true,
        required: true
    },
    coin: {
        type: Number,
        required: false
    }
},{timestamps:true});

module.exports = mongoose.model('tblmatch', matchSchema);