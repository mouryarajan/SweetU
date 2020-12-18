const { render } = require('ejs');
const country = require('../models/m-country');

exports.getCountry = (req, res, next) =>{
    country.find()
    .then(result=>{
        res.render('country',{
            pageTitle:"Country",
            data: result
        })
    })
}

exports.postCountry = (req, res, next) =>{
    const countryName = req.body.inputCountryName;
    const countryCode = req.body.inputCountryCode;
    const Country = new country({
        countryName: countryName,
        countryCode: countryCode
    })
    Country.save()
    .then(result=>{
        if(result){
            res.redirect('/country');
        }
    })
}

exports.deleteCountry = (req, res, next) => {
    const uId = req.params.inputCountryId;
    country.findByIdAndDelete(uId)
    .then(() => {
        console.log('Country is Destroyed');
    }).catch(err => { console.log(err); })
}

//API

exports.getAPIsCountry = (req, res, next) =>{
    country.find()
    .then(result=>{
        res.status(201).json({
            data:result
        })
    })
    .catch(err=>{console.log(err)});
}