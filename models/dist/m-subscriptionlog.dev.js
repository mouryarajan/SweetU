"use strict";

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var subSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'tblusers'
  },
  name: {
    type: String,
    required: false
  },
  amount: {
    type: Number,
    required: false
  },
  duration: {
    type: Number,
    required: false
  },
  startDate: {
    type: Date,
    required: false
  }
}, {
  timestamps: true
});
module.exports = mongoose.model('tblsubscriptionlog', subSchema);