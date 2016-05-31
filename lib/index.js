/**
 * @name marker-precluster
 * @version 1.0.0 [May 31, 2016]
 * @author Matthew Hall
 * @fileoverview
 * The library can compute clusters of markers external of a map for later rendering.
 * <p>
 * This is a port of the MarkerClustererPlus 2.1.2 to run in NodeJS.
 * https://github.com/googlemaps/v3-utility-library/blob/master/markerclustererplus
 * MarkerClustererPlus is an enhanced V3 implementation of the
 * <a href="http://gmaps-utility-library-dev.googlecode.com/svn/tags/markerclusterer/"
 * >V2 MarkerClusterer</a> by Xiaoxi Wu. It is based on the
 * <a href="http://google-maps-utility-library-v3.googlecode.com/svn/tags/markerclusterer/"
 * >V3 MarkerClusterer</a> port by Luke Mahe. MarkerClustererPlus was created by Gary Little.
 */

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

module.exports.MarkerClusterer = require('./marker-clusterer');
module.exports.Marker = require('./marker');
module.exports.LatLng = require('./lat-lng');
