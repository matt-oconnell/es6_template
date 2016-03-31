class Service {

	constructor() {
		this.cache = {};
	}

	static get() {
		return $.getJSON('src/js/data/service-shim.json');
		// return $.getJSON('http://itunes.apple.com/lookup?id=400274934');
	}

}

export default Service;