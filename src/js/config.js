const config = {
	options: {
		search: 'healthy',
		key: null,
		serverSideScript: '../curl.php',
		imgProxy: null,
		template: 'template1',
		endpoints: {
			development: 'src/js/data/service-shim.json',
			production: 'http://itunes.apple.com/lookup?id=400274934'
		},
		env: 'production'
	}
};

export default config;