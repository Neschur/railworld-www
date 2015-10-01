var mongoose = require('mongoose');
var AdmZip = require('adm-zip');
var xmldoc = require('xmldoc');

var Schema = mongoose.Schema;

var Map = new Schema({
  fileName: String,
  name: String,
  scale: Number,
  loads: String,
  unloads: String,
  mileage: Number,
});

Map.statics.parseZippedXml = function parseZippedXml (uploadedName, cb) {
  info = {};
  var zip = new AdmZip(uploadedName);
  console.log(uploadedName);
  zip.getEntries().forEach(function(zipEntry) {
    if(zipEntry.entryName.endsWith('.rwm')) {
      data = zip.readAsText(zipEntry);
      var doc = new xmldoc.XmlDocument(data);
      info['scale'] = doc.descendantWithPath('Meta.Distance').attr.Zoom;
      info['name'] = doc.descendantWithPath('Meta.Map').attr.Title;

      loads = [];
      unloads = [];

      var segments = doc.childNamed("Segments");
      segments.eachChild(function (segment) {
        if(segment.name == 'LUSegment') {;

          loads.push(segment.descendantWithPath('Load').attr.Type)
          unloads.push(segment.descendantWithPath('Unload').attr.Type)
        }
      });

      var arrayUnique = function(a) {
        return a.reduce(function(p, c) {
            if (p.indexOf(c) < 0) p.push(c);
            return p;
        }, []);
      };

      info['loads'] = arrayUnique(loads).join(', ');
      info['unloads'] = arrayUnique(unloads).join(', ');
    }
  });

  // info['color'] =
  // info['mileage'] =

  return info;
}

module.exports = mongoose.model('Map', Map);
