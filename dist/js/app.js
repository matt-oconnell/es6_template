(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Widget = function () {
	function Widget(name) {
		_classCallCheck(this, Widget);

		this.name = name;
	}

	_createClass(Widget, [{
		key: "sayName",
		value: function sayName() {
			console.log("Widget name: " + this.name);
		}
	}]);

	return Widget;
}();

exports.default = Widget;

},{}],2:[function(require,module,exports){
'use strict';

var _Widget = require('./Widget');

var _Widget2 = _interopRequireDefault(_Widget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (typeof $ == 'undefined') {
	console.log('Zepto or JQuery required!');
}

$(document).ready(function () {
	$('body').css('color', 'blue');
});

var testWidget = new _Widget2.default('test');
testWidget.sayName();

},{"./Widget":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvV2lkZ2V0LmpzIiwic3JjL2pzL2FwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7SUNBTTtBQUNMLFVBREssTUFDTCxDQUFZLElBQVosRUFBa0I7d0JBRGIsUUFDYTs7QUFDakIsT0FBSyxJQUFMLEdBQVksSUFBWixDQURpQjtFQUFsQjs7Y0FESzs7NEJBS0s7QUFDVCxXQUFRLEdBQVIsbUJBQTRCLEtBQUssSUFBTCxDQUE1QixDQURTOzs7O1FBTEw7OztrQkFVUzs7Ozs7QUNWZjs7Ozs7O0FBRUEsSUFBRyxPQUFPLENBQVAsSUFBWSxXQUFaLEVBQXlCO0FBQzNCLFNBQVEsR0FBUixDQUFZLDJCQUFaLEVBRDJCO0NBQTVCOztBQUlBLEVBQUUsUUFBRixFQUFZLEtBQVosQ0FBa0IsWUFBVztBQUM1QixHQUFFLE1BQUYsRUFBVSxHQUFWLENBQWMsT0FBZCxFQUF1QixNQUF2QixFQUQ0QjtDQUFYLENBQWxCOztBQUlBLElBQU0sYUFBYSxxQkFBVyxNQUFYLENBQWI7QUFDTixXQUFXLE9BQVgiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiY2xhc3MgV2lkZ2V0IHtcblx0Y29uc3RydWN0b3IobmFtZSkge1xuXHRcdHRoaXMubmFtZSA9IG5hbWU7XG5cdH1cblxuXHRzYXlOYW1lKCkge1xuXHRcdGNvbnNvbGUubG9nKGBXaWRnZXQgbmFtZTogJHt0aGlzLm5hbWV9YCk7XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgV2lkZ2V0OyIsImltcG9ydCBXaWRnZXQgZnJvbSAnLi9XaWRnZXQnO1xuXG5pZih0eXBlb2YgJCA9PSAndW5kZWZpbmVkJykge1xuXHRjb25zb2xlLmxvZygnWmVwdG8gb3IgSlF1ZXJ5IHJlcXVpcmVkIScpO1xufVxuXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcblx0JCgnYm9keScpLmNzcygnY29sb3InLCAnYmx1ZScpO1xufSk7XG5cbmNvbnN0IHRlc3RXaWRnZXQgPSBuZXcgV2lkZ2V0KCd0ZXN0Jyk7XG50ZXN0V2lkZ2V0LnNheU5hbWUoKTsiXX0=
