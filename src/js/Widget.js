import config from './config';
import Template from './Template';
import Service from './Service';

class RecipeWidget {

	constructor(el, options) {

		this.el = el;
		this.options = $.extend(config.options, options);
		this.template = new Template;

		// Run multiple promises. Wait to for both responses
		Promise.all([
			this.template.get('template.hbs'),
			Service.get()
		]).then((responses) => {
			let template, data;

			responses.forEach((resp, i) => {
				if(typeof resp == 'string') {
					template = resp;
				} else {
					data = resp;
				}

				if(i == responses.length - 1) {
					let tmpl = Template.populate(template, data);
					this.construct(tmpl);
				}
			});
		});
	}

	construct(template) {
		const $template = $(template);
		$(this.el).append($template);
	}
}

export default RecipeWidget;