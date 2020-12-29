const express = require('express');
const router = express.Router()
const purchaseController = require('../controllers/c-purchase');
const verify = require('../middleware/verify-token');

router.get('/purchase', purchaseController.getPurchase);
router.post('/purchase', purchaseController.postPurchase);
router.delete('/purchase-delete/:inputUserId', purchaseController.getPurchaseDelete);

//api
router.post('/api/purchase', purchaseController.getAPIsPurchase);


module.exports = router;