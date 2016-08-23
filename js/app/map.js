define(['gmaps'], function(gmaps) {
	'use strict';
	/**
	 * @description Creates map object
	 * @constructor
	 * @returns {object}
	 */
	var Map = function() {
		var self = this;
		this.homeImg = 'M18.121,9.88l-7.832-7.836c-0.155-0.158-0.428-0.155-0.584,0L1.842,9.913c-0.262,0.263-0.073,0.705,0.292,0.705h2.069v7.042c0,0.227,0.187,0.414,0.414,0.414h3.725c0.228,0,0.414-0.188,0.414-0.414v-3.313h2.483v3.313c0,0.227,0.187,0.414,0.413,0.414h3.726c0.229,0,0.414-0.188,0.414-0.414v-7.042h2.068h0.004C18.331,10.617,18.389,10.146,18.121,9.88 M14.963,17.245h-2.896v-3.313c0-0.229-0.186-0.415-0.414-0.415H8.342c-0.228,0-0.414,0.187-0.414,0.415v3.313H5.032v-6.628h9.931V17.245z M3.133,9.79l6.864-6.868l6.867,6.868H3.133z';
		this.stylesArray = [{
			"featureType": "poi",
			"elementType": "all",
			"stylers": [{
				"hue": "#000000"
			}, {
				"saturation": -100
			}, {
				"lightness": -100
			}, {
				"visibility": "off"
			}]
		}, {
			"featureType": "poi",
			"elementType": "all",
			"stylers": [{
				"hue": "#000000"
			}, {
				"saturation": -100
			}, {
				"lightness": -100
			}, {
				"visibility": "off"
			}]
		}, {
			"featureType": "administrative",
			"elementType": "all",
			"stylers": [{
				"hue": "#000000"
			}, {
				"saturation": 0
			}, {
				"lightness": -100
			}, {
				"visibility": "off"
			}]
		}, {
			"featureType": "road",
			"elementType": "labels",
			"stylers": [{
				"hue": "#ffffff"
			}, {
				"saturation": -100
			}, {
				"lightness": 100
			}, {
				"visibility": "off"
			}]
		}, {
			"featureType": "water",
			"elementType": "labels",
			"stylers": [{
				"hue": "#000000"
			}, {
				"saturation": -100
			}, {
				"lightness": -100
			}, {
				"visibility": "off"
			}]
		}, {
			"featureType": "road.local",
			"elementType": "all",
			"stylers": [{
				"hue": "#ffffff"
			}, {
				"saturation": -100
			}, {
				"lightness": 100
			}, {
				"visibility": "on"
			}]
		}, {
			"featureType": "water",
			"elementType": "geometry",
			"stylers": [{
				"hue": "#ffffff"
			}, {
				"saturation": -100
			}, {
				"lightness": 100
			}, {
				"visibility": "on"
			}]
		}, {
			"featureType": "transit",
			"elementType": "labels",
			"stylers": [{
				"hue": "#000000"
			}, {
				"saturation": 0
			}, {
				"lightness": -100
			}, {
				"visibility": "off"
			}]
		}, {
			"featureType": "landscape",
			"elementType": "labels",
			"stylers": [{
				"hue": "#000000"
			}, {
				"saturation": -100
			}, {
				"lightness": -100
			}, {
				"visibility": "off"
			}]
		}, {
			"featureType": "road",
			"elementType": "geometry",
			"stylers": [{
				"hue": "#bbbbbb"
			}, {
				"saturation": -100
			}, {
				"lightness": 26
			}, {
				"visibility": "on"
			}]
		}, {
			"featureType": "landscape",
			"elementType": "geometry",
			"stylers": [{
				"hue": "#dddddd"
			}, {
				"saturation": -100
			}, {
				"lightness": -3
			}, {
				"visibility": "on"
			}]
		}];
		/**
		 * @description An instance of a map
		 */
		this.map = new gmaps.Map(document.getElementById('map'), {
			center: {
				lat: 37.7749,
				lng: -122.4194
			},
			zoom: 12,
			styles: self.stylesArray
		});
		/**
		 * @description An instance of a circle
		 */
		this.circle = new gmaps.Circle({
			center: self.map.center,
			map: self.map,
			radius: 1609.34,
			fillColor: '#fff',
			fillOpacity: 0.7,
			strokeColor: '#a1a1a1',
			strokeWeight: 5,
			strokeOpacity: 1
		});
		/**
		 * @description Creates an icon
		 * @constructor
		 * @param {number} scale - Icon size
		 * @param {string} strokeColor - Icon color
		 * @param {number} strokeWeight - Icon line thickness
		 * @param {string} path - Icon drawing
		 */
		this.Icon = function(scale, strokeColor, strokeWeight, path) {
			this.path = path || google.maps.SymbolPath.CIRCLE;
			this.scale = scale;
			this.strokeColor = strokeColor;
			this.strokeWeight = strokeWeight;
		};
		this.iconTypes = {
			static: new self.Icon(5, '#BAB803', 7),
			active: new self.Icon(7, '#E0393E', 10),
			main: new self.Icon(2, '#000', 2, self.homeImg)
		};
		/**
		 * @description Creates an icon
		 * @param {object} pos - latlng coordinates
		 * @param {object} map - placement map
		 * @param {string} title
		 * @param {object} ic - icon
		 * @returns {object}
		 */
		this.makeMarker = function(pos, map, title, ic) {
			var marker = new gmaps.Marker({
				position: pos,
				map: map,
				animation: google.maps.Animation.DROP,
				icon: ic || self.iconTypes.static,
				title: title
			});
			marker.active = false;
			marker.addListener('click', function() {
				self.toggleMarker(this);
			});
			return marker;
		};
		/**
		 * @description Creates main marker
		 */
		this.mainMarker = self.makeMarker(self.map.center, self.map, 'you are here', self.iconTypes.main);
		/**
		 * @description Adjusts positioning of the main marker
		 */
		this.mainMarker.icon.anchor = new gmaps.Point(10, 11);
		/**
		 * @description Active state object
		 */
		this.activeMarker = {};

		/**
		 * @description Toggles the marker, icon and infoWindow
		 * @param {object} marker
		 * @returns {object} Assigns the marker to the active state object
		 */
		this.toggleMarker = function(marker) {
			if (marker !== self.activeMarker) {
				self.activeMarker_deactivate();
			}
			if (marker.active === false) {
				marker.active = true;
				self.toggleIcon(marker);
				self.updateInfoWindow(marker);
				self.infoWindow.open(self.map, marker);
			} else {
				marker.active = false;
				self.toggleIcon(marker);
				self.infoWindow.close();
			}
			self.activeMarker = marker;
		};
		/**
		 * @description Removes the marker from the active state object
		 */
		this.activeMarker_deactivate = function() {
			if (self.activeMarker) {
				self.activeMarker.active = false;
				self.toggleIcon(self.activeMarker);
				self.infoWindow.close();
			}
		};
		/**
		 * @description Toggles the icon
		 */
		this.toggleIcon = function(marker) {
			if (marker !== self.mainMarker) {
				var icon = marker.active === false ? self.iconTypes.static : self.iconTypes.active;
				marker.setIcon(icon);
			}
		};
		/**
		 * @description Creates an instance of the infoWindow
		 */
		this.infoWindow = new gmaps.InfoWindow();
		this.infoWindow.addListener('closeclick', function() {
			self.toggleMarker(self.activeMarker);
		});
		/**
		 * @description Assigns new content and position to the infoWindow
		 * @param {object} marker
		 */
		this.updateInfoWindow = function(marker) {
			self.infoWindow.setOptions({
				content: marker.title,
				position: marker.position
			});
		};
		/**
		 * @description Assigns new position to either the marker or the circle
		 * @param {string} elem - Target for the function
		 */
		this.updatePosition = function(elem) {
			switch (elem) {
				case 'marker':
					self.mainMarker.setPosition(self.map.center);
					break;
				case 'circle':
					self.circle.setCenter(self.map.center);
					break;
			}
		};
		/**
		 * @description Assigns new radius to the the circle
		 * @param {number} radius
		 */
		this.updateCircleRadius = function(radius) {
			self.circle.setRadius(radius * 1609.34);
		};
		/**
		 * @description Toggles visibility of the marker
		 * @param {object} elem - marker
		 * @param {number} distance
		 * @param {number} border
		 * @returns {boolean}
		 */
		this.updateVisibility = function(elem, distance, border) {
			if (distance < border) {
				elem.marker.setVisible(true);
				return true;
			} else {
				elem.marker.setVisible(false);
				return false;
			}
		};
		/**
		 * @description Assigns new position to the map and the markers. Assigns new position and radius to the circle.
		 * @param {object} map
		 * @param {number} radius
		 */
		this.updateMap = function(map, radius) {
			self.map = map;
			self.updatePosition('marker');
			self.updatePosition('circle');
			self.updateCircleRadius(radius);
		};
	};
	return Map;
});
