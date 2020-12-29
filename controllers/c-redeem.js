const redeem = require('../models/m-redeem.js');
const User = require('../models/m-user.js');
const redeemLog = require('../models/m-redeemlog');
const moment = require('moment');

exports.getRedeem = (req, res, next) => {
    redeem.find()
        .then(result => {
            if (result) {
                res.render('redeem', {
                    pageTitle: "Redeem Settings",
                    data: result
                })
            }
        }).catch(err => { console.log(err) });
}

exports.getRedeemLogAdmin = (req, res, next) => {
    redeemLog.find()
        .then(result => {
            if (result) {
                res.render('redeem-log', {
                    pageTitle: "Redeem Log",
                    data: result
                })
            }
        }).catch(err => { console.log(err) });
}

exports.postRedeem = (req, res, next) => {
    const id = req.body.inputId;
    const amount = req.body.inputAmount;
    const coin = req.body.inputCoin;
    const match = req.body.inputMatch;
    const remark = req.body.inputRemark;
    redeem.findOne({ _id: id })
        .then(result => {
            result.amount = amount;
            result.coin = coin;
            result.match = match;
            result.remark = remark;
            result.save()
                .then(data => {
                    if (data) {
                        res.redirect('/redeem');
                    }
                })
        })
}

exports.postFilterRedeemLog = (req, res, next) => {
    const sDate = req.body.inputStartDate;
    const eDate = req.body.inputEndDate;
    redeemLog.find({
        createdAt: {
            $gte: new Date(new Date(sDate).setHours(00, 00, 00)),
            $lt: new Date(new Date(eDate).setHours(23, 59, 59))
        }
    })
        .then(result => {
            res.render('redeem-log', {
                pageTitle: "Redeem Log",
                data: result
            })
        }).catch(err => { console.log(err) });
}

//Uncomment Bellow Code to insert Data from postman

// exports.postRedeemData = (req,res,next)=>{
//     const Redeem = new redeem({
//         amount: req.body.inputAmount,
//         coin: req.body.inputCoin,
//         match: req.body.inputMatch,
//         remark: req.body.inputRemark
//     });
//     Redeem.save()
//     .then(result=>{
//         if(result){
//             res.json({
//                 result
//             })
//         }
//     }).catch(err=>{console.log(err)});
// }

//API

exports.getApiRedeem = (req, res, next) => {
    redeem.find()
        .then(result => {
            if (result) {
                res.json({
                    status: true,
                    result
                })
            } else {
                res.json({
                    status: false
                })
            }
        }).catch(err => { console.log(err) });
}

//Request condition
exports.postRedeemCondition = (req, res, next) => {
    const d = req.body;
    if (!d) return res.status(201).json({ status: false, message: "Enter Proper Data!" });
    const uId = d.inputUserId;
    const coin = d.inputCoin;
    const match = d.inputMatch;
    User.findOne({ _id: uId })
        .then(data => {
            if (data) {
                if (data.match >= match && data.user_coin >= coin) {
                    res.status(200).json({
                        status: true
                    })
                } else {
                    res.status(201).json({
                        status: false,
                        message: "You don't have enough coin and matchs."
                    })
                }
            } else {
                res.status(201).json({ status: false, message: "User Not Found" });
            }
        }).catch(err => { console.log(err) });
}

//Coin and Matches Condition
exports.postMatchCoin = (req, res, next) => {
    const uId = req.body.inputUserId;
    const coin = req.body.inputCoin;
    const match = req.body.inputMatch;
    User.findOne({ _id: uId })
        .then(result => {
            if (result) {
                if (result.match >= match && result.user_coin >= coin) {
                    res.status(200).json({
                        status: true
                    })
                } else {
                    res.status(201).json({
                        status: false,
                        message: "Not enoufg Matches and Coins"
                    })
                }
            } else {
                res.status(201).json({
                    status: false,
                    message: "User Not Found"
                })
            }
        }).catch(err => { console.log(err) });
}

//Request For Money
exports.postRedeemLog = (req, res, next) => {
    const uId = req.body.inputUserId;
    const amount = req.body.inputAmount;
    const coin = req.body.inputCoin;
    const match = req.body.inputMatch;
    const mode = req.body.inputMode;
    const remark = "Reques for payment";
    const phno = req.body.inputPhoneNumber;
    User.findOne({ _id: uId })
        .then(result => {
            if (result) {
                if (result.match >= match && result.user_coin >= coin) {
                    Redeem = new redeemLog({
                        amount: amount,
                        coin: coin,
                        match: result.match,
                        remark: remark,
                        userId: result._id,
                        name: result.user_name,
                        phoneNumber: phno,
                        mode: mode
                    })
                    Redeem.save()
                        .then(data => {
                            if (data) {
                                result.user_coin = result.user_coin - coin;
                                result.match = result.match - match;
                                result.save();
                                res.status(200).json({
                                    status: true,
                                    message: "Request has been send please wait for response."
                                })
                            } else {
                                res.status(201).json({
                                    status: false,
                                    message: "Something went wrong."
                                })
                            }
                        })
                }
            } else {
                res.status(200).json({
                    status: false,
                    message: "Something went wrong."
                })
            }
        })
}

exports.postGetRedeemLogUser = (req, res, next) => {
    const uId = req.body.inputUserId;
    redeemLog.find({ userId: uId })
        .then(result => {
            if (result) {
                //var date = new Date(result.createdAt);
                // var d = moment(result.createdAt).format("DD-MM-YYYY");
                // arr = {
                //     status: result.status,
                //     remark: result.remark,
                //     amount: result.amount,
                //     coin: result.coin,
                //     match: result.match,
                //     userId: result.userId,
                //     name: result.name,
                //     phoneNumber: result.phoneNumber,
                //     mode: result.mode,
                //     createdAt: d
                // };
                console.log(arr);
                res.status(200).json({
                    status: true,
                    data: data
                })
            } else {
                res.status(201).json({
                    status: false,
                    message: "No Redeem Request"
                })
            }
        }).catch(err => { console.log(err) });
}

exports.postRedeemUpdate = (req, res, next) => {
    const rid = req.body.inputRedeemId;
    redeemLog.findOne({ _id: rid })
        .then(result => {
            if (result) {
                result.status = true;
                result.save()
                    .then(data => {
                        if (data) {
                            res.status(201).json({
                                status: true
                            })
                        } else {
                            res.status(201).json({
                                status: false
                            })
                        }
                    })
                    .catch(err => { console.log(err) });
            }
        })
}