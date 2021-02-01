"use strict";

var path = require("path");

var express = require("express");

var router = express.Router();

var subController = require('../controllers/c-subscription');

router.get('/subscription', subController.getSubscription);
router.post('/add-subscription', subController.postSubscription);
router.get('/subscription-log', subController.getSubscriptionLog);
router.post('/subscription-filter', subController.postSubscriptionFilter);
router.get('/get-coinlog', subController.getCoinLog);
router.post('/filter-coin-log', subController.postFilterCoinLog); //API

router.get('/api/subscription', subController.getAPIsSubscription);
router.post('/api/add-subscription-log', subController.postAPIsSubscriptionLog);
module.exports = router;