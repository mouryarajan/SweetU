"use strict";

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var userCoinSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'tblusers',
    required: false
  },
  coin: {
    type: Number,
    required: false
  },
  status: {
    type: Boolean,
    required: false
  },
  remark: {
    type: String,
    required: false
  },
  sendTo: {
    type: Schema.Types.ObjectId,
    ref: 'tblusers',
    required: false
  }
}, {
  timestamps: true
});
module.exports = mongoose.model('tblusercoins', userCoinSchema);