var express = require('express');
var multer  = require('multer');
var upload = multer({ dest: 'tmp/uploads/' });
var Map = require('../models/map');
var fs = require('fs');

var router = express.Router();

router.get('/', function(req, res, next) {
  Map.find({}, function (err, docs) {
    res.render('maps', { title: 'Maps', maps: docs });
  });
});

router.post('/', upload.array('maps[]', 12), function(req, res){
  req.files.forEach(function(map) {
    var uploadedName = 'tmp/uploads/' + map['filename'];
    var newName = 'public/maps/' + map['originalname'];
    if(fs.existsSync(newName)) {
      return;
    }

    var info = Map.parseZippedXml(uploadedName);

    fs.rename(uploadedName, newName);

    info['fileName'] = map['originalname'];
    Map.create(info);

  });
  res.redirect('/maps/');

});

module.exports = router;
