class Service {

	/*
	todo: caching, proxy
	 */
	constructor() {
		this.cache = {};
		this.proxy = '';
	}

	static get(url, data = null, proxy = null, dataType = 'text') {
		if(proxy) {
			data = {
				url: url
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