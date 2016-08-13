define(['gmaps'], function (gmaps) {

	var Geo = function () {
		this.geocoder = new gmaps.Geocoder();
	};

	Geo.prototype.geocodeAddress = function (address, callback) {
		this.geocoder.geocode({
			address: address
		}, callback);
	};

	return Geo;
});
