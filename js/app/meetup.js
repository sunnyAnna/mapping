define(['oauth2', 'jquery', 'knockout'], function (JSO, $, ko) {

	var Meetup = function () {
		var self = this;
		this.list = ko.observableArray([]);
		this.activeMeetup;
		this.totalCount = ko.computed(function () {
			return '<h3>We found ' + this.list().length + ' upcoming meetups within 5mi of this address.</h3><p>Use the radius slider to filter them by the distance from the address.</p>'
		}, this);
		this.noFound = ko.observable('<h3>No upcoming meetups within 5mi of this address.</h3>');
		this.info = ko.observable('meetup details:');
		this.optDate = {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		};
		this.optHr = {
			hour: 'numeric',
			minute: 'numeric'
		};
		this.group = function (data) {
			this.eventName = ko.observable(data.name);
			this.rsvp = ko.observable('Current RSVP count: ' + data.yes_rsvp_count);
			this.url = ko.observable(data.event_url);
			this.groupName = ko.observable(data.group.name);
			this.time = new Date(data.time);
			this.date = ko.computed(function () {
				var d = this.time;
				var date = d.toLocaleString(navigator.language, self.optDate);
				return date;
			}, this);
			this.hour = ko.computed(function () {
				var d = this.time;
				var hour = d.toLocaleTimeString(navigator.language, self.optHr);
				return hour;
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
		},
			{
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
		},
			{
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
		},
			{
				name: 'QUICK DRAW SF #27: Pokemon Gotta Catch them All',
				yes_rsvp_count: 15,
				event_url: 'http://www.meetup.com/Quick-Draw-SF-and-Bar-Sketching-meetup/events/233373829/',
				distance: 3.5113157033920288,
				time: 1471715100000,
				venue: {
					lat: 37.775295,
					lon: -122.410072
				},
				group: {
					name: 'Quick Draw SF and Bar Sketching meetup'
				}
		},
			{
				name: 'Fearless: SF Artist in Residence Orly Ruaimi Gallery Exhibition',
				yes_rsvp_count: 8,
				event_url: 'http://www.meetup.com/TechShop/events/232926740/',
				distance: 2.856641948223114,
				time: 1471918500000,
				venue: {
					lat: 37.781185,
					lon: -122.405922
				},
				group: {
					name: 'TechShop San Francisco'
				}
		}
						   ];
	};

	/* oauth object */
	var jso = new JSO({
		providerID: "meetup",
		client_id: "at0i8rfnm3p5nqphdjg9acn0hu",
		authorization: "https://secure.meetup.com/oauth2/authorize",
		redirect_uri: "http://127.0.0.1:55531/neighborhood-map/index.html",
		response_type: "token"
	});
	JSO.enablejQuery($);

	/* authorization request */
	Meetup.prototype.init = function () {
		if (!window.location.hash) {
			jso.getToken(function (token) { // request token
				//meetup.APIcall();
			});
		}
		jso.callback(window.location.href, Meetup.prototype.APIcall, jso.providerID); // save token
	};

	/* meetup info request */
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

	Meetup.prototype.toggleMeetup = function (group) {
		if (self.activeMeetup && group !== self.activeMeetup) {
			self.activeMeetup.details(false);
		}
		group.details(group.marker.active);
		self.activeMeetup = group;
	};

	return Meetup;
});
