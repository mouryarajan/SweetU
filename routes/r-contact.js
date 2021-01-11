const express = require('express');
const router = express.Router();
const contactController = require('../controllers/c-contact');

router.post('/api/add-contact-us', contactController.postChat);
router.post('/api/get-contact-us', contactController.getApiChat);
router.get('/get-problem', contactController.getChat);

module.exports = router;