const User = require('../models/m-user.js');
const editor = require('../models/m-editor');
const match = require('../models/m-match');
const subscription = require('../models/m-subscriptionlog');
const redeemlog = require('../models/m-redeemlog');
function isEmptyObject(obj) {
    return !Object.keys(obj).length;
}

exports.getDashBoard = async (req, res, next) => {
    var d = new Date(); // Today!
    d.setDate(d.getDate() - 1);

    //first- second card
    let total = 0;
    let totalFemale = 0;
    let totalMale = 0;
    let totalActive = 0;
    let totalActiveMale = 0;
    let totalActiveFemale = 0;
    let totalActiveAuthorized = 0;
    const use = await User.find();
    for (let x of use) {
        total++;
        if (x.user_gender == "Male") { totalMale++; }
        if (x.user_gender == "Female") { totalFemale++; }
        if (x.is_Active == true) { totalActive++; }
        if (x.is_Active == true && x.user_gender == "Male") { totalActiveMale++; }
        if (x.is_Active == true && x.user_gender == "Female") { totalActiveFemale++; }
        if (x.is_Active == true && x.user_isAuthorised == true) { totalActiveAuthorized++; }
    }

    //Third card 
    let totalMatch = 0;
    let mTom = 0;
    let fTof = 0;
    let mTof = 0;
    const mat = await match.find({
        createdAt: {
            $gte: new Date(new Date().setHours(00, 00, 00))
        }, isActive: true
    }).populate('sender', 'user_gender').populate('receiver', 'user_gender');
    for (let c of mat) {
        totalMatch++;
        if (c.sender.user_gender == "Male" && c.receiver.user_gender == "Male") { mTom++; }
        if (c.sender.user_gender == "Female" && c.receiver.user_gender == "Female") { fTof++; }
        if (c.sender.user_gender == "Male" && c.receiver.user_gender == "Female" || c.sender.user_gender == "Female" && c.receiver.user_gender == "Male") { mTof++; }
    }

    //Fourth Card
    let ms = 0; let fs = 0; let ts = 0;
    const totalSubscription = await subscription.find().populate('userId', 'user_gender');
    if (!isEmptyObject(totalSubscription)) {
        for (let x of totalSubscription) {
            if (x.userId.user_gender == "Male") {
                ms++;
            } else {
                fs++
            }
            ts++;
        }
    }

    //total today
    let todayTotal = 0;
    let todayTotalFemail = 0;
    let todayTotalMale = 0;
    const todayUser = await User.find({
        createdAt: {
            $gte: new Date(new Date().setHours(00, 00, 00))
        }
    });
    for (let x of todayUser) {
        todayTotal++;
        if (x.user_gender == "Male") { todayTotalMale++; }
        if (x.user_gender == "Female") { todayTotalFemail++ };
    }
    //total yesterday
    let yseterdayTotal = 0;
    let yseterdayTotalFemale = 0;
    let yseterdayTotalMale = 0;
    const yesterdayUser = await User.find({
        createdAt: {
            $gte: new Date(new Date(d).setHours(00, 00, 00)),
            $lt: new Date(new Date().setHours(00, 00, 00))
        }
    });
    for (let x of yesterdayUser) {
        yseterdayTotal++;
        if (x.user_gender == "Male") { yseterdayTotalMale++; }
        if (x.user_gender == "Female") { yseterdayTotalFemale++; }
    }

    //matched User
    let todayTotalMatch = 0;let yesterdayTotalMatch = 0;
    let todayMaleMatch = 0;let yesterdayMaleMatch = 0;
    let todayFemaleMatch = 0;let yesterdayFemaleMatch = 0;
    const todayMat = await match.find({
        createdAt: {
            $gte: new Date(new Date().setHours(00, 00, 00))
        }
    }).populate('sender', 'user_gender').populate('receiver', 'user_gender');
    for(let c of todayMat){
        todayTotalMatch++;
        if (c.sender.user_gender == "Male" ) { todayMaleMatch++; }
        if (c.sender.user_gender == "Female" ) { todayFemaleMatch++; }
    }
    const yesterdayMat = await match.find({
        createdAt: {
            $gte: new Date(new Date(d).setHours(00, 00, 00)),
            $lt: new Date(new Date().setHours(00, 00, 00))
        }
    }).populate('sender', 'user_gender').populate('receiver', 'user_gender');
    for(let c of yesterdayMat){
        yesterdayTotalMatch++;
        if (c.sender.user_gender == "Male" ) { yesterdayMaleMatch++; }
        if (c.sender.user_gender == "Female" ) { yesterdayFemaleMatch++; }
    }

    //subscription today
    const todaySubscription = await subscription.find({
        createdAt: {
            $gte: new Date(new Date().setHours(00, 00, 00))
        }
    }).populate('userId', 'user_gender');
    let tts = 0;
    let tms = 0;
    let tfs = 0;
    for (let x of todaySubscription) {
        if (x.userId.user_gender == "Male") {
            tms++;
        } else {
            tfs++;
        }
        tts++;
    }

    //subscription yesterday
    const yesterdaySubscription = await subscription.find({
        createdAt: {
            $gte: new Date(new Date(d).setHours(00, 00, 00)),
            $lt: new Date(new Date().setHours(00, 00, 00))
        }
    }).populate('userId', 'user_gender');
    let yts = 0;
    let yms = 0;
    let yfs = 0;
    for (let x of yesterdaySubscription) {
        if (x.userId.user_gender == "Male") {
            yms++;
        } else {
            yfs++;
        }
        yts++;
    }
    let data = {
        total: total, totalFemale: totalFemale,
        totalMale: totalMale, totalActive: totalActive,
        totalActiveMale: totalActiveMale, totalActiveFemale: totalActiveFemale,
        totalActiveAuthorized: totalActiveAuthorized, totalMatch: totalMatch,
        totalMaleToMale: mTom, totalFemaleToFemale: fTof, totalMaleToFemale: mTof,
        totalMaleSubscription: ms, totalFemaleSubscription: fs, totalSubscription: ts,
        todayTotal: todayTotal, todayTotalFemail: todayTotalFemail, todayTotalMale: todayTotalMale,
        yseterdayTotal: yseterdayTotal, yseterdayTotalFemale: yseterdayTotalFemale, yseterdayTotalMale: yseterdayTotalMale,
        todayTotalMatch:todayTotalMatch,todayMaleMatch:todayMaleMatch,todayFemaleMatch:todayFemaleMatch,
        yesterdayTotalMatch:yesterdayTotalMatch,yesterdayMaleMatch:yesterdayMaleMatch,yesterdayFemaleMatch:yesterdayFemaleMatch,
        todayTotalSubscription:tts,todayMaleSubscription:tms,todayFemaleSubscription:tfs,
        yesterdayTotalSubscription:yts,yesterdayMaleSubscription:yms,yesterdayFemaleSubscription:yfs
    };
    //console.log(data);

    const latestUser = await User.find().sort({ createdAt: 'desc' }).limit(5);
    const subscribedUser = await subscription.find().populate('userId', 'user_gender user_name user_image createdAt user_about').sort({createdAt:'desc'}).limit(5);
    const redeemLog = await redeemlog.find().populate('userId','user_image user_about').sort({createdAt:'desc'}).limit(5);
    res.render('dashboard', {
        pageTitle: 'Dashboard',
        data: data,
        latestUser: latestUser,
        subscribedUser: subscribedUser,
        redeemLog:redeemLog
    });
}

