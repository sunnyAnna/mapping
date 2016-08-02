var map, marker, infowindow, circle, geocoder;

var model = {
	init: function () {
		this.address = document.getElementById('address');
		this.message = document.getElementById('message');
		this.addresses = document.getElementById('addresses');
		this.submit = document.getElementById('submit');
		this.range = document.getElementById('range');
	},
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
				radius: model.range.value * 1609.34,
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
	},
	formData: {
		mile: 1609.34,
		radius: 5
	},
	updateMarker: function (action) {
		switch (action) {
		case 'position':
			marker.setOptions({
				position: map.center
			});
			break;
		}
	},
	updateCircle: function (action) {
		switch (action) {
		case 'radius':
			var val = model.range.value * 1609.34;
			circle.setOptions({
				radius: val
			});
			break;
		case 'position':
			circle.setOptions({
				center: map.center
			});
		}
	}
}


var meetup = {
	init: function () {
		JSO.enablejQuery($);
		var jso = new JSO({
			providerID: "meetup",
			client_id: "v7k7eb2btu206qupdl7tch34di",
			authorization: "https://secure.meetup.com/oauth2/authorize",
			redirect_uri: "https://sunnyanna.github.io/mapping/",
			response_type: "token"
		});
		var url = "https://api.meetup.com/2/open_events?&sign=true&photo-host=public&zip=94939&page=20";
		jso.ajax({
			url: url,
			dataType: 'jsonp',
			success: function (data) {
				console.log("Success response (meetup):");
				console.log(data);
			},
			failure: function (err) {
				console.log("Error response (meetup):");
				console.log(err);
			}
		});
		jso.callback(url, meetup.cb, jso.providerID);
	},
	cb: function () {
		console.log('callback!');
	},
	getData: function () {

	}
}


var ViewModel = {
	init: function () {
		model.init();
		MapView.init();
		ViewModel.addEventListeners();
	},
	createMarker: function () {
		return model.mapData.newMarker();
	},
	createCircle: function (num) {
		return model.mapData.newCircle();
	},
	createInfoWindow: function () {
		return model.mapData.newInfoWindow();
	},
	findAddress: function () {
		return geocoderView.geocodeAddress();
	},
	addEventListeners: function () {
		model.submit.onclick = function (e) {
			e.preventDefault();
			ViewModel.findAddress();
		};
		model.range.onclick = function (e) {
			e.preventDefault();
			var attr = 'radius';
			ViewModel.updateCircle(attr);
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
	},
	updateCircle: function (attr) {
		return model.updateCircle(attr);
	},
	updateMarker: function (attr) {
		return model.updateMarker(attr);
	},
	getAttractions: function () {
		return meetup.init();
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
		ViewModel.addEventListeners();
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
					ViewModel.updateMarker('position');
					ViewModel.updateCircle('position');
					ViewModel.getAttractions();
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
