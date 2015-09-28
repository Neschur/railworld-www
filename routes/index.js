var express = require('express');
var router = express.Router();
var Page = require('../models/page');

/* GET home page. */
router.get('/', function(req, res, next) {
  Page.findOne({name: 'home'}, function (err, doc) {
    var body;

    if(doc)
      body = doc['body'];
    else
      body = '';

    res.render('index', { title: 'Home', content: body });
  });
});

router.get('/home/edit', function(req, res, next) {
  Page.find({name: 'home'}, function (err, docs) {
    body = docs[0]['body'];

    res.render('edit-page', { page: 'home', pageContent: body});
  });

});

router.post('/home/edit', function(req, res, next) {
  Page.findOne({name: 'home'}, function (err, doc) {
    if(!doc) {
      Page.create({
        name: 'home',
        body: req.body.data
      });
    } else {
      doc.body = req.body.data;
      doc.save();
    }

  });
  res.redirect('/');
});

module.exports = router;
