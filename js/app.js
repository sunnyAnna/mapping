var map, marker, infowindow, geocoder;
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
			styles: MapView.stylesArray
		});
		geocoder = new google.maps.Geocoder();
		MapView.newMarker();
	},
	newMarker: function () {
		marker = new google.maps.Marker({
			position: map.center,
			map: map,
			title: 'you are here'
		});
	},
	newInfoWindow: function () {
		infowindow = new google.maps.InfoWindow({
			content: ''
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


var model = {
	init: function () {
		this.address = document.getElementById('address');
		this.message = document.getElementById('message');
		this.addresses = document.getElementById('addresses');
		this.submit = document.getElementById('submit');
	}
}


var ViewModel = {
	init: function () {
		model.init();
		MapView.init();
		ViewModel.addEventListeners();
	},
	findAddress: function () {
		return geocoderView.geocodeAddress();
	},
	addEventListeners: function () {
		model.submit.onclick = function (e) {
			e.preventDefault();
			ViewModel.findAddress();
		};
		marker.onclick = function (e) {
			e.preventDefault();
			infowindow.open(map, marker);
		}
	},
	changeAddress: function (x) {
		model.address.value = x.textContent;
		ViewModel.findAddress();
	},
	displayResults: function (x) {
		var li = document.createElement('li');
		li.onclick = function (e) {
			e.preventDefault();
			ViewModel.changeAddress(li);
		}
		li.textContent = x.formatted_address;
		model.addresses.appendChild(li);
	}
}



var geocoderView = {
	geocodeAddress: function () {
		var address = model.address.value;
		if (address == '') {
			model.message.textContent = 'You must enter an area, or address.';
		} else {
			geocoder.geocode({
				address: address
			}, function (results, status) {
				if (status == google.maps.GeocoderStatus.OK && results.length > 1) {
					model.message.textContent = 'Did you mean:';
					results.forEach(ViewModel.displayResults);
				} else if (status == google.maps.GeocoderStatus.OK) {
					geocoderView.resetAddressInfo();
					map.setCenter(results[0].geometry.location);
					MapView.newMarker();
				} else {
					model.message.textContent = 'We could not find that location - try entering a more' + ' specific place.';
				}
			});
		}
	},
	resetAddressInfo: function () {
		model.message.textContent = '';
		model.addresses.innerHTML = '';
	}
}

function start() {
	ViewModel.init();
}


//OAuth.initialize('UxD0Z5qqLISGMYhh-RhlLw');
