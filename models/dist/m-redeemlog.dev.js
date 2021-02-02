"use strict";

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var redeemLogSchema = new Schema({
  amount: {
    type: Number,
    required: true
  },
  coin: {
    type: Number,
    required: true
  },
  match: {
    type: Number,
    required: true
  },
  status: {
    type: Boolean,
    "default": false,
    required: true
  },
  remark: {
    type: String,
    required: true,
    "default": "Redeem Diamonds"
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'tblusers'
  },
  name: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: Number,
    required: true
  },
  mode: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});
module.exports = mongoose.model('tblredeemlog', redeemLogSchema);