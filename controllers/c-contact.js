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
    .sort({updatedAt: 'desc'})
    .then(data=>{
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