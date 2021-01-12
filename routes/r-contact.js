const express = require('express');
const router = express.Router();
const contactController = require('../controllers/c-contact');

router.post('/api/add-contact-us', contactController.postChat);
router.post('/api/get-contact-us', contactController.getApiChat);
router.get('/get-problem', contactController.getChat);
router.get('/get-chat-details/:inputUserId', contactController.getChatDetails);

router.post('/post-admin-chat', contactController.postAdminChat);

module.exports = router;