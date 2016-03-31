if(typeof $ == 'undefined') {
	console.log('jQuery required!');
}

import RecipeWidget from './Widget';

// Extend JQuery fn for $('.class').recipeWidget()
$.fn.recipeWidget = function(options) {
	return this.each(function() {
		(new RecipeWidget(this, options));
	});
};