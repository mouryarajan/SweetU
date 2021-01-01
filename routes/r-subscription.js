const path = require("path");
const express = require("express");
const router = express.Router();
const subController = require('../controllers/c-subscription');

router.get('/subscription', subController.getSubscription);
router.post('/add-subscription', subController.postSubscription);
router.get('/subscription-log', subController.getSubscriptionLog);
router.post('/subscription-filter', subController.postSubscriptionFilter);

//API
router.get('/api/subscription', subController.getAPIsSubscription);
router.post('/api/add-subscription-log', subController.postAPIsSubscriptionLog);

module.exports = router;