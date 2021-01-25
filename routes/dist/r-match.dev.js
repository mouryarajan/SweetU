"use strict";

var express = require('express');

var router = express.Router();

var matchController = require('../controllers/c-match');

router.post('/api/add-connection', matchController.postMatch);
router.post('/api/add-duration', matchController.postActive);
router.post('/api/check-call-rate', matchController.checkCoinVideoCall);
router.post('/api/chat-details', matchController.chatUserDetails);
module.exports = router;