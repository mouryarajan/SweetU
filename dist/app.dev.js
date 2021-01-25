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
}).single('image')); //interval
// setInterval();
//saving session on serverside

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
app.use(contactRoutes); //404 Page

app.use(function (req, res, next) {
  res.status(404).render('404', {
    pageTitle: 'Page Not Found'
  });
}); //Connection String

mongoose.connect(process.env.DB_CONNECT, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(function (result) {
  app.listen(process.env.PORT || 3000);
})["catch"](function (err) {
  console.log(err);
});