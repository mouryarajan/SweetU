const express = require("express");
const router = express.Router();

const blockController = require('../controllers/c-block');

router.get('/get-block-user', blockController.getBlockUser);

router.get('/get-blocked-by/:inputUserId', blockController.getBlockedBy);

module.exports = router;