const block = require('../models/m-block');
const user= require('../models/m-user');

exports.getBlockUser = (req, res, next) =>{
    block.find()
    .sort({updatedAt:'desc'})
    .then(data=>{
        res.render('block-user',({
            pageTitle: "Block Users",
            data: data
        }))
    }).catch(err=>{console.log(err)});
}

exports.getBlockedBy = (req, res, next)=>{
    const uId = req.params.inputUserId;
    block.findOne({_id: uId})
    .then(result=>{
        if(result){
            const data = result.blockedBy.users;
            res.render('blockby',{
                pageTitle: "Block By",
                data: data
            })
        }
    })
}