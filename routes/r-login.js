const express = require("express");

const loginController = require('../controllers/c-login');

const router = express.Router();

router.get('/',loginController.getLoginPage);
router.post('/user-login',loginController.postLoginUser);
router.get('/user-logout',loginController.postLogoutUser);
router.get('/user-forget-password', loginController.getForgetPassword);
router.post('/user-forget-password', loginController.postForgetPassword);
router.get('/confirm-password/:token',loginController.getConfirmPassword);
router.post('/confirm-password',loginController.postConfirmPassword);
module.exports = router;