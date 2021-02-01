"use strict";

var userCoin = require('../models/m-usercoin');

exports.getCoinLog = function (req, res, next) {
  uid = req.body.inputUserId;
  userCoin.find({
    userId: uid
  }).then(function (data) {
    res.status(200).json({
      data: data
    });
  })["catch"](function (err) {
    console.log(err);
  });
};