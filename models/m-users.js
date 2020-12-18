const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usersSchema = new Schema({
    user_name: {
       type: String,
       required: true
    },
    user_emailId: {
        type: String,
        required: true,
    },
    user_id: {
        type: String,
    }
},{timestamps:true});

module.exports = mongoose.model('tblloginusers', usersSchema);