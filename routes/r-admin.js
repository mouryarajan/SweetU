const path = require("path");
const express = require("express");
const isAdmin = require('../middleware/is-admin');

const dashboardController = require('../controllers/c-dashboard');

const router = express.Router();

router.get('/dashboard',isAdmin,dashboardController.getDashBoard);

router.post('/add-editor', dashboardController.postEditor);
router.get('/editor',dashboardController.getEditor);

//API
router.get('/api/policies', dashboardController.getPivacyAndPolicyAPI);

module.exports = router;