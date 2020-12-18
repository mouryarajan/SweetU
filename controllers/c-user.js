const User = require('../models/m-user.js');
const settings = require('../models/m-setting');
const country = require('../models/m-country');
const block = require('../models/m-block');
const date = require('date-and-time');
const fileHelper = require('../util/file');
const mongoose = require('mongoose');
const fs = require('fs');
const mime = require('mime');

// const jwt = require('jsonweb~');

exports.getUserList = (req, res, next) => {
    User.find().select('user_name').select('user_emailId').select('user_gender').select('user_isAuthorised').select('user_isBlock')
        .then(users => {
            res.render('userlist', {
                users: users,
                pageTitle: 'User List'
            })
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getAuthorisedUserList = (req, res, next) => {
    User.find({ user_isAuthorised: true })
        .then(users => {
            res.render('authorisedUserlist', {
                users: users,
                pageTitle: 'User List'
            })
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getAddUser = (req, res, next) => {
    res.render('adduser', {
        pageTitle: 'Add User',
        editing: false,
        error: false
    });
};

exports.postAddUser = (req, res, next) => {
    settings.findOne({ _id: "5fbcc934e311361f6063a84d" })
        .then(result => {
            const now = new Date();
            const user_coinLog = {
                items: [{
                    transactionId: Math.floor(100000 + Math.random() * 900000),
                    coinAmount: result.bonus_coin,
                    remark: 'Bonus Coins For Registration',
                    date: date.format(now, 'DD/MM/YYYY'),
                    time: date.format(now, 'hh:mm A'),
                }]
            };
            const user_walletLog = {
                items: [{
                    transactionId: Math.floor(100000 + Math.random() * 900000),
                    walletAmount: result.bonus_amount,
                    remark: 'Bonus Amount For Registration',
                    date: date.format(now, 'DD/MM/YYYY'),
                    time: date.format(now, 'hh:mm A'),
                }]
            };
            const user_coin = 50;
            const user_wallet = 50;
            const user_name = req.body.inputName;
            const user_emailId = req.body.inputEmail;
            const user_gender = req.body.inputGender;
            const user_genderPreference = req.body.inputGenderPreference;
            const user_isAuthorised = req.body.inputStatus;
            const user_type = req.body.inputType;
            const user_about = req.body.inputAbout;
            const user_image = req.file;
            const user_age = req.body.inputAge;
            const user_profession = null;
            const user_country = null;
            const user_countryCode = null;
            if (!user_image) {
                return res.status(422).render('adduser', {
                    pageTitle: 'Add User',
                    editing: false,
                    error: true,
                    users: {
                        user_name: req.body.inputName,
                        user_emailId: req.body.inputEmail,
                        user_gender: req.body.inputGender,
                        user_genderPreference: req.body.inputGenderPreference,
                        user_isAuthorised: req.body.inputStatus,
                        user_type: req.body.inputType,
                        user_about: req.body.inputAbout,
                        user_age: req.body.inputAge,
                    }
                });
            }
            const x = user_image.filename;
            const images = "images/" + x;
            const user = new User({
                user_name: user_name,
                user_about: user_about,
                user_age: user_age,
                user_emailId: user_emailId,
                user_gender: user_gender,
                user_genderPreference: user_genderPreference,
                user_profession: user_profession,
                user_isAuthorised: user_isAuthorised,
                user_type: user_type,
                user_image: images,
                user_coin: user_coin,
                user_wallet: user_wallet,
                user_coinLog: user_coinLog,
                user_walletLog: user_walletLog,
                google_id: null,
                user_country: user_country,
                user_countryCode: user_countryCode,
                is_Active: false
            });
            user.save()
                .then(result => {
                    if (result) {
                        console.log("Data Inserted");
                        res.redirect('/add-user');
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getUserEdit = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/user-list');
    }
    const uId = req.params.inputUserId;
    User.findById(uId)
        .then(users => {
            if (!users) {
                return res.redirect('/user-list');
            }
            res.render('adduser', {
                users: users,
                pageTitle: 'Edit User',
                editing: editMode,
            });
        })
        .catch(err => { console.log(err); });
}

exports.postUserEdit = (req, res, next) => {
    const user_id = req.body.inputUserId;
    const user_name = req.body.inputName;
    const user_emailId = req.body.inputEmail;
    const user_gender = req.body.inputGender;
    const user_genderPreference = req.body.inputGenderPreference;
    const user_isAuthorised = req.body.inputStatus;
    const user_type = req.body.inputType;
    const user_about = req.body.inputAbout;
    const user_image = req.file;
    const user_age = req.body.inputAge;

    User.findById(user_id).then(user => {
        user.user_name = user_name;
        user.user_emailId = user_emailId;
        user.user_gender = user_gender;
        user.user_genderPreference = user_genderPreference;
        user.user_isAuthorised = user_isAuthorised;
        user.user_type = user_type;
        user.user_about = user_about;
        if (user_image) {
            fileHelper.deleteFile(user.user_image);
            user.user_image = user_image.path;
        }
        user.user_age = user_age;
        return user.save();
    })
        .then(result => {
            console.log('Updated Product');
            res.redirect('/user-list');
        })
        .catch(err => console.log(err));
}

//Block User Permanently
exports.blockUser = (req, res, next) => {
    const uId = req.params.inputUserId;
    User.findOne({ _id: uId })
        .then(result => {
            if (result) {
                result.user_isBlock = true;
                result.save()
                    .then(s => {
                        res.redirect('/user-list')
                    })
            }
        })
        .catch(err => { console.log(err) });
}

exports.authoriseUser = (req, res, next) => {
    console.log("called");
    const uId = req.params.inputUserId;
    User.findOne({ _id: uId })
        .then(result => {
            if (result) {
                result.user_isAuthorised = true;
                result.save()
                    .then(s => {
                        res.redirect('/user-list')
                    })
            }
        })
        .catch(err => { console.log(err) });
}

//Unblock User
exports.unblockUser = (req, res, next) => {
    const uId = req.params.inputUserId;
    User.findOne({ _id: uId })
        .then(result => {
            if (result) {
                result.user_isBlock = false;
                result.save()
                    .then(s => {
                        res.redirect('/user-list')
                    })
            }
        })
        .catch(err => { console.log(err) });
}

exports.unauthoriseUser = (req, res, next) => {
    const uId = req.params.inputUserId;
    User.findOne({ _id: uId })
        .then(result => {
            if (result) {
                result.user_isAuthorised = false;
                result.save()
                    .then(s => {
                        res.redirect('/user-list')
                    })
            }
        })
        .catch(err => { console.log(err) });
}

function isEmptyObject(obj) {
    return !Object.keys(obj).length;
}

exports.getUser = (req, res, next) => {
    const uId = req.params.inputUserId.toString();
    //console.log(uId);
    User.findById(uId)
        .then(user => {
            //console.log('Get User Called');
            const data = user.user_favrateLog.items;
            const bdata = user.user_blockLog.items;
            const f = isEmptyObject(data);
            const b = isEmptyObject(bdata);
            //console.log(bdata);
            if (f && b) {
                //console.log("hello");
                res.render('userdetail', {
                    pageTitle: 'User Detail',
                    user: user,
                    fdata: null,
                    bdata: null
                });
            } else if (f === false && b === true) {
                //console.log("hello");
                var x = 0;
                var y = 0;
                let arr = [];
                for (let n of data) {
                    x++;
                }
                for (let n of data) {
                    //console.log(n.favouriteUserId);
                    User.findOne({ _id: n.favouriteUserId })
                        .then(s => {
                            y++;
                            arr.push({
                                userId: n.favouriteUserId,
                                userName: s.user_name,
                                userImage: s.user_image,
                            });
                            if (y >= x) {
                                //console.log(arr);
                                res.render('userdetail', {
                                    pageTitle: 'User Detail',
                                    user: user,
                                    fdata: arr,
                                    bdata: null
                                });
                            }
                        })
                        .catch(err => { console.log(err); });
                }
            } else if (f == true && b == false) {
                var x = 0;
                var y = 0;
                let arr = [];
                for (let n of bdata) {
                    x++;
                }
                for (let n of bdata) {
                    //console.log(n.favouriteUserId);
                    User.findOne({ _id: n.blockUserId })
                        .then(s => {
                            y++;
                            console.log(s);
                            arr.push({
                                userId: n.blockUserId,
                                userName: s.user_name,
                                userImage: s.user_image,
                            });
                            if (y >= x) {
                                //console.log(arr);
                                res.render('userdetail', {
                                    pageTitle: 'User Detail',
                                    user: user,
                                    fdata: null,
                                    bdata: arr
                                });
                            }
                        })
                        .catch(err => { console.log(err); });
                }
            } else {
                var x = 0;
                var y = 0;
                let arr = [];
                for (let n of data) {
                    x++;
                }
                for (let n of data) {
                    //console.log(n.favouriteUserId);
                    User.findOne({ _id: n.favouriteUserId })
                        .then(s => {
                            y++;
                            arr.push({
                                userId: n.favouriteUserId,
                                userName: s.user_name,
                                userImage: s.user_image,
                            });
                            if (y >= x) {
                                //console.log(arr);
                                var a = 0;
                                var c = 0;
                                let arrr = [];
                                for (let n of bdata) {
                                    a++;
                                }
                                for (let n of bdata) {
                                    //console.log(n.favouriteUserId);
                                    User.findOne({ _id: n.blockUserId })
                                        .then(s => {
                                            c++;
                                            arrr.push({
                                                userId: n.blockUserId,
                                                userName: s.user_name,
                                                userImage: s.user_image,
                                            });
                                            if (c >= a) {
                                                //console.log(arr);
                                                res.render('userdetail', {
                                                    pageTitle: 'User Detail',
                                                    user: user,
                                                    fdata: arr,
                                                    bdata: arrr
                                                });
                                            }
                                        })
                                        .catch(err => { console.log(err); });
                                }
                                // res.render('userdetail', {
                                //     pageTitle: 'User Detail',
                                //     user: user,
                                //     fdata: arr,
                                //     bdata: null
                                // });
                            }
                        })
                        .catch(err => { console.log(err); });
                }
            }
        })
        .catch(err => console.log(err));
}

exports.getUserDelete = (req, res, next) => {
    const uId = req.params.inputUserId;
    User.findById(uId).then(u => {
        if (!u) {
            return next(new Error('User Not Found'));
        }
        fileHelper.deleteFile(u.user_image);
        return User.findByIdAndDelete(uId);
    })
}

// API's Controller dsdfsdfdsfsvfsdrvwewrdfvesersvdffveffvwewerwerewrewcfvcwefwvrw jsdfnbk jsfhkjsfjkid fjh sfuhd efnjsdfi hburhfksdkjfsdfh iudfhsfk jefuh sdfjk ndsfeuhsfui wdsnfkjsdfsdfhi euhfsfc jijhseu rushdfjns


//User profile

exports.postAPIsLoginCheck = (req, res, next) => {
    const uId = req.body.inputEmailId;
    User.findOne({ user_emailId: uId })
        .then(result => {
            if (result) {
                let data = {
                    user_isBlock: result.user_isBlock,
                    user_id: result._id,
                    user_name: result.user_name,
                    user_emailId: result.user_emailId,
                    user_image: result.user_image,
                    user_country: result.user_country,
                    user_countryCode: result.user_countryCode,
                    user_about: result.user_about,
                    user_age: result.user_age,
                    user_profession: result.user_profession,
                    user_gender: result.user_gender,
                    user_genderPreference: result.user_genderPreference,
                    user_coin: result.user_coin,
                    user_wallet: result.user_wallet,
                    google_id: result.google_id
                };
                // const token = jwt.sign({
                //     userId: data.user_id,
                //     user_emailId: data.user_emailId
                // }, 'karonsupersecret');
                res.status(201).json({
                    status: true,
                    data: data
                })
            } else {
                res.status(201).json({
                    status: false
                })
            }
        })
}

exports.postAPIsUserProfile = (req, res, next) => {
    const uId = req.body.inputUserId;
    User.findOne({ _id: uId }).select('user_name').select('user_about').select('user_image').select('user_gender').select('user_profession').select('user_age').select('user_country').select('user_countryCode').select('user_genderPreference')
        .then(result => {
            if (result) {
                res.status(201).json({
                    data: result
                })
            } else {
                res.status(200).json({
                    data: "False"
                })
            }

        })
        .catch(err => {
            res.status(201).json({
                data: "False"
            })
            console.log(err);
        })
}

// login & signiup
exports.postAPIsUserAdd = (req, res, next) => { //user login
    const inputCountryId = req.body.inputCountryName;
    const inputUserName = req.body.inputUserName;
    const inputUserAbout = req.body.inputUserAbout;
    const inputUserAge = req.body.inputUserAge;
    const inputUserEmailId = req.body.inputUserEmailId;
    const inputUserProfession = req.body.inputJob;
    const inputUserGender = req.body.inputUserGender;
    const inputUserImage = req.body.base64Image;
    const inputUserGenderPreference = req.body.inputUserGenderPreference;
    const googleId = req.body.inputGoogleId;
    console.log(googleId);
    country.findOne({ _id: inputCountryId })
        .then(con => {
            if (con) {
                //console.log(con);
                const inputCountryName = con.countryName;
                const inputCountryCode = con.countryCode;
                if (inputUserImage) {
                    let im = inputUserImage;
                    let sm = "data:image/jpeg;base64," + im;
                    let matches = sm.match(/^data:([A-Za-z+\/]+);base64,(.+)$/);
                    response = {}
                    if (matches.length !== 3) {
                        return res.status(201).json({
                            status: false,
                            message: "Image Not Uploaded"
                        })
                    }
                    response.type = matches[1];
                    response.data = new Buffer(matches[2], 'base64');
                    let decodeImg = response;
                    let imageBuffer = decodeImg.data;
                    let type = decodeImg.type;
                    let extension = mime.extension(type);
                    let filename = Math.floor(100000 + Math.random() * 900000) + "image." + extension;
                    let finalname = "images/" + filename;
                    console.log(finalname);
                    fs.writeFileSync("./images/" + filename, imageBuffer, 'utf8');
                    settings.findOne({ _id: "5fbcc934e311361f6063a84d" })
                        .then(result => {
                            const now = new Date();
                            const user_coinLog = {
                                items: [{
                                    transactionId: Math.floor(100000 + Math.random() * 900000),
                                    coinAmount: result.bonus_coin,
                                    remark: 'Bonus Coins For Registration',
                                    date: date.format(now, 'DD/MM/YYYY'),
                                    time: date.format(now, 'hh:mm A'),
                                }]
                            };
                            const user_walletLog = {
                                items: [{
                                    transactionId: Math.floor(100000 + Math.random() * 900000),
                                    walletAmount: result.bonus_amount,
                                    remark: 'Bonus Amount For Registration',
                                    date: date.format(now, 'DD/MM/YYYY'),
                                    time: date.format(now, 'hh:mm A'),
                                }]
                            };
                            const user_coin = result.bonus_coin;
                            const user_wallet = result.bonus_amount;
                            const user_name = inputUserName;
                            const user_emailId = inputUserEmailId;
                            const user_gender = inputUserGender;
                            const user_genderPreference = inputUserGenderPreference;
                            const user_profession = inputUserProfession;
                            const user_isAuthorised = null;
                            const user_image = finalname;
                            const user_type = null;
                            const user_about = inputUserAbout;
                            const user_country = inputCountryName;
                            const user_age = inputUserAge;
                            const user_countryCode = inputCountryCode;
                            const google_id = googleId;
                            const user = new User({
                                user_name: user_name,
                                user_about: user_about,
                                user_age: user_age,
                                user_emailId: user_emailId,
                                user_profession: user_profession,
                                user_gender: user_gender,
                                user_image: user_image,
                                user_country: user_country,
                                user_countryCode: user_countryCode,
                                user_genderPreference: user_genderPreference,
                                user_isAuthorised: user_isAuthorised,
                                user_type: user_type,
                                user_coin: user_coin,
                                user_wallet: user_wallet,
                                user_coinLog: user_coinLog,
                                user_walletLog: user_walletLog,
                                is_Active: false,
                                google_id: google_id
                            });

                            user.save()
                                .then(result => {
                                    if (result) {
                                        console.log("User Created");
                                        let data = {
                                            user_isBlock: result.user_isBlock,
                                            user_id: result._id.toString(),
                                            user_name: result.user_name,
                                            user_emailId: result.user_emailId,
                                            user_image: result.user_image,
                                            user_country: result.user_country,
                                            user_about: result.user_about,
                                            user_age: result.user_age,
                                            user_profession: result.user_profession,
                                            user_gender: result.user_gender,
                                            user_genderPreference: result.user_genderPreference,
                                            user_coin: result.user_coin,
                                            user_wallet: result.user_wallet,
                                            google_id: result.google_id
                                        };
                                        // const token = jwt.sign({
                                        //     userId: data.user_id,
                                        //     user_emailId: data.user_emailId
                                        // }, 'karonsupersecret');
                                        //console.log(data);
                                        res.json({
                                            status: true,
                                            data: data
                                        })
                                    } else {
                                        res.json({
                                            status: false
                                        })
                                    }
                                })
                                .catch(err => {
                                    console.log(err);
                                });
                        })
                        .catch(err => {
                            console.log(err);
                        });
                } else {
                    settings.findOne({ _id: "5fbcc934e311361f6063a84d" })
                        .then(result => {
                            const now = new Date();
                            const user_coinLog = {
                                items: [{
                                    transactionId: Math.floor(100000 + Math.random() * 900000),
                                    coinAmount: result.bonus_coin,
                                    remark: 'Bonus Coins For Registration',
                                    date: date.format(now, 'DD/MM/YYYY'),
                                    time: date.format(now, 'hh:mm A'),
                                }]
                            };
                            const user_walletLog = {
                                items: [{
                                    transactionId: Math.floor(100000 + Math.random() * 900000),
                                    walletAmount: result.bonus_amount,
                                    remark: 'Bonus Amount For Registration',
                                    date: date.format(now, 'DD/MM/YYYY'),
                                    time: date.format(now, 'hh:mm A'),
                                }]
                            };
                            const user_coin = result.bonus_coin;
                            const user_wallet = result.bonus_amount;
                            const user_name = inputUserName;
                            const user_emailId = inputUserEmailId;
                            const user_gender = inputUserGender;
                            const user_genderPreference = inputUserGenderPreference;
                            const user_profession = inputUserProfession;
                            const user_isAuthorised = null;
                            const user_image = null;
                            const user_type = null;
                            const user_about = inputUserAbout;
                            const user_country = inputCountryName;
                            const user_age = inputUserAge;
                            const user_countryCode = inputCountryCode;
                            const google_id = googleId;
                            const user = new User({
                                user_name: user_name,
                                user_about: user_about,
                                user_age: user_age,
                                user_emailId: user_emailId,
                                user_profession: user_profession,
                                user_gender: user_gender,
                                user_image: user_image,
                                user_country: user_country,
                                user_countryCode: user_countryCode,
                                user_genderPreference: user_genderPreference,
                                user_isAuthorised: user_isAuthorised,
                                user_type: user_type,
                                user_coin: user_coin,
                                user_wallet: user_wallet,
                                user_coinLog: user_coinLog,
                                user_walletLog: user_walletLog,
                                is_Active: false,
                                google_id: google_id
                            });
                            //console.log(user);
                            user.save()
                                .then(result => {
                                    if (result) {
                                        console.log("User Created");
                                        let data = {
                                            user_isBlock: result.user_isBlock,
                                            user_id: result._id,
                                            user_name: result.user_name,
                                            user_emailId: result.user_emailId,
                                            user_image: result.user_image,
                                            user_country: result.user_country,
                                            user_about: result.user_about,
                                            user_age: result.user_age,
                                            user_profession: result.user_profession,
                                            user_gender: result.user_gender,
                                            user_genderPreference: result.user_genderPreference,
                                            user_coin: result.user_coin,
                                            user_wallet: result.user_wallet,
                                            google_id: result.google_id
                                        };
                                        // const token = jwt.sign({
                                        //     userId: data.user_id,
                                        //     user_emailId: data.user_emailId
                                        // }, 'karonsupersecret');
                                        res.json({
                                            status: true,
                                            data: data
                                        })
                                    } else {
                                        res.json({
                                            status: false
                                        })
                                    }
                                })
                                .catch(err => {
                                    console.log(err);
                                });
                        })
                        .catch(err => {
                            console.log(err);
                        });
                }
            }
        })
}

//Edit Profile
exports.postAPIsUserEdit = (req, res, next) => { //user update
    const uId = req.body.inputUserId;
    const name = req.body.inputUserName;
    const job = req.body.inputJob;
    const about = req.body.inputAbout;
    const age = req.body.inputAge;
    const gender = req.body.inputGender;
    const genderPreference = req.body.inputGenderPreference;
    const Country = req.body.inputCountry;
    country.findOne({ countryName: Country })
        .then(con => {
            if (con) {
                const contryName = con.countryName;
                const contryCode = con.countryCode;
                User.findOne({ _id: uId })
                    .then(result => {
                        result.user_about = about;
                        result.user_name = name;
                        result.user_profession = job;
                        result.user_age = age;
                        result.user_gender = gender;
                        result.user_country = contryName;
                        result.user_countryCode = contryCode;
                        result.user_genderPreference = genderPreference;
                        result.save(data => {
                            let x = {
                                user_isBlock: result.user_isBlock,
                                user_id: result._id,
                                user_name: result.user_name,
                                user_emailId: result.user_emailId,
                                user_image: result.user_image,
                                user_country: result.user_country,
                                user_countryCode: result.user_countryCode,
                                user_about: result.user_about,
                                user_age: result.user_age,
                                user_profession: result.user_profession,
                                user_gender: result.user_gender,
                                user_genderPreference: result.user_genderPreference,
                                user_coin: result.user_coin,
                                user_wallet: result.user_wallet,
                                google_id: result.google_id
                            };
                            res.status(201).json({
                                message: "User Updated",
                                status: true,
                                data: x
                            })
                        })
                    })
                    .catch(err => { console.log(err) });
            } else {
                res.status(201).json({
                    message: "Country Code Not Found",
                    status: false
                })
            }
        })

}

//Image Upload

exports.postAPIsUserImage = (req, res, next) => {
    try {
        console.log('called');
        const uId = req.body.inputUserId;
        User.findOne({ _id: uId })
            .then(result => {
                if (result.user_image != null) {
                    fileHelper.deleteFile(result.user_image);
                    let im = req.body.base64Image
                    let sm = "data:image/jpeg;base64," + im;
                    let matches = sm.match(/^data:([A-Za-z+\/]+);base64,(.+)$/);
                    response = {}
                    if (matches.length !== 3) {
                        return res.status(201).json({
                            message: "Failed ss"
                        })
                    }
                    response.type = matches[1];
                    response.data = new Buffer(matches[2], 'base64');
                    let decodeImg = response;
                    let imageBuffer = decodeImg.data;
                    let type = decodeImg.type;
                    let extension = mime.extension(type);
                    let filename = Math.floor(100000 + Math.random() * 900000) + "image." + extension;
                    let finalname = "images/" + filename;
                    console.log(finalname);
                    fs.writeFileSync("./images/" + filename, imageBuffer, 'utf8');
                    result.user_image = finalname;
                    result.save()
                        .then(d => {
                            res.status(201).json({
                                message: "Sucess",
                                status: true
                            })
                        })
                } else {
                    let im = req.body.base64Image
                    let sm = "data:image/jpeg;base64," + im;
                    let matches = sm.match(/^data:([A-Za-z+\/]+);base64,(.+)$/);
                    response = {}
                    if (matches.length !== 3) {
                        return res.status(201).json({
                            message: "Failed ss"
                        })
                    }
                    response.type = matches[1];
                    response.data = new Buffer(matches[2], 'base64');
                    let decodeImg = response;
                    let imageBuffer = decodeImg.data;
                    let type = decodeImg.type;
                    let extension = mime.extension(type);
                    let filename = Math.floor(100000 + Math.random() * 900000) + "image." + extension;
                    let finalname = "images/" + filename;
                    console.log(finalname);
                    fs.writeFileSync("./images/" + filename, imageBuffer, 'utf8');
                    User.findOne({ _id: uId })
                        .then(re => {
                            re.user_image = finalname;
                            re.save()
                                .then(d => {
                                    res.status(201).json({
                                        message: "Sucess",
                                        status: true
                                    })
                                })
                        })
                }
            })
    } catch (e) {
        return res.status(201).json({
            message: "Failed",
            status: false
        })
    }
}


//Online User List
exports.getAPIsOnlineUserList = (req, res, next) => { //user list
    const uId = req.body.inputUserId;
    User.find({ is_Active: 'true', _id: { $nin: [uId] } }).select('user_name').select('user_image').select('user_country').select('user_countryCode')
        .then(result => {
            res.status(201).json(
                result
            )
        })
        .catch(err => { console.log(err) });
}

//Adding to coin log
exports.postAPIsCoinLog = (req, res, next) => { // Add to Coin Log
    const uId = req.body.inputUserId;
    const transactionId = req.body.inputTransactionId;
    const coinAmount = req.body.inputCoinAmount;
    const remark = req.body.inputRemark;
    const now = new Date();
    User.findOne({ _id: uId })
        .then(result => {
            const arr = result.user_coinLog.items;
            arr.push({
                transactionId: transactionId,
                coinAmount: coinAmount,
                remark: remark,
                date: date.format(now, 'DD/MM/YYYY'),
                time: date.format(now, 'hh:mm A'),
            });
            result.user_coinLog.items = arr;
            result.save()
                .then(dd => {
                    res.status(201).json({
                        message: "Transaction Added",
                        Data: result.user_coinLog.items
                    })
                });
        })
        .catch(err => {
            console.log(err);
        });
}

//Purchase Coin
exports.postPurchaseCoin = (req, res, next) => {
    const uId = req.body.inputUserId;
    const transactionId = "dsjhdfbjhzsdgvbfuydsf";
    const coinAmount = Number(req.body.inputCoinAmount);
    const remark = "Purchased Coin";
    const now = new Date();
    User.findOne({ _id: uId }).select('user_coinLog').select('user_coin')
        .then(result => {
            const arr = result.user_coinLog.items;
            arr.push({
                transactionId: transactionId,
                coinAmount: coinAmount,
                remark: remark,
                date: date.format(now, 'DD/MM/YYYY'),
                time: date.format(now, 'hh:mm A'),
            });
            result.user_coinLog.items = arr;
            result.user_coin = result.user_coin + coinAmount;
            result.save()
                .then(dd => {
                    res.status(201).json({
                        message: "Transaction Added",
                        status: true,
                        Data: result.user_coinLog.items
                    })
                });
        })
}

//Getting coin log
exports.postAPIsGetCoinLog = (req, res, next) => {
    const uId = req.body.inputUserId;
    User.findOne({ _id: uId }).select('user_coinLog')
        .then(result => {
            const data = result.user_coinLog.items;
            res.status(201).json({
                data
            })
        })
}

//Adding Wallet Log
exports.postAPIsWalletLog = (req, res, next) => { // Add to Coin Log
    const uId = req.body.inputUserId;
    const transactionId = req.body.inputTransactionId;
    const walletAmount = req.body.inputWalletAmount;
    const remark = req.body.inputRemark;
    const now = new Date();
    User.findOne({ _id: uId })
        .then(result => {
            const arr = result.user_walletLog.items;
            arr.push({
                transactionId: transactionId,
                walletAmount: walletAmount,
                remark: remark,
                date: date.format(now, 'DD/MM/YYYY'),
                time: date.format(now, 'hh:mm A'),
            });
            result.user_walletLog.items = arr;
            result.save()
                .then(dd => {
                    res.status(201).json({
                        message: "Transaction Added",
                        data: result.user_walletLog.items
                    })
                });
        })
        .catch(err => {
            console.log(err);
        });
}

//Getting Wallet Log
exports.postAPIsGetWalletLog = (req, res, next) => {
    const uId = req.body.inputUserId;
    User.findOne({ _id: uId }).select('user_walletLog')
        .then(result => {
            const data = result.user_walletLog.items;
            res.status(201).json({
                data
            })
        })
        .catch(err => { console.log(err) });
}

//Adding Favourite User
exports.postAPIsFavourite = (req, res, next) => {
    const uid = req.body.inputUserId;
    const fuid = req.body.inputFavouriteUserId;
    let status = false;
    //console.log(funame);
    User.findOne({ _id: uid }).select('user_favrateLog')
        .then(result => {
            for (let n of result.user_favrateLog.items) {
                if (n.favouriteUserId === fuid) {
                    status = true;
                }
            }
            if (status) {
                res.status(201).json({
                    message: "User Already Added"
                })
            } else {
                const arr = result.user_favrateLog.items;
                //console.log(arr)
                arr.push({
                    favouriteUserId: fuid
                });
                result.user_favrateLog.items = arr;
                result.save()
                    .then(s => {
                        if (s) {
                            res.status(201).json({
                                status: "true"
                            })
                        } else {
                            res.status(201).json({
                                status: "false"
                            })
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }


        })
        .catch(err => { console.log(err) });
}

//Removing Favourite User

exports.postAPIsRemoveFavourite = (req, res, next) => {
    const uid = req.body.inputUserId;
    const fuid = req.body.inputFavouriteUserId;
    User.findOne({ _id: uid })
        .then(result => {
            if (result) {
                let data = result.user_favrateLog.items;
                if (isEmptyObject(data)) {
                    result.status(200).json({
                        message: "You don't have any Favourite User",
                        status: "false"
                    })
                } else {
                    let arr = [];
                    for (let n of data) {
                        if (n.favouriteUserId != fuid) {
                            let x = n.favouriteUserId;
                            arr.push({
                                favouriteUserId: x
                            })
                        }
                    }
                    //console.log(arr);
                    result.user_favrateLog.items = arr;
                    result.save()
                        .then(s => {
                            res.status(201).json({
                                message: "User Removed Sucessfuly",
                                status: true
                            })
                        })
                        .catch(err => { console.log(err) });
                }
            } else {
                res.status(200).json({
                    message: "User Not Found",
                    status: false
                })
            }
        })
}

//Adding Block User
exports.postAPIsBlock = (req, res, next) => {
    const uid = req.body.inputUserId.toString();
    const fuid = req.body.inputBlockUserId;
    const remark = req.body.inputRemark;
    let status = false;
    //console.log(funame);
    User.findOne({ _id: uid }).select('user_blockLog').select('user_favrateLog').select('user_name').select('user_image')
        .then(result => {
            for (let n of result.user_blockLog.items) {
                if (n.blockUserId === fuid) {
                    status = "true";
                }
            }
            if (status) {
                res.status(201).json({
                    status: "false"
                })
            } else {
                const arr = result.user_blockLog.items;
                let data = result.user_favrateLog.items;
                //console.log(data);
                let arrr = [];
                for (let n of data) {
                    if (n.favouriteUserId != fuid) {
                        let x = n.favouriteUserId;
                        arrr.push({
                            favouriteUserId: x
                        })
                    }
                }
                //console.log(arr)
                arr.push({
                    blockUserId: fuid,
                    remark: remark
                });
                result.user_favrateLog.items = arrr;
                result.user_blockLog.items = arr;
                block.findOne({ userId: fuid })
                    .then(bbdata => {
                        if (bbdata) {
                            bbdata.totalBlock = bbdata.totalBlock + 1;
                            let n = result.user_name;
                            let i = result.user_image;
                            //console.log(n);
                            bbdata.blockedBy.users.push({
                                id: uid,
                                name: n,
                                image: i
                            });
                            if (remark === "Nudity") {
                                bbdata.nudity = bbdata.nudity + 1;
                            } else if (remark === "False Gender") {
                                bbdata.falseGender = bbdata.falseGender + 1;
                            } else {
                                bbdata.harassment = bbdata.harassment + 1;
                            }
                            bbdata.save()
                                .then(data => {
                                    if (data) {
                                        console.log("Block user added");
                                    } else {
                                        console.log("Problem in Block");
                                    }
                                }).catch(err => { console.log(err) });
                        } else {
                            let h = 0;
                            let n = 0;
                            let f = 0;
                            if (remark === "Nudity") {
                                n = 1;
                            } else if (remark === "False Gender") {
                                f = 1;
                            } else {
                                h = 1;
                            }
                            User.findOne({ _id: fuid }).select('user_name').select('user_image')
                                .then(budata => {
                                    //console.log(budata);
                                    let s = result.user_name;
                                    let i = result.user_image;
                                    let j = budata.user_name;
                                    let k = budata.user_image;
                                    const Block = new block({
                                        userId: fuid,
                                        userName: j,
                                        userImage: k,
                                        blockedBy: {
                                            users: [{
                                                id: uid,
                                                name: s,
                                                image: i
                                            }]
                                        },
                                        totalBlock: 1,
                                        harassment: h,
                                        nudity: n,
                                        falseGender: f
                                    })
                                    Block.save()
                                        .then(data => {
                                            if (data) {
                                                console.log("Block user added");
                                            } else {
                                                console.log("Problem in Block");
                                            }
                                        }).catch(err => { console.log(err) });
                                }).catch(err => { console.log(err) });
                        }
                    }).catch(err => { console.log(err) });
                result.save()
                    .then(s => {
                        if (s) {
                            res.status(201).json({
                                status: "true"
                            })
                        } else {
                            res.status(201).json({
                                status: "false"
                            })
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }


        })
        .catch(err => { console.log(err) });
}

//Remove Block User

exports.postAPIsRemoveBlock = async (req, res, next) => {
    const uid = req.body.inputUserId;
    const buid = req.body.inputBlockUserId;
    const bdata = await block.findOne({ userId: buid });
    if (bdata) {
        console.log(bdata);
        if (bdata.totalBlock === 1) {
            let x = bdata._id.toString();
            console.log(x);
            block.findByIdAndDelete(x).then(d => { if (d) { console.log("removed") } }).catch(err => { console.log(err) });
        } else {
            let arr = [];
            for (let n of bdata.blockedBy.users) {
                if (n.id != uid) {
                    let x = n.id;
                    arr.push({
                        id: x
                    })
                }
            }
            bdata.blockedBy.users = arr;
            bdata.totalBlock = bdata.totalBlock - 1;
            bdata.save()
        }
    }
    User.findOne({ _id: uid })
        .then(result => {
            if (result) {
                data = result.user_blockLog.items
                if (isEmptyObject(data)) {
                    result.status(200).json({
                        message: "You don't have any Blocked User",
                        status: false
                    })
                } else {
                    let arr = [];
                    for (let n of data) {
                        if (n.blockUserId != buid) {
                            let x = n.blockUserId;
                            arr.push({
                                blockUserId: x
                            })
                        }
                    }
                    //console.log(arr);
                    result.user_blockLog.items = arr;
                    //const bdata = await block.findOne({userId:buid});
                    result.save()
                        .then(s => {
                            res.status(201).json({
                                message: "User Removed Sucessfuly",
                                status: true
                            })
                        })
                        .catch(err => { console.log(err) });
                }
            } else {
                res.status(200).json({
                    message: "User Not Found",
                    status: false
                })
            }
        })
}

//Getting Fevourite User

exports.postAPIsGetFavourite = async (req, res, next) => {
    const uId = req.body.inputUserId;
    var arr = [];
    User.findOne({ _id: uId }).select('user_favrateLog')
        .then(result => {
            //console.log(result)
            if (result) {
                var x = 0;
                var y = 0;
                const data = result.user_favrateLog.items;
                if (isEmptyObject(data)) {
                    res.status(201).json({
                        data: "Favourite User Is Empty",
                        status: false
                    })
                } else {
                    for (let n of data) {
                        x++;
                    }
                    for (let n of data) {
                        //console.log(n.favouriteUserId);
                        User.findOne({ _id: n.favouriteUserId })
                            .then(s => {
                                y++;
                                arr.push({
                                    userId: n.favouriteUserId,
                                    user_name: s.user_name,
                                    user_image: s.user_image,
                                    user_country: s.user_country,
                                    user_countryCode: s.user_countryCode
                                });
                                if (y >= x) {
                                    res.status(201).json({
                                        data: arr,
                                        status: true
                                    })
                                }
                            })
                            .catch(err => { console.log(err); });
                    }
                }
            } else {
                res.status(201).json({
                    data: "User Not Found",
                    status: false
                })
            }
        })
        .catch(err => { console.log(err) });
}


//Getting Block User
exports.postAPIsGetBlock = async (req, res, next) => {
    const uId = req.body.inputUserId;
    var arr = [];
    User.findOne({ _id: uId }).select('user_blockLog')
        .then(result => {
            var x = 0;
            var y = 0;
            const data = result.user_blockLog.items;
            if (isEmptyObject(data)) {
                res.status(201).json({
                    data: "Block User Is Empty",
                    status: false
                })
            }
            for (let n of data) {
                x++;
            }
            for (let n of data) {
                //console.log(n.favouriteUserId);
                User.findOne({ _id: n.blockUserId })//@cew.motomanic
                    .then(s => {
                        y++;
                        arr.push({
                            userId: n.blockUserId,
                            user_name: s.user_name,
                            user_image: s.user_image,
                            user_country: s.user_country,
                            user_countryCode: s.user_countryCode
                        });
                        if (y >= x) {
                            res.status(201).json({
                                data: arr
                            })
                        }
                    })
                    .catch(err => { console.log(err); });
            }
        })
        .catch(err => { console.log(err) });

}

// Online Status Update
exports.postAPIUpdateStatusOnline = (req, res, next) => {
    const uId = req.body.inputUserId;
    if (uId) {
        //console.log(uId);
        User.findOne({ _id: uId })
            .then(result => {
                result.is_Active = true;
                result.save()
                    .then(
                        res.status(201).json({
                            status: true
                        })
                    )
            })
            .catch(err => {
                console.log(err);
            })
    } else {
        res.status(201).json({
            status: false
        })
    }
}

//Ofilne Status Update
exports.postAPIUpdateStatusOfline = (req, res, next) => {
    const uId = req.body.inputUserId;
    if (uId) {
        //console.log(uId);
        User.findOne({ _id: uId })
            .then(result => {
                result.is_Active = false;
                result.save()
                    .then(
                        res.status(201).json({
                            status: true
                        })
                    )
            })
            .catch(err => {
                console.log(err);
            })
    } else {
        res.status(201).json({
            status: false
        })
    }
}
exports.postAPIsGenderPreference = (req, res, next) => {
    const uId = req.body.inputUserId;
    User.findOne({ _id: uId })
        .then(result => {
            if (result) {
                let data = {
                    user_genderPreference: result.user_genderPreference,
                    user_coin: result.user_coin
                };
                res.status(201).json({
                    status: true,
                    data: data
                })
            } else {
                res.status(200).json({
                    status: false
                })
            }
        })
}

exports.postAPIsRandomUser = (req, res, next) => {
    const gender = req.body.inputGender;
    const uid = req.body.inputUserId;
    //const n = User.find({user_genderPreference:gender, is_active:true}).count();
    User.findOne({ _id: uid })
        .then(d => {
            if (d) {
                d.user_genderPreference = gender;
                d.save(s => {
                    res.status(201).json({
                        status: true
                    })
                })
            } else {
                res.status(201).json({
                    status: false
                })
            }
        })

}
// const n = User.count({ user_genderPreference: gender, is_Active: true })
//                         .then(result => {
//                             console.log(result);
//                             const r = Math.floor(Math.random() * result);
//                             console.log(r);
//                             User.find({ user_genderPreference: gender, is_Active: true }).select('user_name').select('user_emailId').select('user_gender')
//                                 .then(data => {
//                                     if (data) {
//                                         console.log(data[r]);
//                                         res.status(201).json({
//                                             status: true,
//                                             data: data[r]
//                                         })
//                                     } else {
//                                         res.status(201).json({
//                                             status: false
//                                         })
//                                     }
//                                 })
//                                 .catch(err => { console.log(err) });
//                         })
//                         .catch(err => {
//                             console.log(err);
//                         });