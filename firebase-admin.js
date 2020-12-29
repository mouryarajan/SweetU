var admin = require("firebase-admin");

var serviceAccount = require("./google-services.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://sweetu-6cb6e.firebaseio.com"
});

module.exports.admin = admin