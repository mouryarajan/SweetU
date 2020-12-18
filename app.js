const path = require("path");
const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(session);
const dotenv = require('dotenv');


dotenv.config();

// const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');


const store = new MongoDbStore({
    uri: process.env.DB_CONNECT,
    collection: 'sessions',
});

// const csrfProtection = csrf();
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, Math.floor(100000 + Math.random() * 900000) + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

app.set('view engine', 'ejs');
app.set('views', 'views');

const admins = require('./models/m-admin');

const adminRoutes = require('./routes/r-admin');
const userRoutes = require('./routes/r-userlist');
const loginRoutes = require('./routes/r-login');
const settingRoutes = require('./routes/r-setting');
const purchaseRoutes = require('./routes/r-purchase');
const countryRoutes = require('./routes/r-country');
const addRoutes = require('./routes/r-add');
const blockRoutes = require('./routes/r-block');

app.use(express.static(path.join(__dirname, 'assets')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: false }));
app.use(bodyParser.json());
app.use(
    multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);

// app.use((req,res,next)=>{
//     res.setHeader('Authorization');
//     next();
// });

//saving session on serverside
app.use(session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
}));

// app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
    if (!req.session.admin) {
        return next();
    }
    admins.findById(req.session.admin._id)
        .then(ad => {
            req.admin = ad;
            next()
        })
        .catch(err => {
            console.log(err);
        });
});

// app.use((req,res,next)=>{
//     res.locals.csrfToken = req.csrfToken();
//     console.log(req.csrfToken());
//     next();
// })

app.use(loginRoutes);
app.use(adminRoutes);
app.use(userRoutes);
app.use(settingRoutes);
app.use(purchaseRoutes);
app.use(countryRoutes);
app.use(addRoutes);
app.use(blockRoutes);

app.use((req, res, next) => {
    res.status(404).render('404', { pageTitle: 'Page Not Found' });
});

mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => {
        const server = app.listen(process.env.PORT || 3000);
        const io = require('socket.io')(server);
        io.on('connection', socket => {
            console.log('Client connected');
        });
    })
    .catch(err => {
        console.log(err);
    });