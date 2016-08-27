define(['oauth2', 'jquery', 'knockout'], function (JSO, $, ko) {
	'use strict';
	/**
	 * @description Creates meetup object
	 * @constructor
	 * @returns {object}
	 */
	var Meetup = function () {
		var self = this;
		this.activeMeetup = {};
		this.radius = ko.observable();
		this.list = ko.observableArray([]);
		this.visibleMeetups = ko.observable(false);
		this.info = ko.observable('meetup details:');
		this.userAlerts = {
			totalCount: ko.pureComputed(function () {
				return '<h4>We found <span class="meetup-count">' + self.list().length + '</span> upcoming meetups within 5mi of this address.</h4><p>Use the radius slider to filter them by the distance.</p>';
			}),
			noFound: ko.observable('<h4>No upcoming meetups within 5mi of this address.</h4>'),
			listing: ko.pureComputed(function () {
				var k = self.visibleMeetups() === true ? 'Below are the meetups ' : 'There are no upcoming meetups ';
				return '<h4>' + k + '<span>within ' + self.radius() + 'mi</span>.</h4>';
			})
		};
		this.dateOptions = {
			date: {
				weekday: 'short',
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			},
			hour: {
				hour: 'numeric',
				minute: 'numeric'
			}
		};
		/**
		 * @description Creates a meetup group
		 * @constructor
		 * @param {object} data - data returned from the Meetup API
		 * @returns {object}
		 */
		this.Group = function (data) {
			this.eventName = ko.observable(data.name);
			this.rsvp = ko.observable('<span class="fontsy">Current RSVP count: </span>' + data.yes_rsvp_count);
			this.url = ko.observable(data.event_url);
			this.groupName = ko.observable(data.group.name);
			this.time = new Date(data.time);
			this.date = ko.computed(function () {
				var d = this.time;
				var date = d.toLocaleString(navigator.language, self.dateOptions.date);
				return '<span class="fontsy">Date: </span>' + date;
			}, this);
			this.hour = ko.computed(function () {
				var d = this.time;
				var hour = d.toLocaleTimeString(navigator.language, self.dateOptions.hour);
				return '<span class="fontsy">Time: </span>' + hour;
			}, this);
			this.details = ko.observable(false);
			this.visibility = ko.observable(false);
			this.distance = ko.observable(data.distance);
			this.lat = data.venue ? data.venue.lat : data.group.group_lat;
			this.lon = data.venue ? data.venue.lon : data.group.group_lon;
			this.venue = {
				lat: this.lat,
				lng: this.lon
			};
			self.list.push(this);
		};
		this.initialData = [{
			name: 'The 6th Annual Noe Valley Wine Walk',
			yes_rsvp_count: 5,
			event_url: 'http://www.meetup.com/The-San-Francisco-Grapevine-A-Food-and-Wine-Group/events/232252890/',
			distance: 1.1813266277313232,
			time: 1471831200000,
			venue: {
				lat: 37.779998779296875,
				lon: -122.44000244140625
			},
			group: {
				name: 'The San Francisco Grapevine (A Food and Wine Group)'
			}
		}, {
			name: 'Belly Dance Class, Clothing Exchange and Tea!',
			yes_rsvp_count: 3,
			event_url: 'http://www.meetup.com/SF-Belly-Dancers-Unite/events/233047221/',
			distance: 1.7762826681137085,
			time: 1472003100000,
			venue: {
				lat: 37.766914,
				lon: -122.450249
			},
			group: {
				name: 'SF Belly Dancers Unite'
			}
		}, {
			name: 'Mahjong Open Play at Kabuki Theater - American and Chinese styles',
			yes_rsvp_count: 3,
			event_url: 'http://www.meetup.com/bamahjong/events/233038636/',
			distance: 1.0231155157089233,
			time: 1471631400000,
			venue: {
				lat: 37.785225,
				lon: -122.432785
			},
			group: {
				name: 'Bay Area Mahjong Meetup'
			}
		}, {
			name: 'QUICK DRAW SF #27: Pokemon Gotta Catch them All',
			yes_rsvp_count: 15,
			event_url: 'http://www.meetup.com/Quick-Draw-SF-and-Bar-Sketching-meetup/events/233373829/',
			distance: 1.5113157033920288,
			time: 1471715100000,
			venue: {
				lat: 37.775295,
				lon: -122.410072
			},
			group: {
				name: 'Quick Draw SF and Bar Sketching meetup'
			}
		}, {
			name: 'Fearless: SF Artist in Residence Orly Ruaimi Gallery Exhibition',
			yes_rsvp_count: 8,
			event_url: 'http://www.meetup.com/TechShop/events/232926740/',
			distance: 1.856641948223114,
			time: 1471918500000,
			venue: {
				lat: 37.781185,
				lon: -122.405922
			},
			group: {
				name: 'TechShop San Francisco'
			}
		}];
	};
	/**
	 * @description Creates oauth object
	 */
	var jso = new JSO({
		providerID: "meetup",
		client_id: "v7k7eb2btu206qupdl7tch34di",
		authorization: "https://secure.meetup.com/oauth2/authorize",
		redirect_uri: "https://sunnyanna.github.io/meetups_map/",
		response_type: "token"
	});
	JSO.enablejQuery($);

	/**
	 * @description Sends authorization request. Requests token and saves it.
	 */
	Meetup.prototype.init = function () {
		if (!window.location.hash) {
			jso.getToken(function (token) {});
		}
		jso.callback(window.location.href, Meetup.prototype.APIcall, jso.providerID);
	};
	/**
	 * @description Meetup API call
	 */
	Meetup.prototype.APIcall = function (lat, lon, radius, callback_1, callback_2) {
		var url = "https://api.meetup.com/2/open_events?sign=true&photo-host=public&page=20&lat=" + lat + "&lon=" + lon + "&radius=" + radius;
		jso.ajax({
			url: url,
			dataType: 'jsonp',
			success: function (data) {
				if (callback_1) {
					return callback_1(data.results);
				}
			},
			failure: function (err) {
				if (callback_2) {
					return callback_2('Error in Meetup search. Please try again.');
				}
			}
		});
	};
	/**
	 * @description Toggles visibility of the meetup's marker and list tab view
	 */
	Meetup.prototype.toggleMeetup = function (group) {
		if (self.activeMeetup && group !== self.activeMeetup) {
			self.activeMeetup.details(false);
		}
		group.details(group.marker.active);
		self.activeMeetup = group;
	};

	return Meetup;
});
