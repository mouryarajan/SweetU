const match = require('../models/m-match');
const user = require('../models/m-user');
const se = require('../models/m-setting');

exports.postMatch = async (req, res, next) => {
    const d = req.body;
    const sender = await user.findOne({google_id:d.inputSender});
    const receiver = await user.findOne({google_id:d.inputReceiver});
    const Match = new match({
        sender: sender._id,
        senderName: sender.user_name,
        receiver: receiver._id,
        receiverName: receiver._user_name
    });
    Match.save()
    .then(data=>{
        res.status(200).json({
            status: true,
            id: data._id 
        });
    }).catch(err=>{console.log(err)});
}

exports.postActive = (req, res, next) => {
    const d = req.body;
    match.findOne({_id: d.inputMatchId})
    .then(data=>{
        data.isActive = d.inputStatus;
        data.coin = d.inputCoin;
        data.save()
        .then
        (result=>{
            res.status(200).json({
                status: true
            });
        }).catch(err=>{console.log(err)});
    }).catch(err=>{console.log(err)});
}

exports.checkCoinVideoCall = async (req, res, next) => {
    const callData = await se.findOne({_id: "5fbcc934e311361f6063a84d"});
    let callRate = callData.call_rate;
    const id = req.body.inputUserId;
    user.findOne({_id: id})
    .then(data=>{
        if(callRate <= data.user_coin){
            data.user_coin = data.user_coin - callRate;
            data.save();
            res.status(200).json({
                status: true
            });
        }else{
            res.status(201).json({
                status: false
            });
        }
    }).catch(err=>{console.log(err)});
}

exports.chatUserDetails = (req, res, next) => {
    const gid = req.body.inputGoogleId;
    user.findOne({google_id:gid}).select('user_name').select('user_image').select('is_Active')
    .then(data=>{
        res.status(200).json({
            data: data
        })
    }).catch(err=>{console.log(err)});
}