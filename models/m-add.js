const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const addSchema = new Schema({
    video:{
        type: String,
        required: false
    },
    title:{
        type:String,
        required: false
    },
    description:{
        type: String,
        required: false
    }
},{timestamps:true});

module.exports = mongoose.model('tbladd', addSchema);