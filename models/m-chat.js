const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId, 
        ref: 'tblusers'
    },
    receiver: {
        type: Schema.Types.ObjectId, 
        ref: 'tblusers'
    }
},{timestamps:true});

module.exports = mongoose.model('tblchat', chatSchema);