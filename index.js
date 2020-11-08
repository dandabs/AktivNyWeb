let express = require('express');
let mustacheExpress = require('mustache-express');
let bodyParser = require('body-parser');
const cors = require('cors');
let firebase = require('firebase');
const admin = require('firebase-admin');
var cookieParser = require('cookie-parser')

// declarations
let app = express();
const serviceAccount = require("./config/fbServiceAccountKey.json");

// initializations
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://aktiv-ny.firebaseio.com"
  })

// parameters
app.set('views', `${__dirname}/views`);
app.set('view engine', 'mustache');

// engines
app.engine('mustache', mustacheExpress());

// parsers
app.use(bodyParser.urlencoded( {extended : true} ) );
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(cookieParser())

// authentication
function checkAuth(req, res, next) {

    const sessionCookie = req.cookies.session || '';

    if (req.headers.authtoken) {

      admin.auth().verifyIdToken(req.headers.authtoken)
        .then((user) => {
          next()
        }).catch(() => {
          res.status(403).send('Unauthorized')
        });

    } else {

        admin.auth().verifySessionCookie(
            sessionCookie, true /** checkRevoked */)
            .then((decodedClaims) => {
              next();
            })
            .catch(error => {
              // Session cookie is unavailable or invalid. Force user to login.
              res.status(403).send('Unauthorized')
            });

    }

  }

// static files
app.use('/cdn', require('./routes/cdn'))

// authenticated singled routes
app.use('/ping', checkAuth);

// route declarations
app.use('/', require('./routes/root'));

app.use('/member', checkAuth);
app.use('/member', require('./routes/member'));

// listeners
app.listen(3000,function() {
    console.log("Server started");
});
