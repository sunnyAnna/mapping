define(['gmaps'], function(gmaps) {
	'use strict';
	/**
	 * @description Creates geocoder object
	 * @constructor
	 * @returns {object}
	 */
	var Geo = function() {
		this.geocoder = new gmaps.Geocoder();
	};

	/**
	 * @description Board class
	 * @param {object} address - latlng coordinates to geocode
	 * @param {function} callback
	 */
	Geo.prototype.geocodeAddress = function(address, callback) {
		this.geocoder.geocode({
			address: address
		}, callback);
	};

	return Geo;
});
