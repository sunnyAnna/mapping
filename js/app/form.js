define(['knockout'], function (ko) {

	var Form = function () {
		var self = this;
		this.radius = ko.observable(1);
		this.address = ko.observable();
		this.alert = ko.observable();
		this.list = ko.observableArray([]);
		this.item = function (x, addr) {
			this.place = x;
			this.addr = ko.observable(addr);
			self.list.push(this);
		};
	};

	Form.prototype.alertUser = function (text) {
		this.alert(text);
	};

	return Form;
});
