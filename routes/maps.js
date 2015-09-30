var express = require('express');
var multer  = require('multer');
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

router.post('/', upload.array('maps[]', 12), function(req, res){
  req.files.forEach(function(map) {
    uploadedName = 'tmp/uploads/' + map['filename'];
    newName = 'public/maps/' + map['originalname'];
    if(fs.existsSync(newName)) {
      return;
    }

    var zip = new AdmZip(uploadedName);
    var data = zip.readAsText(zip.getEntry('info.json'));
    var info = JSON.parse(data);

    fs.rename(uploadedName, newName);

    info['fileName'] = map['originalname'];
    Map.create(info);

  });
  res.redirect('/maps/');

});

module.exports = router;
