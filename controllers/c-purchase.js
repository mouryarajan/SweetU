const Purchase = require('../models/m-purchase');

exports.getPurchase = (req, res, next) =>{
    Purchase.find()
    .then(result=>{
        res.render('purchase',{
            pageTitle: "SweetU | Purchase",
            data: result    
        });
    })
    .catch(err=>{
        console.log(err);
    })
};

exports.postPurchase = (req, res, next) => {
    const coin = req.body.inputCoin;
    const amount = req.body.inputAmount;
    const comment = req.body.inputComment;
    const purchase = Purchase({
        coin: coin,
        amount: amount,
        comment: comment
    });
    purchase.save()
    .then(result=>{
        res.redirect('/purchase');
    })
    .catch(err=>{
        console.log(err);
    })
};

exports.getPurchaseDelete = (req, res, next) =>{
    const pid = req.params.inputUserId;
    Purchase.findByIdAndDelete(pid)
    .then(result => {
        if(result){
            res.status(200).json({ message: 'Sucess!' });
        }
    })
    .catch(err=>{console.log(err)});
}

exports.getAPIsPurchase = (req, res, next) =>{
    Purchase.find()
    .then(result=>{
        if(result){
            res.json({
                status: true,
                data: result
            })
        }else{
            res.json({
                status: false
            })
        }
    })
}