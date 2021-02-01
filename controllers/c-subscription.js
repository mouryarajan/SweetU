const sub = require('../models/m-subscription');
const subLog = require('../models/m-subscriptionlog');
const user = require('../models/m-user');
const coinss = require('../models/m-coinlog');
const userCoin = require('../models/m-usercoin');

exports.postSubscription = (req, res, next) => {
    const d = req.body;
    var someDate = new Date();
    var dd = someDate.getDate();
    var mm = someDate.getMonth() + 1;
    var y = someDate.getFullYear();

    var someFormattedDate = dd + '/' + mm + '/' + y;
    const subscription = new sub({
        name: d.inputName,
        amount: d.inputAmount,
        duration: d.inputDuration,
        description: d.inputDescription,
        startDate: someFormattedDate
    });
    subscription.save()
        .then(data => {
            res.redirect('/subscription');
        }).catch(err => { console.log(err) });
}

exports.postSubscriptionFilter = (req, res, next) => {
    const sDate = req.body.inputStartDate;
    const eDate = req.body.inputEndDate;
    subLog.find({
        createdAt: {
            $gte: new Date(new Date(sDate).setHours(00, 00, 00)),
            $lt: new Date(new Date(eDate).setHours(23, 59, 59))
        }
    }).then(data=>{
        res.render('subscriptionlog', {
            pageTitle: "Subscription Log",
            data: data
        })
    })
}

exports.postFilterCoinLog = (req, res, next) => {
    const sDate = req.body.inputStartDate;
    const eDate = req.body.inputEndDate;
    coinss.find({
        createdAt: {
            $gte: new Date(new Date(sDate).setHours(00, 00, 00)),
            $lt: new Date(new Date(eDate).setHours(23, 59, 59))
        }
    }).then(data=>{
        res.render('coinlog', {
            pageTitle: "Coin Purchase",
            data: data
        })
    })
}

exports.getSubscription = (req, res, next) => {
    sub.find()
        .then(data => {
            res.render('subscription', {
                pageTitle: "Subscription",
                data: data
            })
        })
}

exports.getCoinLog = (req, res, next) => {
    coinss.find()
    .then(data=>{
        res.render('coinlog', {
            pageTitle: "Coin Purchase",
            data: data
        })
    });
}

exports.getSubscriptionLog = (req, res, next) => {
    subLog.find()
        .then(data => {
            res.render('subscriptionlog', {
                pageTitle: "Subscription Log",
                data: data
            })
        })
}

//API

exports.getAPIsSubscription = (req, res, next) => {
    sub.find()
        .then(data => {
            let a =[];
            let y = 0;
            for(let x of data){
                a.push({
                    name:x.name,
                    amount: x.amount,
                    duration: x.duration,
                    description: x.description,
                    count:y
                });
                y++;
            }
            res.status(200).json({
                data: a
            })
        }).catch(err => { console.log(err) });
}

exports.postAPIsSubscriptionLog = (req, res, next) => {
    const d = req.body;
    if (!d) return res.status(201).json({ message: "Provide Proper Data" });
    const slog = new subLog({
        userId: d.inputUserId,
        name: d.inputName,
        amount: Number(d.inputAmount),
        duration: Number(d.inputDuration)
    });
    slog.save()
        .then(data => {
            user.findOne({ _id: d.inputUserId })
                .then(result => {
                    var currentDate = new Date()
                    var someDate = new Date();
                    var numberOfDaysToAdd = d.inputDuration;
                    someDate.setDate(someDate.getDate() + numberOfDaysToAdd);
                    var subData = {
                        startDate: currentDate,
                        endDate: someDate,
                        days: d.inputDuration
                    }
                    result.id_subscribe = true;
                    result.subscription = subData;
                    result.save()
                        .then(rs => {
                            if(rs){
                                res.status(200).json({ status: true });
                            }
                        }).catch(err => { console.log(err) });
                }).catch(err => { console.log(err) });
        }).catch(err => { console.log(err) });
}