const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    title: {
       type: String,
       required: false
    },
    body: {
        type: String,
        required: false,
    },
    image: {
        type: String,
        required:false
    },
    type: {
        type: String,
        required: true,
        default: "firebase"
    },
    sendto:{
        type: String,
        require: false
    },
    userId: {
        type: String,
        required: false
    },
    name: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('tblnotification', notificationSchema);