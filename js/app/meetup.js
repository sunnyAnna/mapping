define(['oauth2', 'jquery', 'knockout'], function (JSO, $, ko) {

	var Meetup = function () {
		var self = this;
		this.list = ko.observableArray([]);
		this.info = ko.observable('');
		this.group = function (data) {
			this.eventName = ko.observable(data.name);
			this.url = ko.observable(data.event_url);
			this.groupName = ko.observable(data.group.name);
			this.imgSrc = '';
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

	/* authorization request */
	Meetup.prototype.init = function () {
		JSO.enablejQuery($);
		if (!window.location.hash) {
			jso.getToken(function (token) { // request token
				//meetup.APIcall();
			});
		}
		jso.callback(window.location.href, Meetup.prototype.APIcall, jso.providerID); // save token
		//meetup.APIcall();
	};

	/* meetup info request */
	Meetup.prototype.APIcall = function (zip, radius, callback) {
		var url = "https://api.meetup.com/2/open_events?sign=true&photo-host=public&page=20&zip=" + zip + "&radius=" + radius;
		jso.ajax({
			url: url,
			dataType: 'jsonp',
			success: function (data) {
				console.log("Success response (meetup):");
				return callback(data);
			},
			failure: function (err) {
				console.log("Error response (meetup):");
				console.log(err);
			}
		});
	};

	Meetup.prototype.clearList = function () {
		this.list([]);
	};



	return Meetup;
});
