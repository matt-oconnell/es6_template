/**
 * Service responsible for fetching files asynchronously
 *
 * @class Service
 */
class Service {

	/*
	todo
	 */
	constructor() {
		this.cache = {};
		this.proxy = '';
	}

	/**
	 * Makes an HTTP GET request
	 *
	 * @method get
	 * @param {String} url
	 * @param {Object|null} data | Query parameters
	 * @param {String} proxy | Server-side proxy that will forward our request
	 * @param {String} dataType | Datatype we are expecting to recieve
	 * @returns {Object.<XMLHttpRequest>} | response from url
	 */
	static get(url, data = null, proxy = null, dataType = 'text') {
		if(proxy) {
			data = {
				url: url + $.param(data)
			};
			url = proxy;
		}
		return $.ajax({
			url: url,
			method: 'get',
			data: data,
			dataType: dataType
		}).fail((e) => {
			console.log('Get failed: ', e.responseText);
		});
	}

}

export default Service;