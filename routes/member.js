let router = require('express').Router();
let storage = require('../simpleStorage');
const admin = require('firebase-admin');

router.get('/', function(request,response) {
    let req = request;

    const sessionCookie = req.cookies.session || '';

    if (req.headers.authtoken) {

       admin.auth().verifyIdToken(req.headers.authtoken)
        .then((user) => {
            response.render ('root', {pageTitle: "Home", user: user});
        })

    } else {

         admin.auth().verifySessionCookie(
            sessionCookie, true /** checkRevoked */)
            .then((decodedClaims) => {
                response.render ('root', {pageTitle: "Home", user: decodedClaims});
            })

    }
});

router.get('/post', function(request,response) {

    let req = request;

    const sessionCookie = req.cookies.session || '';

    if (req.headers.authtoken) {

       admin.auth().verifyIdToken(req.headers.authtoken)
        .then((user) => {
            response.render ('post', {pageTitle: "Post", user: user});
        })

    } else {

         admin.auth().verifySessionCookie(
            sessionCookie, true /** checkRevoked */)
            .then((decodedClaims) => {
                response.render ('post', {pageTitle: "Post", user: decodedClaims});
            })

    }
});

router.get('/admin', function(request,response) {

    let req = request;

    const sessionCookie = req.cookies.session || '';

    if (req.headers.authtoken) {

       admin.auth().verifyIdToken(req.headers.authtoken)
        .then((user) => {
            response.render ('admin', {pageTitle: "Admin", user: user});
        })

    } else {

         admin.auth().verifySessionCookie(
            sessionCookie, true /** checkRevoked */)
            .then((decodedClaims) => {
                response.render ('admin', {pageTitle: "Admin", user: decodedClaims});
            })

    }
});

router.get('/profile', function(request,response) {

    let req = request;

    const sessionCookie = req.cookies.session || '';

    if (req.headers.authtoken) {

       admin.auth().verifyIdToken(req.headers.authtoken)
        .then((user) => {
            response.render ('profile', {pageTitle: "Profile", user: user});
        })

    } else {

         admin.auth().verifySessionCookie(
            sessionCookie, true /** checkRevoked */)
            .then((decodedClaims) => {
                response.render ('profile', {pageTitle: "Profile", user: decodedClaims});
            })

    }
});

module.exports = router;
