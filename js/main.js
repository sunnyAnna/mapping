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
			this.meetup = new Meetup();
			this.meetup.init(); // authorize search
			this.form = new Form();
			this.meetup = new Meetup();
			this.geo = new Map();
			this.geocoder = new Geocoder();
			this.callMade = ko.observable(false);

			this.updateMeetupMap = function () {
				var radius = self.form.radius();
				self.geo.updateCircleRadius(radius);
				self.geo.activeMarker_deactivate();
				var list = self.meetup.list();
				if (list) {
					list.forEach(function (group) {
						group.visibility(self.geo.updateVisibility(group, group.distance(), radius));
						group.details(false);
					});
				}
			};

			this.toggleVisibility = function (x) {
				self.geo.toggleMarker(x.marker);
				self.meetup.toggleMeetup(x);
			};

			this.setAddress = function (y) {
				self.clear();
				self.form.address(y.addr());
				var center = y.place.geometry.location;
				self.geo.map.setCenter(center);
				self.geo.updateMap(self.geo.map, self.form.radius());
				self.getAttractions(center);
			};



			this.clear = function () {
				self.callMade(false);
				self.form.alertUser('');
				self.form.list([]);
				self.meetup.list([]);
			};

			this.getAttractions = function (center) {
				self.meetup.APIcall(center.lat(), center.lng(), 5, self.makeMtpList, self.form.alertUser);
			};

			this.makeMtpList = function (data) {
				if (data) {
					data.forEach(function (result) {
						var group = new self.meetup.group(result);
						group.marker = self.geo.makeMarker(group.venue, self.geo.map, group.eventName());
						group.visibility(self.geo.updateVisibility(group, group.distance(), self.form.radius()));
						return group;
					});
				}
				self.callMade(true);
			};

			this.findAddress = function () {
				self.clear();
				var address = self.form.address();
				if (address === '') {
					return self.form.alertUser('You must enter an address.');
				}
				self.geocoder.geocodeAddress(address, self.cb); // validate address
			};

			this.cb = function (results, status) {
				if (status === gmaps.GeocoderStatus.OK) {
					return self.checkResults(results);
				}
			};

			this.checkResults = function (results) {
				if (results.length >= 1) {
					self.form.alertUser('Did you mean:');
					results.forEach(self.makeAddrList);
				} else {
					self.form.alertUser('We could not find that location - try entering a more specific place.');
				}
			};

			this.makeAddrList = function (x) {
				return new self.form.item(x, x.formatted_address);
			};

			this.setDemo = (function () {
				self.makeMtpList(self.meetup.initialData);
			})();
		};
		ko.applyBindings(new ViewModel());
	});
