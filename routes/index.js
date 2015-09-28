var express = require('express');
var router = express.Router();
var Page = require('../models/page');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});

router.get('/home/edit', function(req, res, next) {
  res.render('edit-page', { page: 'home' });
});

router.post('/home/edit', function(req, res, next) {
  Page.create({
    url: 'home',
    body: req.body.data
  });
  res.redirect('/home/edit');
});

module.exports = router;
