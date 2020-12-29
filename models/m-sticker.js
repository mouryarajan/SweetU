const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stickerSchema = new Schema({
    sticker: {
       type: String,
       required: true
    },
    coin: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('tblsticker', stickerSchema);