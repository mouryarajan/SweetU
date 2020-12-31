const express = require('express');
const router = express.Router();
const PaytmChecksum = require('../PaytmChecksum');
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');

dotenv.config();

router.post('/api/genrate-checksum', (req, res) => {
    const d = req.body;
    if (!d) return res.status(201).json({ status: false, message: "Provide proper details" });
    body = {
        "mid": d.mid,
        "CHANNEL_ID":  d.CHANNEL_ID,
        "INDUSTRY_TYPE_ID": d.INDUSTRY_TYPE_ID,
        "WEBSITE": d.WEBSITE,
        "PAYTM_MERCHANT_KEY": d.PAYTM_MERCHANT_KEY,
        "TXN_AMOUNT": d.TXN_AMOUNT,
        "ORDER_ID": d.ORDER_ID,
        "CUST_ID": d.CUST_ID
    };
    var paytmChecksum = PaytmChecksum.generateSignature(JSON.stringify(req.body), d.PAYTM_MERCHANT_KEY);
    paytmChecksum.then(function(result){
        console.log(result);
        return res.status(200).json({
            CHECKSUMHASH: result,
            CUST_ID: d.CUST_ID,
            ORDER_ID: d.ORDER_ID
        });
    }).catch(function (error) {
        console.log(error);
    });
});

// router.post('/api/receipt', (req, res) => {
//     let responseData = req.body;
//     console.log(called);
//     console.log(responseData);
//     res.status(200).json({
//         responseData
//     })
// });

module.exports = router;