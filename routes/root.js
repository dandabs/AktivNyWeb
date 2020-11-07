let router = require('express').Router();
let storage = require('../simpleStorage');

router.get('/', function(request,response) {
  response.render ('root', {pageTitle: "Home"});
});

router.get('/login', function(request,response) {
  response.render ('login', {pageTitle: "Login"});
});

router.get('/ping', (req, res) => {
  res.json({
    message: 'Hello world!'
  })
})

module.exports = router;
