requirejs.config({
	baseUrl: 'js/lib',
	paths: {
		app: '../app',
		jquery: '//ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min'
	},
	gmaps: {
		parameters: {
			v: "3.exp",
			libraries: "visualization,places,drawing,geometry",
			key: "AIzaSyB9dAQG-LxLeEVs8opvx2sAEwOcovMBfyk"
		}
	},
	map: {
		"*": {
			gmaps: "../lib/gmaps!https://maps.googleapis.com/maps/api/js"
		}
	}
});

requirejs(['app/meetup', 'app/form', 'app/map', 'knockout', 'gmaps', 'app/geocoder'],
	function (Meetup, Form, Map, ko, gmaps, Geocoder) {

		var ViewModel = function () {
			var self = this;
			this.form = new Form();
			this.meetup = new Meetup();
			this.geo = new Map();
			this.geocoder = new Geocoder();

			this.findZipCode = function (arr) {
				arr.forEach(function (x) {
					if (x.types[0] === "postal_code") {
						self.form.zip = x.short_name;
						self.updatePosition('marker');
						self.updatePosition('circle');
						self.updateCircleRadius();
						self.getAttractions();
						return;
					}
				});
			};

			this.showMoreInfo = function (x) {
				self.meetup.info(x);
				console.log(x);
			};

			this.makeAddrList = function (x) {
				return new self.form.item(x.formatted_address);
			};

			this.makeMtpList = function (data) {
				var results = data.results;
				results.forEach(function (x) {
					var group = new self.meetup.group(x);
					self.addMapInfo(group);
				});
			};

			this.addMapInfo = function (x) {
				x.marker = self.geo.makeMarker(x.venue, self.geo.map, '', x.eventName());
			};

			this.setAddress = function (y) {
				self.form.address(y.addr());
				self.findAddress();
			};

			this.updatePosition = function (elem) {
				switch (elem) {
				case 'marker':
					self.geo.marker.setOptions({
						position: self.geo.map.center
					});
					break;
				case 'circle':
					self.geo.circle.setOptions({
						center: self.geo.map.center
					});
					break;
				}
			};

			this.updateCircleRadius = function () {
				self.geo.circle.setOptions({
					radius: self.form.radius() * 1609.34
				});
			};

			this.findAddress = function () {
				var address = self.form.address();
				self.form.clearList();
				self.meetup.clearList();
				if (address === '') {
					return self.form.alertUser('You must enter an address.');
				}
				self.geocoder.geocodeAddress(address, self.cb);
			};

			this.cb = function (results, status) {
				if (status === gmaps.GeocoderStatus.OK) {
					return self.checkResults(results);
				}
			};

			this.checkResults = function (results) {
				if (results.length > 1) {
					self.form.alertUser('Did you mean:');
					results.forEach(self.makeAddrList);
				} else if (results.length === 1) {
					self.geo.map.setCenter(results[0].geometry.location);
					self.findZipCode(results[0].address_components);
				} else {
					self.form.alertUser('We could not find that location - try entering a more specific place.');
				}
			};

			this.getAttractions = function () {
				self.meetup.APIcall(self.form.zip, self.form.radius(), self.makeMtpList);
			};

			this.meetup.init();
		};
		ko.applyBindings(new ViewModel());
	});

//localStorage.clear();
