let express = require('express');
let mustacheExpress = require('mustache-express');
let bodyParser = require('body-parser');
let rootRoute = require('./routes/root');

let app = express();

app.set('views', `${__dirname}/views`);
app.set('view engine', 'mustache');

app.engine('mustache', mustacheExpress());

app.use (bodyParser.urlencoded( {extended : true} ) );

app.use ('/', rootRoute);

app.listen(3000,function() {
    console.log("Server started");
});
