'use strict';

function LatLng(lat, lng) {
  this.lat_ = lat;
  this.lng_ = lng;
}

LatLng.prototype.lat = function() {
  return this.lat_;
};

LatLng.prototype.lng = function() {
  return this.lng_;
};

module.exports = LatLng;
