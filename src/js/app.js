if(typeof $ == 'undefined') {
	console.log('jQuery required!');
}

import ItunesWidget from './Widget';

// Extend JQuery fn for $('.class').itunesWidget()
$.fn.itunesWidget = function(options) {
	return this.each(function() {
		(new ItunesWidget(this, options));
	});
};