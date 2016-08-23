define(['knockout'], function(ko) {
	'use strict';
	/**
	 * @description Creates form object
	 * @constructor
	 * @returns {object}
	 */
	var Form = function() {
		var self = this;
		this.radius = ko.observable();
		this.address = ko.observable();
		this.alert = ko.observable();
		this.list = ko.observableArray([]);
		/**
		 * @description Creates new address list item
		 * @constructor
		 * @param {object} x - data returned from the geocoder
		 * @param {string} addr - address
		 * @returns {object}
		 */
		this.Item = function(x, addr) {
			this.place = x;
			this.addr = ko.observable(addr);
			self.list.push(this);
		};
	};
	/**
	 * @description Displays a message to the user
	 * @param {string} text - message content
	 */
	Form.prototype.alertUser = function(text) {
		this.alert(text);
	};

	return Form;
});
