"use strict";

var contact = require('../models/m-contact');

function isEmptyObject(obj) {
  return !Object.keys(obj).length;
}

exports.postChat = function _callee(req, res, next) {
  var id, msg, type, data, _arr, mess, Contact;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          id = req.body.inputUserId;
          msg = req.body.inputMessage;
          type = req.body.inputIsProblem;

          if (id) {
            _context.next = 5;
            break;
          }

          return _context.abrupt("return", res.status(201).json({
            message: "Provide proper input"
          }));

        case 5:
          _context.next = 7;
          return regeneratorRuntime.awrap(contact.findOne({
            userId: id
          }));

        case 7:
          data = _context.sent;

          if (data) {
            _arr = data.user.items;

            _arr.push({
              message: msg,
              isAdmin: false,
              isProblem: type
            });

            data.user.items = _arr;
            data.save().then(function (result) {
              res.status(200).json({
                status: true
              });
            })["catch"](function (err) {
              console.log(err);
            });
          } else {
            mess = {
              items: [{
                message: msg,
                isAdmin: false,
                isProblem: type
              }]
            };
            Contact = new contact({
              userId: id,
              user: mess
            });
            Contact.save().then(function (result) {
              res.status(200).json({
                status: true
              });
            })["catch"](function (err) {
              console.log(err);
            });
          }

        case 9:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.getChat = function _callee2(req, res, next) {
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          contact.find().populate('userId', ["user_name", "user_image"]).sort({
            updatedAt: 'desc'
          }).then(function (data) {
            //console.log(data);
            var arr = [];
            var arrr = [];
            var z = false;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
              for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var n = _step.value;
                var drr = n.user.items;
                var drrr = []; //console.log(drr[drr.length-1]);
                //console.log(drrr);

                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                  for (var _iterator2 = drr[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var x = _step2.value;

                    //console.log(n.userId.user_name);
                    if (x.isProblem) {
                      var _iteratorNormalCompletion3 = true;
                      var _didIteratorError3 = false;
                      var _iteratorError3 = undefined;

                      try {
                        for (var _iterator3 = drr[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                          var _z = _step3.value;

                          if (!_z.isAdmin) {
                            drrr.push({
                              message: _z.message
                            });
                          }
                        }
                      } catch (err) {
                        _didIteratorError3 = true;
                        _iteratorError3 = err;
                      } finally {
                        try {
                          if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
                            _iterator3["return"]();
                          }
                        } finally {
                          if (_didIteratorError3) {
                            throw _iteratorError3;
                          }
                        }
                      }

                      if (isEmptyObject(arr)) {
                        arr.push({
                          id: n._id,
                          name: n.userId.user_name,
                          image: n.userId.user_image,
                          message: drrr[drrr.length - 1].message
                        });
                      } else {
                        var _iteratorNormalCompletion4 = true;
                        var _didIteratorError4 = false;
                        var _iteratorError4 = undefined;

                        try {
                          for (var _iterator4 = arr[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                            var y = _step4.value;

                            if (y.name == n.userId.user_name) {
                              z = true;
                            }
                          }
                        } catch (err) {
                          _didIteratorError4 = true;
                          _iteratorError4 = err;
                        } finally {
                          try {
                            if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
                              _iterator4["return"]();
                            }
                          } finally {
                            if (_didIteratorError4) {
                              throw _iteratorError4;
                            }
                          }
                        }

                        if (z) {
                          z = false;
                          continue;
                        } else {
                          arr.push({
                            id: n._id,
                            name: n.userId.user_name,
                            image: n.userId.user_image,
                            message: drrr[drrr.length - 1].message
                          });
                        }
                      }
                    } else {
                      if (isEmptyObject(arrr)) {
                        arrr.push({
                          id: n._id,
                          name: n.userId.user_name,
                          image: n.userId.user_image
                        });
                      } else {
                        var _iteratorNormalCompletion5 = true;
                        var _didIteratorError5 = false;
                        var _iteratorError5 = undefined;

                        try {
                          for (var _iterator5 = arrr[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                            var _y = _step5.value;

                            if (_y.name == n.userId.user_name) {
                              z = true;
                            }
                          }
                        } catch (err) {
                          _didIteratorError5 = true;
                          _iteratorError5 = err;
                        } finally {
                          try {
                            if (!_iteratorNormalCompletion5 && _iterator5["return"] != null) {
                              _iterator5["return"]();
                            }
                          } finally {
                            if (_didIteratorError5) {
                              throw _iteratorError5;
                            }
                          }
                        }

                        if (z) {
                          z = false;
                          continue;
                        } else {
                          arrr.push({
                            id: n._id,
                            name: n.userId.user_name,
                            image: n.userId.user_image
                          });
                        }
                      }
                    }
                  }
                } catch (err) {
                  _didIteratorError2 = true;
                  _iteratorError2 = err;
                } finally {
                  try {
                    if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
                      _iterator2["return"]();
                    }
                  } finally {
                    if (_didIteratorError2) {
                      throw _iteratorError2;
                    }
                  }
                }
              }
            } catch (err) {
              _didIteratorError = true;
              _iteratorError = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion && _iterator["return"] != null) {
                  _iterator["return"]();
                }
              } finally {
                if (_didIteratorError) {
                  throw _iteratorError;
                }
              }
            }

            res.render('contact', {
              pageTitle: "Contact Us",
              suggestion: arrr,
              problem: arr
            });
          })["catch"](function (err) {
            console.log(err);
          });

        case 1:
        case "end":
          return _context2.stop();
      }
    }
  });
};

exports.getApiChat = function _callee3(req, res, next) {
  var id, data, arr;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          id = req.body.inputUserId;

          if (id) {
            _context3.next = 3;
            break;
          }

          return _context3.abrupt("return", res.status(201).json({
            message: "Provide proper input"
          }));

        case 3:
          _context3.next = 5;
          return regeneratorRuntime.awrap(contact.findOne({
            userId: id
          }));

        case 5:
          data = _context3.sent;
          arr = [];

          if (data) {
            arr = data.user.items;
          } else {
            arr = [];
          }

          res.status(200).json({
            data: arr
          });

        case 9:
        case "end":
          return _context3.stop();
      }
    }
  });
};

exports.getChatDetails = function _callee4(req, res, next) {
  var id;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          id = req.params.inputUserId;
          contact.findOne({
            _id: id
          }).populate('userId', ["user_image", "user_name"]).then(function (data) {
            arr = data.user.items;
            res.render('chat', {
              pageTitle: "Chat",
              data: arr,
              image: data.userId.user_image,
              name: data.userId.user_name,
              id: id
            });
          })["catch"](function (err) {
            console.log(err);
          });

        case 2:
        case "end":
          return _context4.stop();
      }
    }
  });
};

exports.postAdminChat = function _callee5(req, res, next) {
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          cid = req.body.inputChatId;
          msg = req.body.inputMessage;
          type = req.body.inputType;
          contact.findOne({
            _id: cid
          }).then(function (data) {
            arr = data.user.items;
            arr.push({
              message: msg,
              isAdmin: true,
              isProblem: type
            });
            data.user.items = arr;
            data.save().then(function (result) {
              res.redirect('/get-chat-details/' + cid.toString());
            })["catch"](function (err) {
              console.log(err);
            });
          })["catch"](function (err) {
            console.log(err);
          });

        case 4:
        case "end":
          return _context5.stop();
      }
    }
  });
};