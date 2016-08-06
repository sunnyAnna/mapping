var map, marker, infowindow, circle, geocoder, jso;

var model = {
	init: function () {},
	mapData: {
		newMarker: function () {
			marker = new google.maps.Marker({
				position: map.center,
				map: map,
				//animation: DROP,
				title: 'you are here'
			});
		},
		newInfoWindow: function () {
			infowindow = new google.maps.InfoWindow({
				content: ''
			});
		},
		newCircle: function () {
			circle = new google.maps.Circle({
				center: map.center,
				map: map,
				radius: ViewModel.radius() * 1609.34,
				fillColor: '#fff',
				fillOpacity: 0.5
			});
		},
		stylesArray: [
			{
				"elementType": "labels",
				"stylers": [
					{
						"visibility": "off"
						}
					]
				},
			{
				"elementType": "geometry",
				"stylers": [
					{
						"visibility": "off"
						}
					]
				},
			{
				"featureType": "road",
				"elementType": "geometry",
				"stylers": [
					{
						"visibility": "on"
						},
					{
						"color": "#000000"
						}
					]
				},
			{
				"featureType": "landscape",
				"stylers": [
					{
						"color": "#ffffff"
						},
					{
						"visibility": "on"
						}
					]
				}
			]
	}
}


var ViewModel = {
	radius: ko.observable(2),
	address: ko.observable(''),
	zip: 94939,
	info: ko.observable(''),
	item: function (x) {
		this.addr = ko.observable(x);
	},
	addressList: ko.observableArray([]),
	meetupList: ko.observableArray([]),
	meetupGroup: function (data) {
		this.eventName = title;
		this.eventUrl = url;
		this.groupName = name;
		this.groupPhoto = photo;
		this.venue = venue;
		this.yesRsvpCount = rsvp;
	},
	init: function () {
		model.init();
		MapView.init();
		//meetup.init();
		ViewModel.addEventListeners();
	},
	createMarker: function () {
		return model.mapData.newMarker();
	},
	createCircle: function () {
		return model.mapData.newCircle();
	},
	createInfoWindow: function () {
		return model.mapData.newInfoWindow();
	},
	findAddress: function () {
		return geocoderView.geocodeAddress();
	},
	findZipCode: function (arr) {
		arr.forEach(function (x) {
			if (x.types[0] === "postal_code") {
				return ViewModel.zip = x.short_name;
			}
		});
	},
	addEventListeners: function () {
		marker.onclick = function (e) {
			e.preventDefault();
			infowindow.open(map, marker);
			meetup.init();
		}
	},
	makeList: function (x) {
		ViewModel.addressList.push(new ViewModel.item(x.formatted_address));
	},
	setAddress: function (y) {
		ViewModel.address(y.addr());
		ViewModel.findAddress();
	},
	clearList: function () {
		ViewModel.info('');
		ViewModel.addressList([]);
	},
	updatePosition: function (elem) {
		switch (elem) {
		case 'marker':
			marker.setOptions({
				position: map.center
			});
			break;
		case 'circle':
			circle.setOptions({
				center: map.center
			});
		}
	},
	updateCircle: function () {
		circle.setOptions({
			radius: ViewModel.radius() * 1609.34
		});
	},
	getAttractions: function () {
		return meetup.init();
	}
}


var meetup = {
	newJso: function () {
		jso = new JSO({
			providerID: "meetup",
			client_id: "at0i8rfnm3p5nqphdjg9acn0hu",
			authorization: "https://secure.meetup.com/oauth2/authorize",
			redirect_uri: "http://127.0.0.1:59198/neighborhood-map/index.html",
			response_type: "token"
		});
	},
	APIcall: function () {
		var url = "https://api.meetup.com/2/open_events?sign=true&photo-host=public&page=20&zip=" + ViewModel.zip + "&radius=" + ViewModel.radius();
		jso.ajax({
			url: url,
			dataType: 'jsonp',
			jsonCallback: meetup.cb,
			success: function (data) {
				console.log("Success response (meetup):");
				console.log(data);
			},
			failure: function (err) {
				console.log("Error response (meetup):");
				console.log(err);
			}
		});
	},
	tokenRequest: function () {
		jso.getToken(function (token) {
			meetup.APIcall();
		});
	},
	tokenSave: function () {
		jso.callback(window.location.href, meetup.APIcall, jso.providerID);
	},
	init: function () {
		JSO.enablejQuery($);
		meetup.newJso();
		if (!window.location.hash) {
			meetup.tokenRequest();
		}
		meetup.tokenSave();
		meetup.APIcall();
	},
	cb: function () {
		console.log('done');
	},
	getData: function () {

	}
}



var MapView = {
	init: function () {
		map = new google.maps.Map(document.getElementById('map'), {
			center: {
				lat: 37.7749,
				lng: -122.4194
			},
			zoom: 12
		});
		map.setOptions({
			styles: model.mapData.stylesArray
		});
		geocoder = new google.maps.Geocoder();
		ViewModel.createMarker();
		ViewModel.createInfoWindow();
		ViewModel.createCircle();
		//ViewModel.addEventListeners();
	}
}


var geocoderView = {
	geocodeAddress: function () {
		var address = ViewModel.address();
		ViewModel.clearList();
		if (address == '') {
			ViewModel.info('You must enter an address.');
		} else {
			geocoder.geocode({
				address: address
			}, function (results, status) {
				if (status == google.maps.GeocoderStatus.OK && results.length > 1) {
					ViewModel.info('Did you mean:');
					results.forEach(ViewModel.makeList);
				} else if (status == google.maps.GeocoderStatus.OK) {
					map.setCenter(results[0].geometry.location);
					ViewModel.findZipCode(results[0].address_components);
					ViewModel.updatePosition('marker');
					ViewModel.updatePosition('circle');
					ViewModel.updateCircle();
					ViewModel.getAttractions();
				} else {
					ViewModel.info('We could not find that location - try entering a more specific place.');
				}
			});
		}
	}
}

ko.applyBindings(ViewModel);

function generator() {
	//localStorage.clear();
	ViewModel.init();
};