exports.getEditor = (req, res, next) => {
    editor.findOne({ _id: "5feae8e74724e221bc769777" })
        .then(data => {
            if (data) {
                res.render('editor', { pageTitle: 'Editor', data: data });
            }
        }).catch(err => { console.log(err) });
}

exports.getCommunityGuideLine = (req, res, next) => {
    editor.findOne({ _id: "5feae8e74724e221bc769777" })
        .then(data => {
            if (data) {
                res.render('comunity', { pageTitle: 'Community', data: data });
            }
        }).catch(err => { console.log(err) });
}

exports.getTermsOfUse = (req, res, next) => {
    editor.findOne({ _id: "5feae8e74724e221bc769777" })
        .then(data => {
            if (data) {
                res.render('terms', { pageTitle: 'Terms', data: data });
            }
        }).catch(err => { console.log(err) });
}

exports.postEditor = (req, res, next) => {
    const area = req.body.inputTextArea;
    const pid = req.body.pid;
    editor.findOne({ _id: pid })
        .then(data => {
            if (data) {
                let pdata = "<html><body>" + area + "</body></html>"
                data.privacyAndPolicy = pdata
                data.save()
                    .then(result => {
                        if (result) {
                            res.redirect('/editor');
                        }
                    }).catch(err => { console.log(err) });
            }
        }).catch(err => { console.log(err) });
    // const area = req.body.inputTextArea;area
    // const ed = new  editor({
    //     privacyAndPolicy: area
    // })
    // ed.save()
    // .then(result=>{
    //     if(result){
    //         res.redirect('/editor');
    //     }
    // })
}

exports.postCommunityGuideLine = (req, res, next) => {
    const area = req.body.inputTextArea;
    const pid = req.body.pid;
    editor.findOne({ _id: pid })
        .then(data => {
            if (data) {
                let pdata = "<html><body>" + area + "</body></html>"
                data.communityGuideLine = pdata
                data.save()
                    .then(result => {
                        if (result) {
                            res.redirect('/comunity');
                        }
                    }).catch(err => { console.log(err) });
            }
        }).catch(err => { console.log(err) });
}

exports.postTermsOfUse = (req, res, next) => {
    const area = req.body.inputTextArea;
    const pid = req.body.pid;
    editor.findOne({ _id: pid })
        .then(data => {
            if (data) {
                let pdata = "<html><body>" + area + "</body></html>"
                data.termsOfUse = pdata
                data.save()
                    .then(result => {
                        if (result) {
                            res.redirect('/terms');
                        }
                    }).catch(err => { console.log(err) });
            }
        }).catch(err => { console.log(err) });
}

//API

exports.getPivacyAndPolicyAPI = (req, res, next) => {
    editor.findOne({ _id: "5feae8e74724e221bc769777" })
        .then(data => {
            if (data) {
                let a = data.privacyAndPolicy
                res.status(200).json({ data: a });
            } else {
                res.status(201).json({ status: false, message: "Not found any data" });
            }
        }).catch(err => { console.log(err) });
}

exports.getCommunityGuideLineAPI = (req, res, next) => {
    editor.findOne({ _id: "5feae8e74724e221bc769777" })
        .then(data => {
            if (data) {
                let a = data.communityGuideLine
                res.status(200).json({ data: a });
            } else {
                res.status(201).json({ status: false, message: "Not found any data" });
            }
        }).catch(err => { console.log(err) });
}

exports.getTermsOfUserAPI = (req, res, next) => {
    editor.findOne({ _id: "5feae8e74724e221bc769777" })
        .then(data => {
            if (data) {
                let a = data.termsOfUse
                res.status(200).json({ data: a });
            } else {
                res.status(201).json({ status: false, message: "Not found any data" });
            }
        }).catch(err => { console.log(err) });
}

