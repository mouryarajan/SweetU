const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const editorSchema = new Schema({
    privacyAndPolicy: {
       type: String,
       required: true
    }
});

module.exports = mongoose.model('tbleditor', editorSchema);