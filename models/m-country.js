const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const countrySchema = new Schema({
    countryName: {
       type: String,
       required: true
    },
    countryCode:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model('tblcountry', countrySchema);