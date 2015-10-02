var express = require('express');
var multer  = require('multer');
var upload = multer({ dest: 'tmp/uploads/' });
var fs = require('fs');

var router = express.Router();

router.get('/', function(req, res, next) {
  if (!(req.user && req.user['admin'])) {
    res.render("403");
    return;
  }

  uploads = fs.readdirSync('public/uploads');
  res.render('uploads', { uploads: uploads});
});

router.post('/', upload.array('files[]'), function(req, res){
  if (!(req.user && req.user['admin'])) {
    res.render("403");
    return;
  }

  req.files.forEach(function(map) {
    var uploadedName = 'tmp/uploads/' + map['filename'];
    var newName = 'public/uploads/' + map['originalname'];
    if(fs.existsSync(newName)) {
      // TODO -rename
      return;
    }

    fs.rename(uploadedName, newName);
  });
  res.redirect('/uploads/');
});

module.exports = router;
