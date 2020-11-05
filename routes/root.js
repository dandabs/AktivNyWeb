let router = require('express').Router();
let storage = require('../simpleStorage');

router.get('/', function(request,response) {
  response.render ('root', {pageTitle: "Home"});
});

module.exports = router;
