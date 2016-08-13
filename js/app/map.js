define(['gmaps'], function (gmaps) {

	var Map = function () {
		var self = this;
		this.map = new gmaps.Map(document.getElementById('map'), {
			center: {
				lat: 37.7749,
				lng: -122.4194
			},
			zoom: 12
		});
		this.marker = new gmaps.Marker({
			position: self.map.center,
			map: self.map,
			animation: 'DROP',
			title: 'you are here'
		});
		this.infoWindow = new gmaps.InfoWindow({
			content: ''
		});
		this.circle = new gmaps.Circle({
			center: this.map.center,
			map: this.map,
			radius: 1609.34,
			fillColor: '#fff',
			fillOpacity: 0.5
		});
		this.stylesArray = [
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
			];
		this.markerList = [];
	};

	/*map.setOptions({
		styles: Map.stylesArray
	});

	Map.marker.onclick = function (e) {
		e.preventDefault();
		Map.infowindow.open(Map.map, Map.marker);
	};*/

	return Map;
});
