const express = require("express");
const router = express.Router();
const countryController = require('../controllers/c-country');

router.get('/country',countryController.getCountry);
router.post('/add-country', countryController.postCountry);
router.delete('/delete-country/:inputCountryId', countryController.deleteCountry);

//api

router.post('/api/get-country', countryController.getAPIsCountry);

module.exports = router;