var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Map = new Schema({
  id: String,
  fileName: String,
  name: String,
  color: Boolean,
  scale: Number,
  loads: String,
  unloads: String,
  mileage: Number,
});

module.exports = mongoose.model('Map', Map);
