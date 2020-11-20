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

    if (sessionCookie != '') {

       admin.auth().verifySessionCookie(
          sessionCookie, true /** checkRevoked */)
          .then((decodedClaims) => {
              response.render ('root', {pageTitle: "Home", user: decodedClaims});
          })

        } else response.render ('root', {pageTitle: "Home"});

  }
});

router.get('/post/:postid', function(request,response) {
  let req = request;

  const sessionCookie = req.cookies.session || '';

  if (req.headers.authtoken) {

     admin.auth().verifyIdToken(req.headers.authtoken)
      .then((user) => {
          response.render ('viewPost', {pageTitle: "Post", user: user});
      })

  } else {

    if (sessionCookie != '') {

       admin.auth().verifySessionCookie(
          sessionCookie, true /** checkRevoked */)
          .then((decodedClaims) => {
              response.render ('viewPost', {pageTitle: "Post", user: decodedClaims});
          })

        } else response.render ('viewPost', {pageTitle: "Post"});

  }
});

router.get('/category/:categoryid', function(request,response) {
  let req = request;

  const sessionCookie = req.cookies.session || '';

  if (req.headers.authtoken) {

     admin.auth().verifyIdToken(req.headers.authtoken)
      .then((user) => {
          response.render ('viewCategory', {pageTitle: "Category", user: user});
      })

  } else {

    if (sessionCookie != '') {

       admin.auth().verifySessionCookie(
          sessionCookie, true /** checkRevoked */)
          .then((decodedClaims) => {
              response.render ('viewCategory', {pageTitle: "Category", user: decodedClaims});
          })

        } else response.render ('viewCategory', {pageTitle: "Category"});

  }
});

router.get('/login', function(request,response) {
  let req = request;

  const sessionCookie = req.cookies.session || '';

  if (req.headers.authtoken) {

     admin.auth().verifyIdToken(req.headers.authtoken)
      .then((user) => {
          response.redirect("/");
      })

  } else {

        if (sessionCookie != '') {

       admin.auth().verifySessionCookie(
          sessionCookie, true /** checkRevoked */)
          .then((decodedClaims) => {
            response.redirect("/");
          })

        } else response.render ('login', {pageTitle: "Login"});

  }
});

router.get('/ping', (req, res) => {
  res.json({
    message: 'Hello world!'
  })
})

router.post('/sessionLogin', (req, res) => {
  // Get the ID token passed and the CSRF token.
  const idToken = req.headers.idtoken.toString();
  const csrfToken = req.headers.csrftoken.toString();
  // Guard against CSRF attacks.
  /*if (csrfToken !== req.cookies.csrfToken) {
    res.status(401).send('UNAUTHORIZED REQUEST!');
    return;
  }*/
  // Set session expiration to 5 days.
  const expiresIn = 60 * 60 * 24 * 5 * 1000;
  // Create the session cookie. This will also verify the ID token in the process.
  // The session cookie will have the same claims as the ID token.
  // To only allow session cookie setting on recent sign-in, auth_time in ID token
  // can be checked to ensure user was recently signed in before creating a session cookie.
  admin.auth().createSessionCookie(idToken, {expiresIn})
    .then((sessionCookie) => {

     // Set cookie policy for session cookie.
     const options = {maxAge: expiresIn, httpOnly: false, secure: false};
     res.header("Access-Control-Allow-Origin", "*");
     res.cookie('session', sessionCookie, options);
     res.send(JSON.stringify({status: 'success'}));
    }, error => {
     res.status(401).send('UNAUTHORIZED REQUEST!');
    });
});

module.exports = router;
