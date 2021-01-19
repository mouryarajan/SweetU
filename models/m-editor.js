const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const editorSchema = new Schema({
    privacyAndPolicy: {
       type: String,
       required: true
    },
    communityGuideLine: {
        type: String,
        required: false
    },
    termsOfUse: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('tbleditor', editorSchema);