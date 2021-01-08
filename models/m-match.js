const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const matchSchema = new Schema({
    sender: {
        type: String,
        required: true
    },
    senderName: {
        type: String,
        required: true
    },
    receiver: {
        type: String,
        required: true
    },
    receiverName: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: false
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