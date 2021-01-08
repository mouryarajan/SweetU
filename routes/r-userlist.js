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

router.get('/subscribed-user', isAdmin, userController.getSubscribedUserList);

// API's Route's

router.post('/api/add-user', userController.postAPIsUserAdd);
router.post('/api/login-check', userController.postAPIsLoginCheck);
router.post('/api/user-profile', userController.postAPIsUserProfile);
router.post('/api/user-edit',  userController.postAPIsUserEdit);
router.post('/api/user-image',  userController.postAPIsUserImage);
router.post('/api/user-list',  userController.getAPIsOnlineUserList);

router.post('/api/coin',userController.postAPIsCoin);

router.post('/api/add-favourite',userController.postAPIsFavourite);
router.post('/api/get-favourite', userController.postAPIsGetFavourite);
router.post('/api/remove-favourite', userController.postAPIsRemoveFavourite);
router.post('/api/add-block', userController.postAPIsBlock);
router.post('/api/get-block', userController.postAPIsGetBlock);
router.post('/api/remove-block', userController.postAPIsRemoveBlock);

router.post('/api/gender-preference', userController.postAPIsGenderPreference);
router.post('/api/change-genderpreference', userController.postAPIsRandomUser);

router.post('/api/update-status-online',  userController.postAPIUpdateStatusOnline);
router.post('/api/update-status-ofline',  userController.postAPIUpdateStatusOfline);

router.post('/api/get-favourite-you',   userController.getFavouriteYou);
router.post('/api/get-video-list', userController.postVideoCallList);

router.post('/api/chat-coin', userController.postChatCoinDeduction);
module.exports = router;