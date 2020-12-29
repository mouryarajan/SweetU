const express = require('express');
const sticker = require('../controllers/c-sticker.js');
const router = express.Router();
//const isAdmin = require('../middleware/is-admin');
// const verify = require('../middleware/verify-token');
//isAdmin,
router.get('/sticker',  sticker.getSticker);
router.post('/add-sticker', sticker.postSticker);
router.get('/delete-sticker/:inputStickerId', sticker.postDeleteSticker);
router.get('/edit-sticker/:inputStickerId', sticker.getEditSticker);
router.post('/edit-sticker', sticker.postEditSticker);

router.get('/api/get-sticker', sticker.getApiSticker);

//uncomment bellow code to insert data from post man
// router.post('/post-redeem', redeem.postRedeemData);


module.exports = router;