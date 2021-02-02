"use strict";

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var contactSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'tblusers'
  },
  user: {
    items: [{
      message: {
        type: String,
        required: false
      },
      isAdmin: {
        type: Boolean,
        "default": false,
        required: true
      },
      isProblem: {
        type: Boolean,
        required: false
      }
    }]
  }
}, {
  timestamps: true
});
module.exports = mongoose.model('tblcontacts', contactSchema);