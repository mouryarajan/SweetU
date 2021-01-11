const chat = require('../models/m-chat');

exports.postChat = async (req, res, next) =>{
    const sender = req.body.inputSenderId;
    const receiver = req.body.inputReceiverId;
    const Chat = new chat({
        sender: sender,
        receiver: receiver
    });
    await Chat.save();
    const Chatt = new chat({
        sender: receiver,
        receiver: sender
    });
    await Chatt.save();
    res.status(200).json({
        status: true
    })
}
exports.getChat = (req, res, next) =>{
    const id = req.body.inputUserId;
    chat.find({sender: id})
    .populate({path:'sender',select: "user_name",select:"user_image"})
    .populate({path:'receiver',select: "user_name",select:"user_image"})
    .sort({updatedAt:'desc'})
    .then(data=>{
        res.status(200).json({
            data: data
        })
    }).catch(err=>{console.log(err)});
}