"use strict";

var express = require('express');

var router = express.Router();

var admin = require("firebase-admin");

var user = require('../models/m-user');

var noti = require('../models/m-notification');

var fileHelper = require('../util/file');

var cron = require('node-cron');

var serviceAccount = require("../sweetu-6cb6e-firebase-adminsdk-26jna-c0cf9f09ac.json"); //Firebase Credential


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://sweetu-6cb6e.firebaseio.com"
}); //email config

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sweetu.karon@gmail.com',
    pass: 'karon@rajantushar'
  }
}); //For sending notification

var notification_options = {
  priority: "high",
  timeToLive: 60 * 60 * 24
};
router.get('/get-notification', function (req, res, next) {
  noti.find().sort({
    createdAt: 'desc'
  }).then(function (data) {
    res.render('notification', {
      data: data,
      pageTitle: "Notifications"
    });
  })["catch"](function (err) {
    console.log(err);
  });
});
router.post('/send-notification-one', function _callee(req, res, next) {
  var uid;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          uid = req.body.userid;
          user.findOne({
            _id: uid
          }).then(function (data) {
            var title = req.body.inputTitle;
            var body = req.body.inputBody;
            var type = req.body.type;

            if (type == "email") {
              if (req.file.filename) {
                var mailOptions = {
                  from: 'sweetu.karon@gmail.com',
                  to: data.user_emailId,
                  subject: title,
                  text: body,
                  attachments: [{
                    filename: req.file.filename,
                    path: "http://f598cf7e894e.ngrok.io/images/" + req.file.filename,
                    cid: 'logo-sizeid'
                  }]
                };
              } else {
                var mailOptions = {
                  from: 'sweetu.karon@gmail.com',
                  to: data.user_emailId,
                  subject: title,
                  text: body
                };
              }

              transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });
            } else {
              var message;

              if (req.file.filename) {
                message = {
                  notification: {
                    title: title,
                    body: body,
                    image: "http://f598cf7e894e.ngrok.io/images/" + req.file.filename
                  }
                };
              } else {
                message = {
                  notification: {
                    title: title,
                    body: body
                  }
                };
              }

              var options = notification_options;
              var registrationToken = data.notificationTocken;
              admin.messaging().sendToDevice(registrationToken, message, options);
            }

            res.redirect('/user-detail/' + uid);
          })["catch"](function (err) {
            console.log(err);
          });

        case 2:
        case "end":
          return _context.stop();
      }
    }
  });
});
router.post('/send-notification', function _callee2(req, res, next) {
  var title, body, sen, type, d, data, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, n, mailOptions, _data, message, options, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _n, registrationToken;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          title = req.body.inputTitle;
          body = req.body.inputBody;
          sen = req.body.sendto;
          type = req.body.type;

          if (req.file.filename) {
            d = new noti({
              title: title,
              body: body,
              image: req.file.filename,
              sendto: sen,
              type: type
            });
          } else {
            d = new noti({
              title: title,
              body: body,
              sendto: sen,
              type: type
            });
          }

          if (!(type == "email")) {
            _context2.next = 39;
            break;
          }

          if (!(sen == "all")) {
            _context2.next = 10;
            break;
          }

          _context2.next = 9;
          return regeneratorRuntime.awrap(user.find());

        case 9:
          data = _context2.sent;

        case 10:
          if (!(sen == "authorised")) {
            _context2.next = 14;
            break;
          }

          _context2.next = 13;
          return regeneratorRuntime.awrap(user.find({
            user_isAuthorised: true
          }));

        case 13:
          data = _context2.sent;

        case 14:
          if (!(sen == "subscribe")) {
            _context2.next = 18;
            break;
          }

          _context2.next = 17;
          return regeneratorRuntime.awrap(user.find({
            id_subscribe: true
          }));

        case 17:
          data = _context2.sent;

        case 18:
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context2.prev = 21;

          for (_iterator = data[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            n = _step.value;

            if (req.file.filename) {
              mailOptions = {
                from: 'sweetu.karon@gmail.com',
                to: n.user_emailId,
                subject: title,
                text: body,
                attachments: [{
                  filename: req.file.filename,
                  path: "http://f598cf7e894e.ngrok.io/images/" + req.file.filename,
                  cid: 'logo-sizeid'
                }]
              };
            } else {
              mailOptions = {
                from: 'sweetu.karon@gmail.com',
                to: n.user_emailId,
                subject: title,
                text: body
              };
            }

            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                console.log(error);
              } else {
                console.log('Email sent: ' + info.response);
              }
            });
          }

          _context2.next = 29;
          break;

        case 25:
          _context2.prev = 25;
          _context2.t0 = _context2["catch"](21);
          _didIteratorError = true;
          _iteratorError = _context2.t0;

        case 29:
          _context2.prev = 29;
          _context2.prev = 30;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 32:
          _context2.prev = 32;

          if (!_didIteratorError) {
            _context2.next = 35;
            break;
          }

          throw _iteratorError;

        case 35:
          return _context2.finish(32);

        case 36:
          return _context2.finish(29);

        case 37:
          _context2.next = 71;
          break;

        case 39:
          _context2.next = 41;
          return regeneratorRuntime.awrap(user.find({
            isLogedIn: true
          }));

        case 41:
          _data = _context2.sent;

          if (req.file.filename) {
            message = {
              notification: {
                title: title,
                body: body,
                image: "http://f598cf7e894e.ngrok.io/images/" + req.file.filename
              }
            };
          } else {
            message = {
              notification: {
                title: title,
                body: body
              }
            };
          }

          options = notification_options;
          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          _context2.prev = 47;
          _iterator2 = _data[Symbol.iterator]();

        case 49:
          if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
            _context2.next = 57;
            break;
          }

          _n = _step2.value;
          registrationToken = _n.notificationTocken;
          _context2.next = 54;
          return regeneratorRuntime.awrap(admin.messaging().sendToDevice(registrationToken, message, options));

        case 54:
          _iteratorNormalCompletion2 = true;
          _context2.next = 49;
          break;

        case 57:
          _context2.next = 63;
          break;

        case 59:
          _context2.prev = 59;
          _context2.t1 = _context2["catch"](47);
          _didIteratorError2 = true;
          _iteratorError2 = _context2.t1;

        case 63:
          _context2.prev = 63;
          _context2.prev = 64;

          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }

        case 66:
          _context2.prev = 66;

          if (!_didIteratorError2) {
            _context2.next = 69;
            break;
          }

          throw _iteratorError2;

        case 69:
          return _context2.finish(66);

        case 70:
          return _context2.finish(63);

        case 71:
          d.save().then(function (data) {
            res.redirect('/get-notification');
          })["catch"](function (err) {
            console.log(err);
          });

        case 72:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[21, 25, 29, 37], [30,, 32, 36], [47, 59, 63, 71], [64,, 66, 70]]);
}); //FireBase Schedular
// cron.schedule("0 1 * * * *", function(){
//     var db=admin.database();
//     var userRef=db.ref("users");
//     userRef.once('value',function(snap){
//     res.status(200).json({"users":snap.val()});
// });

