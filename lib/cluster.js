'use strict';

var LatLng = require('./lat-lng');
var LatLngBounds = require('./lat-lng-bounds');

/**
 * Creates a single cluster that manages a group of proximate markers.
 * Created internally, then returned by the library.
 * @constructor
 * @param {MarkerClusterer} mc The <code>MarkerClusterer</code> object with which this
 *  cluster is associated.
 */
function Cluster(mc) {
  this.mc_ = mc;
  this.gridSize_ = mc.gridSize_;
  this.markers_ = [];
  this.center_ = null;
  this.bounds_ = null;
}

/**
 * Returns the number of markers managed by the cluster.
 *
 * @return {number} The number of markers in the cluster.
 */
Cluster.prototype.getSize = function () {
  return this.markers_.length;
};

/**
 * Returns the array of markers managed by the cluster.
 *
 * @return {Array} The array of markers in the cluster.
 */
Cluster.prototype.getMarkers = function () {
  return this.markers_;
};

/**
 * Returns the center of the cluster.
 *
 * @return {LatLng} The center of the cluster.
 */
Cluster.prototype.getCenter = function () {
  return this.center_;
};

/**
 * Returns the bounds of the cluster.
 *
 * @return {LatLngBounds} the cluster bounds.
 * @ignore
 */
Cluster.prototype.getBounds = function () {
  var i;
  var bounds = new LatLngBounds(this.center_, this.center_);
  var markers = this.getMarkers();
  for (i = 0; i < markers.length; i++) {
    bounds.extend(markers[i].getPosition());
  }
  return bounds;
};

/**
 * Adds a marker to the cluster.
 *
 * @param {Marker} marker The marker to be added.
 * @return {boolean} True if the marker was added.
 * @ignore
 */
Cluster.prototype.addMarker = function (marker) {
  var i;
  var mCount;
  var mz;

  if (this.isMarkerAlreadyAdded_(marker)) {
    return false;
  }

  if (!this.center_) {
    this.center_ = marker.getPosition();
    this.calculateBounds_();
  }

  marker.isAdded = true;
  this.markers_.push(marker);

  return true;
};

/**
 * Determines if a marker lies within the cluster's bounds.
 *
 * @param {Marker} marker The marker to check.
 * @return {boolean} True if the marker lies in the bounds.
 * @ignore
 */
Cluster.prototype.isMarkerInClusterBounds = function (marker) {
  return this.bounds_.contains(marker.getPosition());
};

/**
 * Calculates the extended bounds of the cluster with the grid.
 */
Cluster.prototype.calculateBounds_ = function () {
  this.bounds_ = this.mc_.getExtendedBounds(new LatLngBounds(this.center_, this.center_));
};

/**
 * Determines if a marker has already been added to the cluster.
 *
 * @param {Marker} marker The marker to check.
 * @return {boolean} True if the marker has already been added.
 */
Cluster.prototype.isMarkerAlreadyAdded_ = function (marker) {
  var i;
  if (this.markers_.indexOf) {
    return this.markers_.indexOf(marker) !== -1;
  } else {
    for (i = 0; i < this.markers_.length; i++) {
      if (marker === this.markers_[i]) {
        return true;
      }
    }
  }
  return false;
};

module.exports = Cluster;
