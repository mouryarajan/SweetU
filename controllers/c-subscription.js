const sub = require('../models/m-subscription');
const subLog = require('../models/m-subscriptionlog');
const user = require('../models/m-user');

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

exports.getSubscription = (req, res, next) => {
    sub.find()
        .then(data => {
            res.render('subscription', {
                pageTitle: "Subscription",
                data: data
            })
        })
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
            res.status(200).json({
                data: data
            })
        }).catch(err => { console.log(err) });
}

exports.postAPIsSubscriptionLog = (req, res, next) => {
    const d = req.body;
    if (!d) return res.status(201).json({ message: "Provide Proper Data" });
    const slog = new subLog({
        userId: d.inputUserId,
        name: d.inputName,
        amount: d.inputAmount,
        duration: d.inputDuration
    });
    slog.save()
        .then(data => {
            user.findOne({ _id: d.inputUserId })
                .then(result => {
                    var someDate = new Date();
                    var numberOfDaysToAdd = d.inputDuration;
                    someDate.setDate(someDate.getDate() + numberOfDaysToAdd);
                    var dd = someDate.getDate();
                    var mm = someDate.getMonth() + 1;
                    var y = someDate.getFullYear();

                    var someFormattedDate = dd + '/' + mm + '/' + y;
                    var subData = {
                        startDate: someDate,
                        endDate: someFormattedDate
                    }
                    result.id_subscribe = true;
                    result.subscription = subData;
                    result.save()
                        .then(rs => {
                            res.status(200).json({ status: true });
                        }).catch(err => { console.log(err) });
                }).catch(err => { console.log(err) });
        }).catch(err => { console.log(err) });
}