const express = require('express');
const settings = require('../controllers/c-setting');
const router = express.Router();
const isAdmin = require('../middleware/is-admin');

router.get('/settings', isAdmin, settings.getSetting);
router.post('/settings', isAdmin, settings.postSetting);
router.get('/editor',settings.getEditor);

module.exports = router;