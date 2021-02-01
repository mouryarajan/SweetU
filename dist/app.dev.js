"use strict";

var path = require("path");

var express = require("express");

var bodyParser = require('body-parser');

var app = express();

var mongoose = require('mongoose');

var session = require('express-session');

var MongoDbStore = require('connect-mongodb-session')(session);

var dotenv = require('dotenv');

var flash = require('connect-flash');

var multer = require('multer');

var cron = require('node-cron');

var user = require('./models/m-user');

var compression = require('compression');

var setting = require('./models/m-setting');

var userCoin = require('./models/m-usercoin');

dotenv.config();
var store = new MongoDbStore({
  uri: process.env.DB_CONNECT,
  collection: 'sessions'
}); //paytm

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
}); // const csrfProtection = csrf();

var fileStorage = multer.diskStorage({
  destination: function destination(req, file, cb) {
    cb(null, 'images');
  },
  filename: function filename(req, file, cb) {
    cb(null, Math.floor(100000 + Math.random() * 900000) + '-' + file.originalname);
  }
});

var fileFilter = function fileFilter(req, file, cb) {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(compression());

var admins = require('./models/m-admin');

var adminRoutes = require('./routes/r-admin');

var userRoutes = require('./routes/r-userlist');

var loginRoutes = require('./routes/r-login');

var settingRoutes = require('./routes/r-setting');

var purchaseRoutes = require('./routes/r-purchase');

var countryRoutes = require('./routes/r-country');

var addRoutes = require('./routes/r-add');

var blockRoutes = require('./routes/r-block');

var paytmRoutes = require('./routes/r-paytm');

var redeemRoutes = require('./routes/r-redeem');

var stickerRoutes = require('./routes/r-sticker');

var notificationRoutes = require('./routes/r-notification');

var subRoutes = require('./routes/r-subscription');

var matchRoutes = require('./routes/r-match');

var chatRoutes = require('./routes/r-chat');

var contactRoutes = require('./routes/r-contact');

var userCoinRoutes = require('./routes/r-userCoin');

app.use(express["static"](path.join(__dirname, 'assets')));
app.use('/images', express["static"](path.join(__dirname, 'images')));
app.use(bodyParser.urlencoded({
  limit: '100mb',
  extended: false
}));
app.use(bodyParser.json());
app.use(multer({
  storage: fileStorage,
  fileFilter: fileFilter
}).single('image')); //saving session on serverside

app.use(session({
  secret: 'my secret',
  resave: false,
  saveUninitialized: false,
  store: store
})); // app.use(csrfProtection);

app.use(flash());
app.use(function (req, res, next) {
  if (!req.session.admin) {
    return next();
  }

  admins.findById(req.session.admin._id).then(function (ad) {
    req.admin = ad;
    next();
  })["catch"](function (err) {
    console.log(err);
  });
});
cron.schedule("0 1 * * * *", function () {
  user.find().then(function (data) {
    if (data) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var x = _step.value;

          if (x.id_subscribe) {
            var d = new Date();

            if (x.subscription.endDate < d) {
              //console.log("Scheduler call")
              x.id_subscribe = false;
              x.save();
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
    }
  })["catch"](function (err) {
    console.log(err);
  });
});
cron.schedule("0 1 * * * *", function _callee() {
  var set;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(setting.findOne());

        case 2:
          set = _context.sent;
          user.find({
            id_subscribe: true
          }).then(function (use) {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
              for (var _iterator2 = use[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var x = _step2.value;
                x.user_coin = x.user_coin + set.regular_coin;
                x.save();
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
          })["catch"](function (err) {
            console.log(err);
          });

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
});
cron.schedule("59 * * * * *", function _callee2() {
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          userCoin.deleteMany({
            coin: 0
          }).then(function (data) {});

        case 1:
        case "end":
          return _context2.stop();
      }
    }
  });
});
app.use(loginRoutes);
app.use(adminRoutes);
app.use(userRoutes);
app.use(settingRoutes);
app.use(purchaseRoutes);
app.use(countryRoutes);
app.use(addRoutes);
app.use(blockRoutes);
app.use(paytmRoutes);
app.use(redeemRoutes);
app.use(stickerRoutes);
app.use(notificationRoutes);
app.use(subRoutes);
app.use(matchRoutes);
app.use(chatRoutes);
app.use(contactRoutes);
app.use(userCoinRoutes); //404 Page

app.use(function (req, res, next) {
  res.status(404).render('404', {
    pageTitle: 'Page Not Found'
  });
}); //Connection String

mongoose.connect(process.env.DB_CONNECT, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(function (result) {
  var server = app.listen(process.env.PORT || 3000);

  var io = require('socket.io')(server);

  io.on('connection', function (socket) {
    console.log("Client Connected");
  });
})["catch"](function (err) {
  console.log(err);
});