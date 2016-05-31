'use strict';

var LatLng = require('./lat-lng');

/**
 * Creates a single cluster that manages a group of proximate markers.
 * Created internally, then returned by the library.
 * @constructor
 * @param info any extra data to associate with the marker
 * @param {LatLng} pos The position of the marker
 */
function Marker(info, pos) {
  this.info_ = info;
  this.pos_ = new LatLng(pos.lat_, pos.lng_);
}

Marker.prototype.getPosition = function() {
  return this.pos_;
};

Marker.prototype.getInfo = function() {
  return this.info_;
}

module.exports = Marker;
