'use strict';

var LatLng = require('./lat-lng');

function LatLngBounds(ne, sw) {
  this.ne_ = new LatLng(ne.lat_, ne.lng_);
  this.sw_ = new LatLng(sw.lat_, sw.lng_);
}

LatLngBounds.prototype.getNorthEast = function() {
  return this.ne_;
};

LatLngBounds.prototype.getSouthWest = function() {
  return this.sw_;
};

LatLngBounds.prototype.extend = function(pos) {
  if (pos.lat_ < this.sw_.lat_) {
    this.sw_ = new LatLng(pos.lat_, this.sw_.lng_);
  }
  if (pos.lng_ < this.sw_.lng_) {
    this.sw_ = new LatLng(this.sw_.lat_, pos.lng_);
  }
  if (pos.lat_ > this.ne_.lat_) {
    this.ne_ = new LatLng(pos.lat_, this.ne_.lng_);
  }
  if (pos.lng_ > this.ne_.lng_) {
    this.ne_ = new LatLng(this.ne_.lat_, pos.lng_);
  }
};

LatLngBounds.prototype.contains = function(pos) {
  return (
    (pos.lat_ <= this.ne_.lat_ && pos.lat_ >= this.sw_.lat_)
      && (pos.lng_ <= this.ne_.lng_ && pos.lng_ >= this.sw_.lng_)
  );
};

module.exports = LatLngBounds;
