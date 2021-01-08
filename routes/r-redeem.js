const express = require('express');
const redeem = require('../controllers/c-redeem.js');
const router = express.Router();
const isAdmin = require('../middleware/is-admin');
const verify = require('../middleware/verify-token');

router.get('/redeem', redeem.getRedeem);
router.post('/edit-redeem', redeem.postRedeem);
router.get('/redeem-request', redeem.getRedeemLogAdmin);
router.post('/redeem-filter', redeem.postFilterRedeemLog);
router.get('/redeem-update/:inputRedeemId/:inputStatus', redeem.postRedeemUpdate);


router.get('/api/get-redeem',redeem.getApiRedeem);
router.post('/api/redeem-condition',redeem.postRedeemCondition);
router.post('/api/request-redeem', redeem.postRedeemLog);
router.post('/api/redeem-check', redeem.postMatchCoin);
router.post('/api/get-redeemlog-user', redeem.postGetRedeemLogUser);

//uncomment bellow code to insert data from post man
// router.post('/post-redeem', redeem.postRedeemData);


module.exports = router;