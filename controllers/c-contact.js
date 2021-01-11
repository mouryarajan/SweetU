const contact = require('../models/m-contact');

exports.postChat = async (req, res, next) => {
    const id = req.body.inputUserId;
    const msg = req.body.inputMessage;
    const type = req.body.inputIsProblem;
    if(!id) return res.status(201).json({message: "Provide proper input"});
    
    let data = await contact.findOne({userId: id});

    if(data){
        let arr = data.user.items;
        arr.push({
            message: msg,
            isAdmin: false,
            isProblem: type
        });
        data.user.items = arr;
        data.save()
        .then(result=>{
            res.status(200).json({
                status: true
            })
        }).catch(err=>{console.log(err)});
    }else{
        let mess = {
            items: [{
                message: msg,
                isAdmin: false,
                isProblem: type
            }]
        }
        const Contact = new contact({
            userId: id,
            user: mess
        });
        Contact.save()
        .then(result=>{
            res.status(200).json({
                status: true
            })
        }).catch(err=>{console.log(err)});
    }
}

exports.getChat = async (req, res, next) => {
    contact.find()
    .populate({path: "userId", select: "user_name"})
    .sort({updatedAt: 'desc'})
    .then(data=>{
        console.log(data);
        let arr = [];
        for (let n of data){
            arr.push({
                name: n.userId.userName,
            });
        }
        res.render('contact', {
            pageTitle: "Contact Us",
            data: data
        })
    }).catch(err=>{console.log(err)});
}

exports.getApiChat = async (req, res, next) => {
    const id = req.body.inputUserId;
    if(!id) return res.status(201).json({message: "Provide proper input"});
    let data = await contact.findOne({userId: id});
    let arr = data.user.items;
    res.status(200).json({
        data: arr
    });
}