let router = require('express').Router();
let express = require('express');
let storage = require('../simpleStorage');

router.use(express.static('public'));

module.exports = router;
