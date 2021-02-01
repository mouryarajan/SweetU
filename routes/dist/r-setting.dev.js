"use strict";

var express = require('express');

var settings = require('../controllers/c-setting');

var router = express.Router();

var isAdmin = require('../middleware/is-admin');

router.get('/settings', isAdmin, settings.getSetting);
router.post('/settings', isAdmin, settings.postSetting);
module.exports = router;