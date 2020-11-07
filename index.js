let express = require('express');
let mustacheExpress = require('mustache-express');
let bodyParser = require('body-parser');
const cors = require('cors');
let firebase = require('firebase');
const admin = require('firebase-admin');

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
app.use(cors());

// authentication
let authorized = true

function checkAuth(req, res, next) {
    if (req.headers.authtoken) {
      admin.auth().verifyIdToken(req.headers.authtoken)
        .then(() => {
          next()
        }).catch(() => {
          res.status(403).send('Unauthorized')
        });
    } else {
      res.status(403).send('Unauthorized')
    }
  }

// static files
app.use('/cdn', require('./routes/cdn'))

// route declarations
app.use('/', require('./routes/root'));
app.use('/ping', checkAuth);

app.use('/member', checkAuth);
app.use('/member', require('./routes/root'));

// listeners
app.listen(3000,function() {
    console.log("Server started");
});
