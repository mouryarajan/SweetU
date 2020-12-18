const admins = require('../models/m-admin');
const { validationResult } = require('express-validator');
const crypto = require('crypto');
const bcrypt = require('bcryptjs'); //if you want to encript the password watch 6th video from 15th folderWS

exports.getLoginPage = (req, res, next) => {
    let message = req.flash('error');
    if(message.length > 0){
        message=message[0];
    }else{
        message=null;
    }
    res.render('login',{pageTitle:'Login',errorMessage: message,});
}

exports.postLoginUser = (req, res,next) => {
    const admin_userId = req.body.inputAdminUserId;
    const admin_password = req.body.inputAdminPassword;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).render('login',{pageTitle:'Login',errorMessage: errors.array()[0].msg,}); 
    }
    admins.findOne({admin_userId: admin_userId, admin_password: admin_password})
    .then(ad=>{
        if(ad)
        {
            req.session.isLogedin = true;
            req.session.admin = ad;
            res.redirect('/dashboard');
        }
        else{
            req.flash('error', 'Invalid Credential!');
            res.redirect('/');
        }
    })
    .catch(err=>{
        console.log(err)
    });
}

exports.postLogoutUser = (req, res, next) => {
    req.session.destroy((err) =>{
        console.log(err);
        console.log('session Destroyed');
        res.redirect('/');
    });
}

exports.getForgetPassword=(req,res,next) => {
    let message = req.flash('error');
    if(message.length > 0){
        message=message[0];
    }else{
        message=null;
    }
    res.render('forgetpassword',{pageTitle:'Forget Password',errorMessage: message,});
}

exports.postForgetPassword = (req,res,next) =>{
    crypto.randomBytes(32, (err, buffer)=>{
        if(err){
            console.log(err);
            return res.redirect('/user-forget-password');
        }
        const token = buffer.toString('hex');
        admins.findOne({admin_userId: req.body.inputAdminUserId}).then(ad => {
            if(!ad){
                req.flash('error','No account with that user id not found');
                return res.redirect('/user-forget-password');
            }
            ad.admin_token = token;
            ad.admin_tokenExpiration = Date.now() + 3600000;
            return ad.save();
        })
        .then(result =>{                    
            res.redirect('/');
            transpoter.sendMail({
                to: req.body.inputAdminUserId,
                from: 'rajanmourya70@gmail.com',
                subject: 'Password reset!',
                html: `
                    <p>You Requested to Password Reset</p>
                    <p>Click this<a href="http://localhost:3000/user-forget-password/${token}"> Link </a> to set a new password.</p>
                `
            });
        })
        .catch(err => {console.log(err);});
    });
}

exports.getConfirmPassword = (req, res, next)=>{
    const token = req.param.token;
    admins.findOne({admin_token: token, admin_tokenExpiration: {$gt: Date.now()}})
    .then(ad =>{
        let message = req.flash('error');
        if(message.length > 0){
            message=message[0];
        }else{
            message=null;
        }
        res.render('confirmpassword',{pageTitle:'New Password',errorMessage: message,adminId: ad._id.toString(),passwordToken: token});
    })
    .catch(err=>{console.log(err)});
}

exports.postConfirmPassword = (req,res,next)=>{
    const newPassword = rqe.body.inputAdminPassword;
    const adminId = req.body.inputAdminId;
    const passwordToken = req.body.inputAdminToken;

    admins.findOne({admin_token: passwordToken, admin_tokenExpiration: {$gt: Date.now()}, _id:adminId})
    .then(ad=>{
        ad.admin_password = newPassword;
        ad.admin_token = undefined;
        ad.admin_tokenExpiration = undefined;
        return ad.save()
    })
    .then(result=>{
        res.redirect('/');  
    })
    .catch(err=>{console.log(err)});
}
