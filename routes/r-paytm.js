const express = require('express');
const router = express.Router();
const PaytmChecksum = require('../PaytmChecksum');
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');

dotenv.config();

router.post('/api/genrate-checksum', (req, res) => {
    const d = req.body;
    if (!d) return res.status(201).json({ status: false, message: "Provide proper details" });
    let oid = d.inputOrderId;
    // let params = {};
    // params["MID"] = process.env.PAYTM_MID;
    // params["WEBSITE"] = process.env.PAYTM_WEBSITE;
    // params["CHANNEL_ID"] = process.env.PAYTM_CHANNEL_ID;
    // params["INDUSTRY_TYPE_ID"] = process.env.PAYTM_INDUSTRY_TYPE_ID;
    // params["ORDER_ID"] = oid;
    // params["CUST_ID"] = d.inputUserId;
    // params["TXN_AMOUNT"] = d.inputAmount;
    // params["CALLBACK_URL"] = "http://23af8545c754.ngrok.io/api/receipt";
    // params["EMAIL"] = d.inputEmailId;
    // params["MOBILE_NO"] = d.inputMobileNumber;
    // body = { "mid": process.env.PAYTM_MID, "orderId": oid }
    // var paytmCheckSum = PaytmChecksum.generateSignature(params, process.env.PAYTM_MID_KEY);
    //sdsdsd
    var paytmParams = {};

    /* Generate Checksum via Array */

    /* initialize an array */
    paytmParams["MID"] = process.env.PAYTM_MID;
    paytmParams["ORDERID"] = oid;

    var paytmChecksum = PaytmChecksum.generateSignature(paytmParams, process.env.PAYTM_MID_KEY);
    paytmChecksum.then(function (result) {
        console.log("generateSignature Returns: " + result);
        var verifyChecksum = PaytmChecksum.verifySignature(paytmParams, process.env.PAYTM_MID_KEY, result);
        console.log(verifyChecksum);
        return res.status(200).json({
            CHECKSUMHASH: verifyChecksum,
            MID: process.env.PAYTM_MID,
            WEBSITE: process.env.PAYTM_WEBSITE,
            CHANNEL_ID: process.env.PAYTM_CHANNEL_ID,
            INDUSTRY_TYPE_ID: process.env.PAYTM_INDUSTRY_TYPE_ID,
            ORDER_ID: oid,
            CUST_ID: d.inputUserId,
            TXN_AMOUNT: d.inputAmount,
            CALLBACK_URL: "http://8a97184a0825.ngrok.io/api/receipt",
            EMAIL: d.inputEmailId,
            MOBILE_NO: d.inputMobileNumber
        });
        //console.log("verifySignature Returns: " + verifyChecksum);
    }).catch(function (error) {
        console.log(error);
    });

    // paytmCheckSum.then(function (checksum) {
    //     console.log(checksum);
    //     return res.status(200).json({
    //         CHECKSUMHASH: checksum,
    //         MID: process.env.PAYTM_MID,
    //         WEBSITE: process.env.PAYTM_WEBSITE,
    //         CHANNEL_ID: process.env.PAYTM_CHANNEL_ID,
    //         INDUSTRY_TYPE_ID: process.env.PAYTM_INDUSTRY_TYPE_ID,
    //         ORDER_ID: oid,
    //         CUST_ID: d.inputUserId,
    //         TXN_AMOUNT: d.inputAmount,
    //         CALLBACK_URL: "http://23af8545c754.ngrok.io/api/receipt",
    //         EMAIL: d.inputEmailId,
    //         MOBILE_NO: d.inputMobileNumber
    //     });
    // })
});

router.post('/api/receipt', (req, res) => {
    let responseData = req.body;
    console.log(called);
    console.log(responseData);
    res.status(200).json({
        responseData
    })
    // var checksumhash = responseData.CHECKSUMHASH;
    // var isVerifySignature = PaytmChecksum.verifySignature(responseData, process.env.PAYTM_MID_KEY, checksumhash);
    // if (isVerifySignature) {
    //     console.log(isVerifySignature);
    //     return res.send({
    //         status: 0,
    //         data: responseData
    //     })
    // } else {
    //     console.log(isVerifySignature);
    //     return res.send({
    //         status: 1,
    //         data: responseData
    //     })
    // }
});

module.exports = router;