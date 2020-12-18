const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminSchema = new Schema({
    admin_name: {
       type: String,
       required: true
    },
    admin_password: {
        type: String,
        required: true,
    },
    admin_userId: {
        type: String,
        required:true
    },
    admin_token: String,
    admin_tokenExpiration: Date,
});

module.exports = mongoose.model('tbladminlogins', adminSchema);