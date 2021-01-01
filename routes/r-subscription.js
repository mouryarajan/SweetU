const path = require("path");
const express = require("express");
const router = express.Router();
const subController = require('../controllers/c-subscription');

router.get('/subscription', subController.getSubscription);

module.exports = router;