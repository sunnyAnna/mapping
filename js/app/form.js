define(['knockout'], function (ko) {

	var Form = function () {
		var self = this;
		this.radius = ko.observable(2);
		this.address = ko.observable('');
		this.zip = '';
		this.info = ko.observable('');
		this.list = ko.observableArray([]);
		this.item = function (x) {
			this.addr = ko.observable(x);
			self.list.push(this);
		};
	};

	Form.prototype.clearList = function () {
		this.info();
		this.list([]);
	};

	Form.prototype.alertUser = function (text) {
		this.info(text);
	};

	return Form;
});
