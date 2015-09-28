var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Page = new Schema({
  name: String,
  body: String,
  title: String,
});

module.exports = mongoose.model('Page', Page);
