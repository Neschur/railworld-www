var express = require('express');
var multer  = require('multer')
var upload = multer({ dest: 'tmp/uploads/' });
var Map = require('../models/map');
var fs = require('fs');
var AdmZip = require('adm-zip');

var router = express.Router();

router.get('/', function(req, res, next) {
  Map.find({}, function (err, docs) {
    res.render('maps', { title: 'Maps', maps: docs });
  });
});

router.post('/', upload.single('map'), function(req, res){
  uploadedName = 'tmp/uploads/' + req.file['filename'];

  var zip = new AdmZip("./seattle.zip");
  var data = zip.readAsText(zip.getEntry('info.json'));
  var info = JSON.parse(data)

  fs.rename(uploadedName, 'public/maps/' + req.file['originalname'])
  Map.create({
    fileName: req.file['originalname'],
    name: info['name'],
    color: info['color'],
    scale: info['scale'],
    loads: info['loads'],
    unloads: info['unloads'],
    mileage: info['mileage'],
  });
  res.redirect('/maps');
});

module.exports = router;
