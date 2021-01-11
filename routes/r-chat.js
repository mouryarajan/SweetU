const express = require("express");
const router = express.Router();

const chatController = require('../controllers/c-chat');

router.post('/api/add-chat', chatController.postChat);
router.post('/api/get-chat', chatController.getChat);

module.exports = router;