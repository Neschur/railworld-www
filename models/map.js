var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Map = new Schema({
  fileName: String,
});

module.exports = mongoose.model('Map', Map);
