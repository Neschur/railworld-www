var express = require('express');
var router = express.Router();
var Page = require('../models/page');

router.get('/', function(req, res, next) {
  res.redirect('/home');
});

router.get('/:type(home|downloads)', function(req, res, next) {
  type = req.params.type;
  Page.findOne({name: type}, function (err, doc) {
    var body = '';
    var title = '';

    if(doc) {
      body = doc['body'];
      title = doc['title'];
    }

    edit = req.user && req.user['admin'];

    res.render('page', {url: type, title: title, content: body, edit: edit });
  });
});

router.get('/:type(home|downloads)/edit', function(req, res, next) {
  Page.findOne({name: type}, function (err, doc) {
    body = doc && doc['body'];

    res.render('edit-page', { page: type, pageContent: body});
  });

});

router.post('/:type(home|downloads)/edit', function(req, res, next) {
  type = req.params.type;

  if (!(req.user && req.user['admin'])) {
    res.render("404");
    return;
  }

  Page.findOne({name: type}, function (err, doc) {
    if(!doc) {
      Page.create({
        name: type,
        body: req.body.data,
        title: req.body.title,
      });
    } else {
      doc.body = req.body.data;
      doc.title = req.body.title,
      doc.save();
    }

  });
  res.redirect('/' + type);
});

module.exports = router;
