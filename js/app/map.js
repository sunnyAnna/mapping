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
		this.makeMarker = function (pos, map, ic, title) {
			var icon = ic || {
				path: google.maps.SymbolPath.CIRCLE,
				scale: 5,
				fillColor: 'black',
				strokeColor: 'gold',
				strokeWeight: 10
			};
			var marker = new gmaps.Marker({
				position: pos,
				map: map,
				animation: google.maps.Animation.DROP,
				icon: icon,
				title: title
			});
			marker.addListener('click', function () {
				self.updateInfoWindow(this);
				self.infoWindow.open(self.map, this);
			});
			return marker;
		};
		this.marker = self.makeMarker(self.map.center, self.map, 'assets/tweet.png', 'you are here');
		/*this.mtpMarker = function (mtp, map) {
			var marker = new gmaps.Marker({
				position: mtp.venue,
				map: map,
				icon: {
					path: google.maps.SymbolPath.CIRCLE,
					scale: 5,
					fillColor: 'black',
					strokeColor: 'gold',
					strokeWeight: 10
				}
			});
			return marker;
		};*/
		this.infoWindow = new gmaps.InfoWindow();
		this.circle = new gmaps.Circle({
			center: self.map.center,
			map: self.map,
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
		this.updateInfoWindow = function (x) {
			self.infoWindow.setOptions({
				content: x.title,
				position: x.position
			});
		};

		/*map.setOptions({
			styles: Map.stylesArray
		});*/

	};
	return Map;
});
