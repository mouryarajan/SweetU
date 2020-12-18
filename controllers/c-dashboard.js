const userlist = require('../models/m-user.js');

exports.getDashBoard = (req, res, next) => {
    res.render('dashboard',{
        pageTitle:'Dashboard',
    });
}
