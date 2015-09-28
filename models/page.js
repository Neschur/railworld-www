var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Page = new Schema({
  name: String,
  body: String
});

module.exports = mongoose.model('Page', Page);
