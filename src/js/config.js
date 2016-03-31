const config = {
	options: {
		search: 'spotify',
		media: 'all',
		proxy: 'proxy.php',
		template: 'template1',
		endpoints: {
			development: 'src/js/data/service-shim.json',
			production: 'http://itunes.apple.com/search?'
			// 'http://itunes.apple.com/lookup?id=400274934'
		},
		env: 'production'
	}
};

export default config;