'use strict';

var LatLng = require('./lat-lng');
var Cluster = require('./cluster');

/**
 * Converts a LatLng to a point of x,y in pixels
 *
 * @param {LatLng} ltlg The LatLng to be converted
 * @param {number} zoom The zoom level to perform the conversion at.
 * @return The converted x,y in an object.
 * @see http://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#Pseudo-code
*/
function fromLatLngToPixel(ltlg, zoom) {
  var tileSize = 256;
  var n = Math.pow(2.0, zoom);

  var lng = ltlg.lng();

  var lng_rad = lng * Math.PI / 180;
  var lat_rad = ltlg.lat() * Math.PI / 180;

  var tileX = ((lng + 180) / 360) * n;
  var tileY = (1 - (Math.log(Math.tan(lat_rad) + 1.0/Math.cos(lat_rad)) / Math.PI)) * n / 2.0;

  var x = tileX * tileSize;
  var y = tileY * tileSize;

  return {
    x: x,
    y: y
  };
}

/**
 * Converts a point of x,y in pixels to a LatLng
 *
 * @param px The object containing an x and y in pixels to be converted
 * @param {number} zoom The zoom level to perform the conversion at.
 * @return {LatLng} The converted LatLng.
 * @see http://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#Pseudo-code
*/
function fromPixelToLatLng(px, zoom) {
  var tileSize = 256;
  var n = Math.pow(2.0, zoom);

  var x = px.x;
  var y = px.y;

  var tileX = x / tileSize;
  var tileY = y / tileSize;


  var lng = tileX / n * 360.0 - 180.0;

  var lat_rad = Math.atan(Math.sinh(Math.PI * (1 - 2 * tileY / n)));
  var lat = lat_rad * 180.0 / Math.PI;

  return new LatLng(lat, lng);
}

/**
 * @name MarkerClustererOptions
 * @class This class represents the optional parameter passed to
 *  the {@link MarkerClusterer} constructor.
 * @property {number} [gridSize=60] The grid size of a cluster in pixels. The grid is a square.
 * @property {number} [zoom=9] The zoom level to calculate clusters at.
 */

/**
 * Creates a MarkerClusterer object with the options specified in {@link MarkerClustererOptions}.
 * @constructor
 * @param {Array.<Marker>} The markers to be added to the cluster.
 * @param {MarkerClustererOptions} The optional parameters.
 */
function MarkerClusterer(markers, options) {
  this.markers_ = markers;
  this.gridSize_ = options.gridSize || 60;
  this.zoom_ = options.zoom || 9;
  this.clusters_ = [];
}

/**
 * Calculates the distance between two latlng locations in km.
 *
 * @param {LatLng} p1 The first lat lng point.
 * @param {LatLng} p2 The second lat lng point.
 * @return {number} The distance between the two points in km.
 * @see http://www.movable-type.co.uk/scripts/latlong.html
*/
MarkerClusterer.prototype.distanceBetweenPoints_ = function (p1, p2) {
  var R = 6371; // Radius of the Earth in km
  var dLat = (p2.lat() - p1.lat()) * Math.PI / 180;
  var dLon = (p2.lng() - p1.lng()) * Math.PI / 180;
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(p1.lat() * Math.PI / 180) * Math.cos(p2.lat() * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d;
};

/**
 * Returns the current bounds extended by the grid size.
 * Does mutate the bounds object passed in.
 *
 * @param {LatLngBounds} bounds The bounds to extend.
 * @return {LatLngBounds} The extended bounds.
 * @ignore
 */
MarkerClusterer.prototype.getExtendedBounds = function (bounds) {
  // var projection = this.getProjection();

  // Convert the points to pixels and the extend out by the grid size.
  var trPix = fromLatLngToPixel(bounds.getNorthEast(), this.zoom_);
  trPix.x += this.gridSize_;
  trPix.y -= this.gridSize_;

  var blPix = fromLatLngToPixel(bounds.getSouthWest(), this.zoom_);
  blPix.x -= this.gridSize_;
  blPix.y += this.gridSize_;

  // Convert the pixel points back to LatLng
  var ne = fromPixelToLatLng(trPix, this.zoom_);
  var sw = fromPixelToLatLng(blPix, this.zoom_);

  bounds.extend(ne);
  bounds.extend(sw);

  return bounds;
};

/**
 * Adds a marker to a cluster, or creates a new cluster.
 *
 * @param {Marker} marker The marker to add.
 */
MarkerClusterer.prototype.addToClosestCluster_ = function (marker) {
  var i, d, cluster, center;
  var distance = 40000; // Some large number
  var clusterToAddTo = null;
  for (i = 0; i < this.clusters_.length; i++) {
    cluster = this.clusters_[i];
    center = cluster.getCenter();
    if (center) {
      d = this.distanceBetweenPoints_(center, marker.getPosition());
      if (d < distance) {
        distance = d;
        clusterToAddTo = cluster;
      }
    }
  }

  if (clusterToAddTo && clusterToAddTo.isMarkerInClusterBounds(marker)) {
    clusterToAddTo.addMarker(marker);
  } else {
    cluster = new Cluster(this);
    cluster.addMarker(marker);
    this.clusters_.push(cluster);
  }
};

/**
 * Creates the clusters.
 */
MarkerClusterer.prototype.createClusters = function () {
  var i, marker;

  var iLast = this.markers_.length;

  var percentComplete = 0;

  for (i = 0; i < iLast; i++) {
    marker = this.markers_[i];
    if (!marker.isAdded) {
      this.addToClosestCluster_(marker);
    }

    var n = ((i * 100 / iLast) / 10)|0;

    if (n > percentComplete) {
      percentComplete = n;
      console.log('completed: ' + percentComplete + '0%')
    }
  }

  return this.clusters_;
};

module.exports = MarkerClusterer;
