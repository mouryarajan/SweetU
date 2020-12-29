const firebase = require('firebase');

const app = firebase.initializeApp({
    apiKey: "AIzaSyDHKfaMTrppv0Tv8xo0KlLGD0vL6yhwveA",
    authDomain: "sweetu-6cb6e.firebaseapp.com",
    databaseURL: "https://sweetu-6cb6e.firebaseio.com/"
});

module.exports = app;