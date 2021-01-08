const express = require('express');
const router = express.Router();
var admin = require("firebase-admin");
const user = require('../models/m-user');
const noti = require('../models/m-notification');

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
    noti.find().sort({createdAt: 'desc'})
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
            const s = req.body.image;
            let image;
            if (s) {
                image = req.file;
            }
            const type = req.body.type;
            let d;
            if (image) {
                const x = image.filename;
                const images = x;
                d = new noti({
                    title: title,
                    body: body,
                    image: images,
                    sendto: "individual",
                    type: type,
                    userId: data._id,
                    name: data.user_name
                });
            } else {
                d = new noti({
                    title: title,
                    body: body,
                    sendto: "individual",
                    type: type,
                    userId: data._id,
                    name: data.user_name
                });
            }
            if (type == "email") {
                if (image) {
                    var mailOptions = {
                        from: 'sweetu.karon@gmail.com',
                        to: data.user_emailId,
                        subject: title,
                        text: body,
                        attachments: [
                            {
                                filename: s,
                                path: "./images/" + s,
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
                if (image) {
                    const x = image.filename;
                    const images = x;
                    message = {
                        notification: {
                            title: title,
                            body: body,
                            image: images
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
            d.save()
                .then(data => {
                    res.redirect('/get-notification');
                }).catch(err => { console.log(err) });
        }).catch(err => { console.log(err) });
});

router.post('/send-notification', async (req, res, next) => {
    const title = req.body.inputTitle;
    const body = req.body.inputBody;
    const s = req.body.image;
    const sen = req.body.sendto;
    let image;
    if (s) {
        image = req.file;
    }
    const type = req.body.type;
    let d;
    if (image) {
        const x = image.filename;
        const images = x;
        d = new noti({
            title: title,
            body: body,
            image: images,
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
        if(sen == "all"){
            data = await user.find();
        }
        if(sen == "authorised"){
            data = await user.find({user_isAuthorised: true});
        }
        if(sen == "subscribe"){
            data = await user.find({id_subscribe: true});
        }
        for (let n of data) {
            var mailOptions = {
                from: 'sweetu.karon@gmail.com',
                to: n.user_emailId,
                subject: title,
                text: body
            };

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
        if (image) {
            const x = image.filename;
            const images = x;
            console.log(images);
            message = {
                notification: {
                    title: title,
                    body: body,
                    image: images
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

module.exports = router;