const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: false
    },
    amount: {
        type: Number,
        required: true
    },
    duration: {
        type: Number,
        required: false
    },
    description: {
        type: String,
        required: false
    }
},{ timestamps: true }
);

module.exports = mongoose.model('tblusers', userSchema);