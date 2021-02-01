"use strict";

var Purchase = require('../models/m-purchase');

exports.getPurchase = function (req, res, next) {
  Purchase.find().then(function (result) {
    res.render('purchase', {
      pageTitle: "SweetU | Purchase",
      data: result
    });
  })["catch"](function (err) {
    console.log(err);
  });
};

exports.postPurchase = function (req, res, next) {
  var coin = req.body.inputCoin;
  var amount = req.body.inputAmount;
  var comment = req.body.inputComment;
  var google_play = req.body.inputGooglePlay;
  var purchase = Purchase({
    coin: coin,
    amount: amount,
    comment: comment,
    google_play: google_play
  });
  purchase.save().then(function (result) {
    res.redirect('/purchase');
  })["catch"](function (err) {
    console.log(err);
  });
};

exports.getPurchaseDelete = function (req, res, next) {
  var pid = req.params.inputUserId;
  Purchase.findByIdAndDelete(pid).then(function (result) {
    if (result) {
      res.status(200).json({
        message: 'Sucess!'
      });
    }
  })["catch"](function (err) {
    console.log(err);
  });
};

exports.getAPIsPurchase = function (req, res, next) {
  Purchase.find().then(function (result) {
    if (result) {
      res.json({
        status: true,
        data: result
      });
    } else {
      res.json({
        status: false
      });
    }
  });
};