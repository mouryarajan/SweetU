const sticker = require('../models/m-sticker.js');
const fileHelper = require('../util/file');


exports.getSticker = (req, res, next) => {
    sticker.find()
        .then(result => {
            if (result) {
                res.render('sticker', {
                    pageTitle: "Sticker",
                    data: result
                })
            }
        })

}

exports.postSticker = (req, res, next) => {
    const coin = req.body.inputCoin;
    const user_image = req.file;
    const x = user_image.filename;
    const images = x;
    const Sticker = new sticker({
        sticker: images,
        coin: coin
    });
    Sticker.save()
        .then(result => {
            if (result) {
                res.redirect('/sticker');
            }
        })
}

exports.postDeleteSticker = (req, res, next) => {
    const uId = req.params.inputStickerId;
    sticker.findById(uId).then(u => {
        fileHelper.deleteFile(u.sticker);
        sticker.findByIdAndDelete(uId)
            .then(result => {
                res.redirect('/sticker');
            });
    })
}

exports.getEditSticker = (req, res, next) => {
    const uId = req.params.inputStickerId;
    sticker.findById(uId)
        .then(result => {
            if (result) {
                res.render('stickerEdit', {
                    pageTitle: "Sticker",
                    data: result
                })
            }
        })
}

exports.postEditSticker = (req, res, next) => {
    const uId = req.body.inputStickerId;
    const coin = req.body.inputCoin;
    sticker.findById(uId)
        .then(result => {
            result.coin = coin;
            result.save()
                .then(result => {
                    if (result) {
                        res.redirect('/sticker');
                    }
                })
        });
}

//Api
exports.getApiSticker = (req, res, next) => {
    sticker.find()
        .then(result => {
            if (result) {
                res.json({
                    data: result
                })
            }
        })
}