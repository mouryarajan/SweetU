"use strict";

var match = require('../models/m-match');

var user = require('../models/m-user');

var se = require('../models/m-setting');

exports.postMatch = function _callee(req, res, next) {
  var d, sender, receiver, Match;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          d = req.body;
          _context.next = 3;
          return regeneratorRuntime.awrap(user.findOne({
            google_id: d.inputSender
          }));

        case 3:
          sender = _context.sent;
          _context.next = 6;
          return regeneratorRuntime.awrap(user.findOne({
            google_id: d.inputReceiver
          }));

        case 6:
          receiver = _context.sent;
          Match = new match({
            sender: sender._id,
            senderName: sender.user_name,
            receiver: receiver._id,
            receiverName: receiver._user_name
          });
          Match.save().then(function (data) {
            res.status(200).json({
              status: true,
              id: data._id
            });
          })["catch"](function (err) {
            console.log(err);
          });

        case 9:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.postActive = function (req, res, next) {
  var d = req.body;
  match.findOne({
    _id: d.inputMatchId
  }).then(function (data) {
    data.isActive = d.inputStatus;
    data.coin = d.inputCoin;
    data.save().then(function (result) {
      res.status(200).json({
        status: true
      });
    })["catch"](function (err) {
      console.log(err);
    });
  })["catch"](function (err) {
    console.log(err);
  });
};

exports.checkCoinVideoCall = function _callee2(req, res, next) {
  var callData, callRate, id;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(se.findOne({
            _id: "5fbcc934e311361f6063a84d"
          }));

        case 2:
          callData = _context2.sent;
          callRate = callData.call_rate;
          id = req.body.inputUserId;
          user.findOne({
            _id: id
          }).then(function (data) {
            if (callRate <= data.user_coin) {
              data.user_coin = data.user_coin - callRate;
              data.save();
              res.status(200).json({
                status: true
              });
            } else {
              res.status(201).json({
                status: false
              });
            }
          })["catch"](function (err) {
            console.log(err);
          });

        case 6:
        case "end":
          return _context2.stop();
      }
    }
  });
};

exports.chatUserDetails = function (req, res, next) {
  var gid = req.body.inputGoogleId;
  user.findOne({
    google_id: gid
  }).select('user_name').select('user_image').select('is_Active').then(function (data) {
    res.status(200).json({
      data: data
    });
  })["catch"](function (err) {
    console.log(err);
  });
};