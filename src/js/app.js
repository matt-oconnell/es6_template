import Widget from './Widget';

if(typeof $ == 'undefined') {
	console.log('Zepto or JQuery required!');
}

$(document).ready(function() {
	$('body').css('color', 'blue');
});

const testWidget = new Widget('test');
testWidget.sayName();