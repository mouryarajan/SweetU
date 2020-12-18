const express = require('express');
const router = express.Router();
const addController = require('../controllers/c-add');

router.get("/get-add",addController.getAdd);
router.post("/post-add",addController.postAdd);

module.exports = router;