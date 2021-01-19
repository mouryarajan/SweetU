const User = require('../models/m-user.js');
const editor = require('../models/m-editor');
const match = require('../models/m-match');

exports.getDashBoard = async (req, res, next) => {
    const total = await User.find().countDocuments();
    const totalFemale = await User.find({ user_gender: 'Female' }).countDocuments();
    const totalMale = await User.find({ user_gender: 'Male' }).countDocuments();
    const totalActive = await User.find({ is_Active: true }).countDocuments();
    const totalActiveMale = await User.find({ is_Active: true, user_gender: "Male" }).countDocuments();
    const totalActiveFemale = await User.find({ is_Active: true, user_gender: "Female" }).countDocuments();
    const totalActiveAuthorized = await User.find({user_isAuthorised: true, is_Active: true}).countDocuments();
    var d = new Date(); // Today!
    d.setDate(d.getDate() - 1);

    const todayTotal = await User.find({
        createdAt: {
            $gte: new Date(new Date().setHours(00, 00, 00))
        }
    }).countDocuments();
    const todayTotalFemail = await User.find({
        createdAt: {
            $gte: new Date(new Date().setHours(00, 00, 00))
        },user_gender: "Femail"
    }).countDocuments();
    const todayTotalMale = await User.find({
        createdAt: {
            $gte: new Date(new Date().setHours(00, 00, 00))
        },user_gender: "Male"
    }).countDocuments();

    const yseterdayTotal = await User.find({
        createdAt: {
            $gte: new Date(new Date(d).setHours(00, 00, 00)),
            $lt: new Date(new Date().setHours(00, 00, 00))
        }
    }).countDocuments();
    const yseterdayTotalFemail = await User.find({
        createdAt: {
            $gte: new Date(new Date(d).setHours(00, 00, 00)),
            $lt: new Date(new Date().setHours(00, 00, 00))
        },user_gender: "Femail"
    }).countDocuments();
    const yseterdayTotalMale = await User.find({
        createdAt: {
            $gte: new Date(new Date(d).setHours(00, 00, 00)),
            $lt: new Date(new Date().setHours(00, 00, 00))
        },user_gender: "Male"
    }).countDocuments();
    const latestUser = await User.find().sort({createdAt: 'desc'}).limit(5)
    const latestMatch = await match.find().sort({createdAt: 'desc'}).limit(5)

    res.render('dashboard', {
        pageTitle: 'Dashboard',
        total: total,
        totalFemale: totalFemale,
        totalMale: totalMale,
        totalActive: totalActive,
        totalActiveMale: totalActiveMale,
        totalActiveFemale: totalActiveFemale,
        todayTotal: todayTotal,
        yseterdayTotal: yseterdayTotal,
        todayTotalFemail: todayTotalFemail,
        todayTotalMale:todayTotalMale,
        yseterdayTotalFemail:yseterdayTotalFemail,
        yseterdayTotalMale:yseterdayTotalMale,
        latestUser: latestUser,
        latestMatch: latestMatch,
        totalActiveAuthorized: totalActiveAuthorized
    });
}

exports.getEditor = (req, res, next) =>{
    editor.findOne({_id: "5feae8e74724e221bc769777"})
    .then(data=>{
        if(data){
            res.render('editor',{pageTitle:'Editor',data:data});
        }
    }).catch(err=>{console.log(err)});
}

exports.getCommunityGuideLine = (req, res, next) => {
    editor.findOne({_id:"5feae8e74724e221bc769777"})
    .then(data=>{
        if(data){
            res.render('comunity',{pageTitle:'Community',data:data});
        }
    }).catch(err=>{console.log(err)});
}

exports.getTermsOfUse = (req, res, next) => {
    editor.findOne({_id:"5feae8e74724e221bc769777"})
    .then(data=>{
        if(data){
            res.render('terms',{pageTitle:'Terms',data:data});
        }
    }).catch(err=>{console.log(err)});
}

exports.postEditor = (req, res, next) => {
    const area = req.body.inputTextArea;
    const pid = req.body.pid;
    editor.findOne({_id: pid})
    .then(data=>{
        if(data){
            let pdata = "<html><body>" + area + "</body></html>"
            data.privacyAndPolicy = pdata
            data.save()
            .then(result=>{
                if(result){
                    res.redirect('/editor');
                }
            }).catch(err=>{console.log(err)});
        }
    }).catch(err=>{console.log(err)});
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
    editor.findOne({_id: pid})
    .then(data=>{
        if(data){
            let pdata = "<html><body>" + area + "</body></html>"
            data.communityGuideLine = pdata
            data.save()
            .then(result=>{
                if(result){
                    res.redirect('/comunity');
                }
            }).catch(err=>{console.log(err)});
        }
    }).catch(err=>{console.log(err)});
}

exports.postTermsOfUse = (req, res, next) => {
    const area = req.body.inputTextArea;
    const pid = req.body.pid;
    editor.findOne({_id: pid})
    .then(data=>{
        if(data){
            let pdata = "<html><body>" + area + "</body></html>"
            data.termsOfUse = pdata
            data.save()
            .then(result=>{
                if(result){
                    res.redirect('/terms');
                }
            }).catch(err=>{console.log(err)});
        }
    }).catch(err=>{console.log(err)});
}

//API

exports.getPivacyAndPolicyAPI = (req, res, next) =>{
    editor.findOne({_id:"5feae8e74724e221bc769777"})
    .then(data=>{
        if(data){
            let a = data.privacyAndPolicy
            res.status(200).json({data:a});
        }else{
            res.status(201).json({status:false, message: "Not found any data"});
        }
    }).catch(err=>{console.log(err)});
}

exports.getCommunityGuideLineAPI = (req, res, next) =>{
    editor.findOne({_id:"5feae8e74724e221bc769777"})
    .then(data=>{
        if(data){
            let a = data.communityGuideLine
            res.status(200).json({data:a});
        }else{
            res.status(201).json({status:false, message: "Not found any data"});
        }
    }).catch(err=>{console.log(err)});
}

exports.getTermsOfUserAPI = (req, res, next) =>{
    editor.findOne({_id:"5feae8e74724e221bc769777"})
    .then(data=>{
        if(data){
            let a = data.termsOfUse
            res.status(200).json({data:a});
        }else{
            res.status(201).json({status:false, message: "Not found any data"});
        }
    }).catch(err=>{console.log(err)});
}

