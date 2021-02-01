const express = require("express");
const router = express.Router();
const userCoinController = require('../controllers/c-userCoin');

router.post('/api/get-coin-log', userCoinController.getCoinLog);

module.exports = router;