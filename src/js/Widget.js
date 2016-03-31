import config from './config';
import Service from './Service';
const Mustache = require('./libs/mustache');

class ItunesWidget {

	constructor(el, options) {
		this.el = el;
		this.configure(options);
		this.core();
	}

	configure(options) {
		this.opts = $.extend(config.options, options);
		this.endpoint = this.endpoint();
		this.params = this.params();
		this.proxy = this.proxy();
		this.template = this.template();
	}

	core() {
		Promise.all([
			// Get data from API
			Service.get(this.endpoint, this.params, this.proxy),
			// Get template
			Service.get(this.template)
			// Wait for both responses
		]).then((responses) => {
			const data = ItunesWidget.mapData(responses[0]);
			const template = responses[1];
			const tmpl = Mustache.render(template, data);
			this.build(tmpl);
		}).catch((e) => {
			console.log('Error', e);
		});
	}

	template() {
		return `templates/${this.opts.template}.hbs`;
	}

	proxy() {
		var ret = null;
		if(this.opts.env != 'dev') {
			ret = this.opts.proxy;
		}
		return ret;
	}

	endpoint() {
		return this.opts.endpoints[this.opts.env];
	}

	params() {
		return {
			term: this.opts.search,
			media: this.opts.media
		};
	}

	// Append to $.selector
	build(template) {
		const $tmp = $(template);
		$(this.el).append($tmp);
	}

	// Convert raw API data to template-friendly object
	static mapData(raw) {
		let json = JSON.parse(raw);
		let results = json.results;
		let data = [];
		results.forEach((d) => {
			data.push({
				img: {
					small: d.artworkUrl60,
					medium: d.artworkUrl100,
					large: d.artworkUrl512
				},
				developer: {
					name: d.artistName,
					url: d.sellerUrl
				},
				price: d.formattedPrice,
				name: d.trackName,
				url: d.trackViewUrl,
				description: d.description,
				rating: {
					average: d.averageUserRating,
					count: d.userRatingCount
				}
			})
		});
		console.log(111, data);
		return {data: data};
	}
}

export default ItunesWidget;