const setting = require('../models/m-setting')
exports.getSetting = (req,res,next) => {
    let i = '5fbcc934e311361f6063a84d';
    setting.findById(i)
    .then(result=>{
        if(result){
            res.render('setting',{pageTitle:'Settings',result:result});
        }
    })
    .catch(err => {console.log(err)});
}

exports.postSetting = (req, res, next) => {
    let i = '5fbcc934e311361f6063a84d';
    setting.findById(i)
    .then(result=>{
        if(result){
            result.bonus_coin = req.body.inputCoin;
            result.call_duration = req.body.inputWallet;
            result.call_rate = req.body.inputCallRate;
            result.save();
            res.render('setting',{pageTitle:'Settings',result:result});
        }
    })
    .catch(err => {console.log(err)});
}

