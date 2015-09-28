var express = require('express');
var router = express.Router();
var Page = require('../models/page');

router.get('/', function(req, res, next) {
  Page.findOne({name: 'home'}, function (err, doc) {
    var body;

    if(doc)
      body = doc['body'];
    else
      body = '';

    edit = req.user && req.user['admin'];

    res.render('index', { title: 'Home', content: body, edit: edit });
  });
});

router.get('/home/edit', function(req, res, next) {
  Page.find({name: 'home'}, function (err, docs) {
    body = docs[0]['body'];

    res.render('edit-page', { page: 'home', pageContent: body});
  });

});

router.post('/home/edit', function(req, res, next) {
  if (!(req.user && req.user['admin'])) {
    res.render("404");
    return;
  }
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
