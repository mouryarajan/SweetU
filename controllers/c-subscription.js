const sub = require('../models/m-subscription');

exports.postSubscription = (req, res, next) => {
    const d = req.body;
    const subscription = new sub({
        name: d.inputName,
        amount: d.inputAmount,
        duration: d.inputDuration,
        description: d.inputDescription
    });
    subscription.save()
    .then(data=>{
        res.redirect('/subscription');
    }).catch(err=>{console.log(err)});
}

exports.getSubscription = (req, res, next) => {
    sub.find()
    .then(data=>{
        res.render('subscription',{
            pageTitle: "Subscription",
            data: data
        })
    })
}

//API

exports.getAPIsSubscription = (req, res, next) => {
    sub.find()
    .then(data=>{
        res.status(200).json({
            data: data
        })
    }).catch(err=>{console.log(err)});
}