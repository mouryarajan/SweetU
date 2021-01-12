const contact = require('../models/m-contact');

function isEmptyObject(obj) {
    return !Object.keys(obj).length;
}

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
    .populate('userId',["user_name" ,"user_image"])
    .sort({updatedAt: 'desc'})
    .then(data=>{
        //console.log(data);
        let arr = [];
        let arrr = [];
        let z = false;
        for (let n of data){
            let drr = n.user.items;
            //console.log(drr[drr.length-1]);
            for(let x of drr){
                //console.log(n.userId.user_name);
                if(x.isProblem){
                    if(isEmptyObject(arr)){
                        arr.push({
                            id: n._id,
                            name: n.userId.user_name,
                            image: n.userId.user_image
                        });
                    }else{
                        for(let y of arr){
                            if(y.name == n.userId.user_name){
                                z=true;
                            }
                        }
                        if(z){
                            z=false;
                            continue;
                        }else{
                            arr.push({
                                id: n._id,
                                name: n.userId.user_name,
                                image: n.userId.user_image
                            });
                        }
                    }
                }else{
                    if(isEmptyObject(arrr)){
                        arrr.push({
                            id: n._id,
                            name: n.userId.user_name,
                            image: n.userId.user_image
                        });
                    }else{
                        for(let y of arrr){
                            if(y.name == n.userId.user_name){
                                z=true;
                            }
                        }
                        if(z){
                            z=false;
                            continue;
                        }else{
                            arrr.push({
                                id: n._id,
                                name: n.userId.user_name,
                                image: n.userId.user_image
                            });
                        }
                    }
                    
                }
            }
        }
        res.render('contact', {
            pageTitle: "Contact Us",
            suggestion: arrr,
            problem: arr
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

exports.getChatDetails = async (req, res, next) => {
    const id = req.params.inputUserId;
    contact.findOne({_id: id})
    .populate('userId',["user_image","user_name"])
    .then(data=>{
        arr = data.user.items;
        res.render('chat',{
            pageTitle: "Chat",
            data: arr,
            image: data.userId.user_image,
            name: data.userId.user_name,
            id: id
        })
    }).catch(err=>{console.log(err)});
}

exports.postAdminChat = async (req, res, next) => {
    cid = req.body.inputChatId;
    msg = req.body.inputMessage;
    type = req.body.inputType;
    contact.findOne({_id: cid})
    .then(data=>{
        arr = data.user.items;
        arr.push({
            message: msg,
            isAdmin: true,
            isProblem: type
        });
        data.user.items = arr;
        data.save()
        .then(result=>{
            res.redirect('/get-chat-details/'+cid.toString());
        }).catch(err=>{console.log(err)});
    }).catch(err=>{console.log(err)});
}