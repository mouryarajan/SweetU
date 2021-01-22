const setting = require('../models/m-setting')
exports.getSetting = (req,res,next) => {
    let i = '5fbcc934e311361f6063a84d';
    setting.findById(i)
    .then(result=>{
        if(result){
            //console.log(result);
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
            result.call_duration = req.body.inputCallDuration;
            result.call_rate = req.body.inputCallRate;
            result.gender_change_both = req.body.inputGenderChangeBoth;
            result.gender_change_female = req.body.inputGenderChangeFemale;
            result.gender_change_male = req.body.inputGenderChangeMale;
            result.start_call_rate = req.body.inputStartCallRate;
            result.chat_rate = req.body.inputChatRate;
            if(req.body.inputWallet=="true"){
                result.wallet = true;
            }else{
                result.wallet = false;
            }
            if(req.body.inputEarn=="true"){
                result.earn_diamond = true;
            }else{
                result.earn_diamond = false;
            }
            result.save();
            res.render('setting',{pageTitle:'Settings',result:result});
        }
    })
    .catch(err => {console.log(err)});
}

