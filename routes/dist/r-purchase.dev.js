"use strict";

var express = require('express');

var router = express.Router();

var purchaseController = require('../controllers/c-purchase');

var verify = require('../middleware/verify-token');

router.get('/purchase', purchaseController.getPurchase);
router.post('/purchase', purchaseController.postPurchase);
router["delete"]('/purchase-delete/:inputUserId', purchaseController.getPurchaseDelete); //api

router.post('/api/purchase', purchaseController.getAPIsPurchase);
module.exports = router;