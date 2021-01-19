const path = require("path");
const express = require("express");
const isAdmin = require('../middleware/is-admin');

const dashboardController = require('../controllers/c-dashboard');

const router = express.Router();

router.get('/dashboard',isAdmin,dashboardController.getDashBoard);

router.post('/add-editor', dashboardController.postEditor);
router.get('/editor',dashboardController.getEditor);
router.get('/comunity',dashboardController.getCommunityGuideLine);
router.post('/add-comunity', dashboardController.postCommunityGuideLine);
router.get('/terms',dashboardController.getTermsOfUse);
router.post('/add-terms', dashboardController.postTermsOfUse);

//API
router.get('/api/policies', dashboardController.getPivacyAndPolicyAPI);
router.get('/api/community', dashboardController.getCommunityGuideLineAPI);
router.get('/api/terms', dashboardController.getTermsOfUserAPI);

module.exports = router;