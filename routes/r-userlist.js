const path = require("path");
const express = require("express");
const isAdmin = require('../middleware/is-admin');
const verify = require('../middleware/verify-token');
const userController = require('../controllers/c-user');

const router = express.Router();

router.get('/user-list', isAdmin, userController.getUserList);

router.get('/authorised-user-list', isAdmin, userController.getAuthorisedUserList);

router.get('/user-detail/:inputUserId',isAdmin,userController.getUser);

router.get('/add-user', isAdmin,userController.getAddUser);

router.get('/user-edit/:inputUserId', isAdmin,userController.getUserEdit);

router.get('/user-block/:inputUserId', isAdmin, userController.blockUser);

router.get('/user-authorise/:inputUserId', isAdmin, userController.authoriseUser);

router.get('/user-unblock/:inputUserId', isAdmin, userController.unblockUser);

router.get('/user-unauthorise/:inputUserId', isAdmin, userController.unauthoriseUser);

router.delete('/user-delete/:inputUserId', isAdmin, userController.getUserDelete);

router.post('/add-user', isAdmin,userController.postAddUser);

router.post('/user-edit', isAdmin,userController.postUserEdit);

router.post('/filter-user', isAdmin, userController.postFilterUser);

// API's Route's

router.post('/api/add-user', userController.postAPIsUserAdd);
router.post('/api/login-check', userController.postAPIsLoginCheck);
router.post('/api/user-profile',verify,userController.postAPIsUserProfile);
router.post('/api/user-edit',verify, userController.postAPIsUserEdit);
router.post('/api/user-image',verify, userController.postAPIsUserImage);
router.post('/api/user-list', verify,userController.getAPIsOnlineUserList);

// router.post('/api/coin',userController.postAPIsCoin);

router.post('/api/add-favourite',verify,userController.postAPIsFavourite);
router.post('/api/get-favourite',verify,userController.postAPIsGetFavourite);
router.post('/api/remove-favourite',verify,userController.postAPIsRemoveFavourite);
router.post('/api/add-block',verify,userController.postAPIsBlock);
router.post('/api/get-block',verify,userController.postAPIsGetBlock);
router.post('/api/remove-block',verify,userController.postAPIsRemoveBlock);

router.post('/api/gender-preference',verify,userController.postAPIsGenderPreference);
router.post('/api/change-genderpreference',verify,userController.postAPIsRandomUser);

router.post('/api/update-status-online', verify,userController.postAPIUpdateStatusOnline);
router.post('/api/update-status-ofline', verify,userController.postAPIUpdateStatusOfline);
module.exports = router;