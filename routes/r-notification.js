const express = require('express');
const router = express.Router();
var admin = require("firebase-admin");
const user = require('../models/m-user');
const noti = require('../models/m-notification');
const fileHelper = require('../util/file');
const cron = require('node-cron');

var serviceAccount = require("../sweetu-6cb6e-firebase-adminsdk-26jna-c0cf9f09ac.json");
//Firebase Credential
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://sweetu-6cb6e.firebaseio.com"
});

//email config
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'sweetu.karon@gmail.com',
        pass: 'karon@rajantushar'
    }
});
//For sending notification
const notification_options = {
    priority: "high",
    timeToLive: 60 * 60 * 24
};

router.get('/get-notification', (req, res, next) => {
    noti.find().sort({ createdAt: 'desc' })
        .then(data => {
            res.render('notification', { data: data, pageTitle: "Notifications" });
        }).catch(err => { console.log(err) });
});

router.post('/send-notification-one', async (req, res, next) => {
    const uid = req.body.userid;
    user.findOne({ _id: uid })
        .then(data => {
            const title = req.body.inputTitle;
            const body = req.body.inputBody;
            const type = req.body.type;
            if (type == "email") {
                if (req.file.filename) {
                    var mailOptions = {
                        from: 'sweetu.karon@gmail.com',
                        to: data.user_emailId,
                        subject: title,
                        text: body,
                        attachments: [
                            {
                                filename: req.file.filename,
                                path: "http://f598cf7e894e.ngrok.io/images/" + req.file.filename,
                                cid: 'logo-sizeid',
                            },
                        ],
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
                let message;
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
                const options = notification_options;
                const registrationToken = data.notificationTocken;
                admin.messaging().sendToDevice(registrationToken, message, options);
            }
            res.redirect('/user-detail/' + uid);
        }).catch(err => { console.log(err) });
});

router.post('/send-notification', async (req, res, next) => {
    const title = req.body.inputTitle;
    const body = req.body.inputBody;
    const sen = req.body.sendto;
    const type = req.body.type;
    let d;
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
    if (type == "email") {
        let data;
        if (sen == "all") {
            data = await user.find();
        }
        if (sen == "authorised") {
            data = await user.find({ user_isAuthorised: true });
        }
        if (sen == "subscribe") {
            data = await user.find({ id_subscribe: true });
        }
        for (let n of data) {
            if (req.file.filename) {
                var mailOptions = {
                    from: 'sweetu.karon@gmail.com',
                    to: n.user_emailId,
                    subject: title,
                    text: body,
                    attachments: [
                        {
                            filename: req.file.filename,
                            path: "http://f598cf7e894e.ngrok.io/images/" + req.file.filename,
                            cid: 'logo-sizeid',
                        },
                    ],
                };
            } else {
                var mailOptions = {
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
    } else {
        const data = await user.find({ isLogedIn: true });
        let message;
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
        const options = notification_options;
        for (let n of data) {
            const registrationToken = n.notificationTocken;
            await admin.messaging().sendToDevice(registrationToken, message, options);
        }
    }
    d.save()
        .then(data => {
            res.redirect('/get-notification');
        }).catch(err => { console.log(err) });
});

//FireBase Schedular
// cron.schedule("0 1 * * * *", function(){
//     var db=admin.database();
//     var userRef=db.ref("users");
//     userRef.once('value',function(snap){
//     res.status(200).json({"users":snap.val()});
// });
const db = admin.firestore();
const isValueExistInArray = (arr, name) => {
    const { length } = arr;
    const id = length + 1;
    const found = arr.some(el => el.x === name);
    if (!found) arr.push({ id, username: name });
    return arr;
}

cron.schedule("30 * * * * *", async (req, res, next) => {
    const userRef = db.collection('users');
    const snapshot = await userRef.where('state', '==', 1).get();
    const userData = await user.find({ is_Active: true }).select('is_Active').select('google_id');
    let arr = [];
    snapshot.forEach(doc => {
        let x = doc.id;
        arr.push(x);
    });
    if (userData.length > arr.length) {
        for(let x of userData){
            if(arr.includes(x.google_id)){
                continue;
            }else{
                x.is_Active = false;
                x.save();
            }
        }
    }
});

module.exports = router;