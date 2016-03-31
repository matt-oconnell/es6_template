import config from './config';
import Service from './Service';
const Mustache = require('./libs/mustache');

class RecipeWidget {

	constructor(el, options) {

		this.el = el;
		this.opts = $.extend(config.options, options);

		// Run multiple promises. Wait for both responses
		Promise.all([
			Service.get(this.opts.endpoints[this.opts.env], null, this.opts.proxy),
			Service.get(`templates/${this.opts.template}.hbs`)
		]).then((responses) => {
			const template = responses[1];
			const data = RecipeWidget.mapData(responses[0]);
			const tmpl = Mustache.render(template, data);
			this.build(tmpl);
		}).catch((e) => {
			console.log('Error', e.responseText);
		});
	}

	// Append to $.selector
	build(template) {
		const $tmp = $(template);
		$(this.el).append($tmp);
	}

	// Convert raw API data to template-friendly object
	static mapData(raw) {
		let json = JSON.parse(raw);
		let data = json.results[0];
		return {
			developer: data.artistName,
			price: data.formattedPrice,
			name: data.trackName
		};
	}
}

export default RecipeWidget;