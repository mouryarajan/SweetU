const userCoin = require('../models/m-usercoin');

exports.getCoinLog = (req, res, next) => {
    uid = req.body.inputUserId;
    userCoin.find({userId: uid})
    .then(data=>{
        res.status(200).json({
            data: data
        });
    }).catch(err=>{console.log(err)});
}