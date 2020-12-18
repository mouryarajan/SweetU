const path = require("path");
const express = require("express");
const isAdmin = require('../middleware/is-admin');

const dashboardController = require('../controllers/c-dashboard');

const router = express.Router();

router.get('/dashboard',isAdmin,dashboardController.getDashBoard);

module.exports = router;