var db = admin.firestore();

var isValueExistInArray = function isValueExistInArray(arr, name) {
  var length = arr.length;
  var id = length + 1;
  var found = arr.some(function (el) {
    return el.x === name;
  });
  if (!found) arr.push({
    id: id,
    username: name
  });
  return arr;
};

cron.schedule("30 * * * * *", function _callee3(req, res, next) {
  var userRef, snapshot, userData, arr, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, x;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          userRef = db.collection('users');
          _context3.next = 3;
          return regeneratorRuntime.awrap(userRef.where('state', '==', 1).get());

        case 3:
          snapshot = _context3.sent;
          _context3.next = 6;
          return regeneratorRuntime.awrap(user.find({
            is_Active: true
          }).select('is_Active').select('google_id'));

        case 6:
          userData = _context3.sent;
          arr = [];
          snapshot.forEach(function (doc) {
            var x = doc.id;
            arr.push(x);
          });

          if (!(userData.length > arr.length)) {
            _context3.next = 40;
            break;
          }

          _iteratorNormalCompletion3 = true;
          _didIteratorError3 = false;
          _iteratorError3 = undefined;
          _context3.prev = 13;
          _iterator3 = userData[Symbol.iterator]();

        case 15:
          if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
            _context3.next = 26;
            break;
          }

          x = _step3.value;

          if (!arr.includes(x.google_id)) {
            _context3.next = 21;
            break;
          }

          return _context3.abrupt("continue", 23);

        case 21:
          x.is_Active = false;
          x.save();

        case 23:
          _iteratorNormalCompletion3 = true;
          _context3.next = 15;
          break;

        case 26:
          _context3.next = 32;
          break;

        case 28:
          _context3.prev = 28;
          _context3.t0 = _context3["catch"](13);
          _didIteratorError3 = true;
          _iteratorError3 = _context3.t0;

        case 32:
          _context3.prev = 32;
          _context3.prev = 33;

          if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
            _iterator3["return"]();
          }

        case 35:
          _context3.prev = 35;

          if (!_didIteratorError3) {
            _context3.next = 38;
            break;
          }

          throw _iteratorError3;

        case 38:
          return _context3.finish(35);

        case 39:
          return _context3.finish(32);

        case 40:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[13, 28, 32, 40], [33,, 35, 39]]);
});
module.exports = router;