var express = require('express');
var multer  = require('multer')
var upload = multer({ dest: 'tmp/uploads/' });
var Map = require('../models/map');
var fs = require('fs');

var router = express.Router();

router.get('/', function(req, res, next) {
  Map.find({}, function (err, docs) {
    res.render('maps', { title: 'Maps', maps: docs });
  });
});

router.post('/', upload.single('map'), function(req, res){
  fs.rename('tmp/uploads/' + req.file['filename'], 'public/maps/' + req.file['originalname'])
  Map.create({
    fileName: req.file['originalname'],
  });
  res.redirect('/maps');
});

module.exports = router;
