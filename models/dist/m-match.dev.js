"use strict";

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var matchSchema = new Schema({
  sender: {
    type: String,
    required: true
  },
  senderName: {
    type: String,
    required: true
  },
  receiver: {
    type: String,
    required: true
  },
  receiverName: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    "default": true,
    required: true
  },
  coin: {
    type: Number,
    required: false
  }
}, {
  timestamps: true
});
module.exports = mongoose.model('tblmatch', matchSchema);