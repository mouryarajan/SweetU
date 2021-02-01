"use strict";

var express = require("express");

var router = express.Router();

var userCoinController = require('../controllers/c-userCoin');

router.post('/api/get-coin-log', userCoinController.getCoinLog);
module.exports = router;