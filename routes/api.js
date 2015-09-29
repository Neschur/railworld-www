var express = require('express');
var Map = require('../models/map');

var router = express.Router();

router.get('/maps.json', function(req, res, next) {
  Map.find({}, function (err, docs) {

    res.write(JSON.stringify({maps: docs}));
    res.end();
  });
});

module.exports = router;
