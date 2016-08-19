define(['oauth2', 'jquery', 'knockout'], function (JSO, $, ko) {

	var Meetup = function () {
		var self = this;
		this.list = ko.observableArray([]);
		this.activeMeetup;
		this.header = ko.observable();
		this.info = ko.observable('meetup details:');
		this.group = function (data) {
			this.eventName = ko.observable(data.name);
			this.rsvp = ko.observable(data.yes_rsvp_count);
			this.url = ko.observable(data.event_url);
			this.groupName = ko.observable(data.group.name);
			this.details = ko.observable(false);
			this.distance = ko.observable(data.distance);
			this.lat = data.venue ? data.venue.lat : data.group.group_lat;
			this.lon = data.venue ? data.venue.lon : data.group.group_lon;
			this.venue = {
				lat: this.lat,
				lng: this.lon
			};
			self.list.push(this);
		};
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
		//meetup.APIcall();
	};

	/* meetup info request */
	Meetup.prototype.APIcall = function (lat, lon, radius, callback_1, callback_2) {
		var url = "https://api.meetup.com/2/open_events?sign=true&photo-host=public&page=20&lat=" + lat + "&lon=" + lon + "&radius=" + radius;
		jso.ajax({
			url: url,
			dataType: 'jsonp',
			success: function (data) {
				if (callback_1) {
					return callback_1(data);
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

	Meetup.prototype.informUser = function (text) {
		this.header(text);
	};

	return Meetup;
});
