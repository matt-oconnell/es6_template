const Mustache = require('./libs/mustache');

class Template {

	constructor() {
		this.cache = {};
	}

	get(file) {
		if(!this.cache[file]) {
			this.cache[file] = $.get('templates/' + file);
		}
		return this.cache[file];
	}

	static populate(template, data) {
		let da = {d: data.results[0].trackName};
		return Mustache.render(template, da);
	}

}

export default Template;