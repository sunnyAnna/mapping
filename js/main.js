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
	function(Meetup, Form, Map, ko, gmaps, Geocoder) {
		/**
		 * @description Creates WiewModel
		 * @constructor
		 * @returns {object}
		 */
		var ViewModel = function() {
			var self = this;
			this.meetup = new Meetup();
			this.meetup.init();
			this.form = new Form();
			this.meetup = new Meetup();
			this.geo = new Map();
			this.geocoder = new Geocoder();
			this.callMade = ko.observable(false);
			/**
			 * @description Changes visibility of the meetup groups on the map and the list.
			 */
			this.updateMeetupMap = function() {
				var radius = self.form.radius(),
					list = self.meetup.list();
				self.meetup.radius(radius);
				self.geo.updateCircleRadius(radius);
				self.geo.activeMarker_deactivate();
				self.meetup.visibleMeetups(false);
				if (list) {
					list.forEach(function(group) {
						self.setVisibility(group);
						group.details(false);
					});
				}
				return true;
			};
			/**
			 * @description Toggles visibility of the meetup group and its marker.
			 */
			this.toggleVisibility = function(x) {
				self.geo.toggleMarker(x.marker);
				self.meetup.toggleMeetup(x);
			};
			/**
			 * @description Assigns new map coordinates and calls meetup API.
			 * @param {object} y - geocoded address
			 */
			this.setAddress = function(y) {
				self.clear();
				self.form.address(y.addr());
				var center = y.place.geometry.location;
				self.geo.map.setCenter(center);
				self.geo.updateMap(self.geo.map, self.form.radius());
				self.getAttractions(center);
			};
			/**
			 * @description Empties the address input field
			 */
			this.clearField = function() {
				self.form.address('');
			};
			/**
			 * @description Empties the address and meetup lists, removes markers and user alerts.
			 */
			this.clear = function() {
				self.callMade(false);
				self.form.alertUser('');
				self.form.list([]);
				var list = self.meetup.list();
				list.forEach(function(group) {
					group.marker.setMap(null);
				});
				self.meetup.list([]);
			};
			/**
			 * @description Calls meetup API.
			 * @param {object} center - latlng coordinates
			 */
			this.getAttractions = function(center) {
				self.meetup.APIcall(center.lat(), center.lng(), 5, self.makeMtpList, self.form.alertUser);
			};
			/**
			 * @description Creates new meetup groups
			 * @param {object} data - geocoder result
			 * @returns {object}
			 */
			this.makeMtpList = function(data) {
				if (data) {
					data.forEach(function(result) {
						var group = new self.meetup.Group(result);
						group.marker = self.geo.makeMarker(group.venue, self.geo.map, group.eventName());
						self.setVisibility(group);
						return group;
					});
				}
				self.callMade(true);
			};
			/**
			 * @description Changes visibility of the meetup group
			 * @param {object} group - meetup group
			 */
			this.setVisibility = function(group) {
				group.visibility(self.geo.updateVisibility(group, group.distance(), self.form.radius()));
				if (self.meetup.visibleMeetups() === false && group.visibility() === true) {
					self.meetup.visibleMeetups(true);
				}
			};
			/**
			 * @description Calls Google Maps API. Valides user input in the address input field.
			 */
			this.findAddress = function() {
				self.clear();
				var address = self.form.address();
				if (address === '') {
					return self.form.alertUser('You must enter an address.');
				}
				self.geocoder.geocodeAddress(address, self.cb);
			};
			/**
			 * @description Validates geocoder response and calls checkResults() function.
			 * @param {object} results - data returned from geocoder
			 * @param {string} status
			 * @returns {function}
			 */
			this.cb = function(results, status) {
				if (status === gmaps.GeocoderStatus.OK) {
					return self.checkResults(results);
				}
			};
			/**
			 * @description Creates address list and alerts user.
			 * @param {object} results - data returned from geocoder
			 */
			this.checkResults = function(results) {
				if (results.length >= 1) {
					self.form.alertUser('Did you mean:');
					results.forEach(self.makeAddrList);
				} else {
					self.form.alertUser('We could not find that location - try entering a more specific place.');
				}
			};
			/**
			 * @description Creates address object
			 * @param {object} x - data returned from geocoder
			 * @returns {object}
			 */
			this.makeAddrList = function(x) {
				return new self.form.Item(x, x.formatted_address);
			};
			/**
			 * @description Assigns initial data to the map.
			 */
			this.setDemo = (function() {
				var x = 1;
				self.form.radius(x);
				self.meetup.radius(x);
				self.form.address('Market St & South Van Ness Ave, San Francisco, CA 94102, USA');
				self.makeMtpList(self.meetup.initialData);
			}());
		};
		/**
		 * @description Applies KnockoutJS bindings
		 */
		ko.applyBindings(new ViewModel());
	});
