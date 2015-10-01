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
      info['scale'] = doc.descendantWithPath('Meta.Distance').attr.FeetPerPixel;
      info['name'] = doc.descendantWithPath('Meta.Map').attr.Title;
      info['color'] = doc.descendantWithPath('Meta.Image').attr.Color;

      loads = [];
      unloads = [];

      var segments = doc.childNamed("Segments");
      segments.eachChild(function (segment) {
        if(segment.descendantWithPath('Load')) {
          loads.push(segment.descendantWithPath('Load').attr.Type)
        }
        if(segment.descendantWithPath('Unload')) {
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

      var distance = 0;
      segments.eachChild(function (segment) {
        if(['TrackSegment', 'EESegment', 'LUSegment', 'HiddenLUSegment', 'HiddenSegment'].indexOf(segment.name) > -1){
          dist = Math.sqrt(Math.pow(segment.attr.X1 - segment.attr.X2, 2)
           + Math.pow(segment.attr.Y1 - segment.attr.Y2, 2));
          distance += dist;
          console.log();
        }
      });

      info['mileage'] = (distance / 5280.0 * info['scale']).toFixed(2);
    }
  });

  return info;
}

module.exports = mongoose.model('Map', Map);
