var map, marker, infowindow, circle, geocoder, jso;

var MapModel = {
	init: function () {
		map = new google.maps.Map(document.getElementById('map'), {
			center: {
				lat: 37.7749,
				lng: -122.4194
			},
			zoom: 12
		});
		map.setOptions({
			styles: MapModel.stylesArray
		});
		geocoder = new google.maps.Geocoder();
		MapModel.newMarker();
		MapModel.newInfoWindow();
		MapModel.newCircle();
		ViewModel.addEventListeners();
	},
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


var ViewModel = {
	radius: ko.observable(2),
	address: ko.observable(''),
	zip: '',
	info: ko.observable(''),
	item: function (x) {
		this.addr = ko.observable(x);
	},
	addressList: ko.observableArray([]),
	meetupList: ko.observableArray([]),
	meetupGroup: function (data) {
		this.eventName = ko.observable(data.name);
		this.url = ko.observable(data.event_url);
		this.groupName = ko.observable(data.group.name);
		this.venue = {
			street: data.address_1,
			city: data.city,
			state: data.state,
			country: data.country,
			zip: data.zip
		};
		this.imgSrc = '';
	},
	showMoreInfo: function (x) {
		ViewModel.meetupInfo(x)
	},
	meetupInfo: ko.observable(),
	findAddress: function () {
		return geocoderView.geocodeAddress();
	},
	findZipCode: function (arr) {
		arr.forEach(function (x) {
			if (x.types[0] === "postal_code") {
				ViewModel.zip = x.short_name;
				ViewModel.updatePosition('marker');
				ViewModel.updatePosition('circle');
				ViewModel.updateCircle();
				ViewModel.getAttractions();
				return;
			}
		});

	},
	addEventListeners: function () {
		marker.onclick = function (e) {
			e.preventDefault();
			infowindow.open(map, marker);
		}
	},
	makeAddrList: function (x) {
		ViewModel.addressList.push(new ViewModel.item(x.formatted_address));
	},
	makeMtpList: function (x) {
		ViewModel.meetupList.push(new ViewModel.meetupGroup(x));
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
			break;
		}
	},
	updateCircle: function () {
		circle.setOptions({
			radius: ViewModel.radius() * 1609.34
		});
	},
	getAttractions: function () {
		return meetup.APIcall();
	}
}


var meetup = {
	init: function () {
		JSO.enablejQuery($);
		meetup.newJso();
		if (!window.location.hash) {
			meetup.tokenRequest();
		}
		meetup.tokenSave();
		//meetup.APIcall();
	},
	newJso: function () {
		jso = new JSO({
			providerID: "meetup",
			client_id: "at0i8rfnm3p5nqphdjg9acn0hu",
			authorization: "https://secure.meetup.com/oauth2/authorize",
			redirect_uri: "http://127.0.0.1:60535/neighborhood-map/index.html",
			response_type: "token"
		});
	},
	APIcall: function () {
		var url = "https://api.meetup.com/2/open_events?sign=true&photo-host=public&page=20&zip=" + ViewModel.zip + "&radius=" + ViewModel.radius();
		jso.ajax({
			url: url,
			dataType: 'jsonp',
			success: function (data) {
				console.log("Success response (meetup):");
				meetup.cb(data);
			},
			failure: function (err) {
				console.log("Error response (meetup):");
				console.log(err);
			}
		});
	},
	tokenRequest: function () {
		jso.getToken(function (token) {
			//meetup.APIcall();
		});
	},
	tokenSave: function () {
		jso.callback(window.location.href, meetup.APIcall, jso.providerID);
	},
	cb: function (data) {
		console.log(data);
		var results = data.results;
		results.forEach(ViewModel.makeMtpList);
	},
	getData: function () {

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
					results.forEach(ViewModel.makeAddrList);
				} else if (status == google.maps.GeocoderStatus.OK) {
					map.setCenter(results[0].geometry.location);
					ViewModel.findZipCode(results[0].address_components);
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
	meetup.init();
	MapModel.init();
};
