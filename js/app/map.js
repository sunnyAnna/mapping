define(['gmaps'], function (gmaps) {
	'use strict';
	var Map = function () {
		var self = this;
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
		this.map = new gmaps.Map(document.getElementById('map'), {
			center: {
				lat: 37.7749,
				lng: -122.4194
			},
			zoom: 12,
			styles: self.stylesArray
		});
		this.circle = new gmaps.Circle({
			center: self.map.center,
			map: self.map,
			radius: 1609.34,
			fillColor: '#fff',
			fillOpacity: 0.5
		});
		this.Icon = function (scale, strokeColor, strokeWeight, name) {
			this.path = google.maps.SymbolPath.CIRCLE;
			this.scale = scale;
			this.strokeColor = strokeColor;
			this.strokeWeight = strokeWeight;
		};
		this.staticIcon = new self.Icon(5, 'gold', 7);
		this.activeIcon = new self.Icon(7, 'red', 10);

		this.makeMarker = function (pos, map, title, ic) {
			var icon = ic || self.staticIcon,
				marker = new gmaps.Marker({
					position: pos,
					map: map,
					animation: google.maps.Animation.DROP,
					icon: icon,
					title: title
				});
			marker.active = false;
			marker.addListener('click', function () {
				self.toggleMarker(this);
			});
			return marker;
		};

		this.mainMarker = self.makeMarker(self.map.center, self.map, 'you are here', '\uf001');
		this.activeMarker;
		this.toggleMarker = function (marker) {
			if (marker !== self.activeMarker) {
				self.activeMarker_deactivate();
			}
			if (marker.active === false) {
				marker.active = true;
				self.toggleIcon(marker);
				self.updateInfoWindow(marker);
				self.infoWindow.open(self.map, marker);
			} else {
				marker.active = false;
				self.toggleIcon(marker);
				self.infoWindow.close();
			}
			self.activeMarker = marker;
		};

		this.activeMarker_deactivate = function () {
			if (self.activeMarker) {
				self.activeMarker.active = false;
				self.toggleIcon(self.activeMarker);
				self.infoWindow.close();
			}
		};

		this.toggleIcon = function (marker) {
			if (marker !== self.mainMarker) {
				var icon = marker.active === false ? self.staticIcon : self.activeIcon;
				marker.setIcon(icon);
			}
		};

		this.infoWindow = new gmaps.InfoWindow();
		this.infoWindow.addListener('closeclick', function () {
			self.toggleMarker(self.activeMarker);
		});
		this.updateInfoWindow = function (marker) {
			self.infoWindow.setOptions({
				content: marker.title,
				position: marker.position
			});
		};

		this.updatePosition = function (elem) {
			switch (elem) {
			case 'marker':
				self.mainMarker.setPosition(self.map.center);
				break;
			case 'circle':
				self.circle.setCenter(self.map.center);
				break;
			}
		};

		this.updateCircleRadius = function (radius) {
			self.circle.setRadius(radius * 1609.34);
		};

		this.updateVisibility = function (elem, distance, border) {
			if (distance < border) {
				elem.marker.setVisible(true);
				return true;
			} else {
				elem.marker.setVisible(false);
				return false;
			}
		};

		this.updateMap = function (map, radius) {
			self.map = map;
			self.updatePosition('marker');
			self.updatePosition('circle');
			self.updateCircleRadius(radius);
		};
	};
	return Map;
});
