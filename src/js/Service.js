class Service {

	/*
	todo: caching, proxy
	 */
	constructor() {
		this.cache = {};
		this.proxy = '';
	}

	static get(url, data = null, dataType = 'html', proxy = null) {
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