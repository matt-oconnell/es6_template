(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Service responsible for fetching files asynchronously
 *
 * @class Service
 */

var Service = function () {

	/*
 todo
  */

	function Service() {
		_classCallCheck(this, Service);

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


	_createClass(Service, null, [{
		key: 'get',
		value: function get(url) {
			var data = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
			var proxy = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
			var dataType = arguments.length <= 3 || arguments[3] === undefined ? 'text' : arguments[3];

			if (proxy) {
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
			}).fail(function (e) {
				console.log('Get failed: ', e.responseText);
			});
		}
	}]);

	return Service;
}();

exports.default = Service;

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _Service = require('./Service');

var _Service2 = _interopRequireDefault(_Service);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Mustache = require('./libs/mustache');

/**
 * Main iTunesWidget class
 *
 * @class ItunesWidget
 */

var ItunesWidget = function () {

	/**
  * @constructor
  *
  * @param {Object} el | Current DOM element
  * @param {Object} custom | Custom configuration options
  */

	function ItunesWidget(el, custom) {
		_classCallCheck(this, ItunesWidget);

		this.el = el;
		this.custom = custom;
		this.configure();
		this.core();
	}

	/**
  * Configures current object
  *
  * @method configure
  */


	_createClass(ItunesWidget, [{
		key: 'configure',
		value: function configure() {
			/**
    * @property {Object} config | merges custom options and config.options
    */
			this.config = $.extend(_config2.default, this.custom);
			this.endpoint = this.endpoint();
			this.params = this.params();
			this.proxy = this.proxy();
			this.template = this.template();
		}

		/**
   * Returns API endpoint url
   * References config.env settings
   *
   * @method endpoint
   * @return {String} | endpoint url
   */

	}, {
		key: 'endpoint',
		value: function endpoint() {
			return this.config.endpoints[this.config.env];
		}

		/**
   * Returns API parameters to be passed to .ajax request
   *
   * @method params
   * @return {Object} | API parameters
   */

	}, {
		key: 'params',
		value: function params() {
			return {
				term: this.config.search,
				media: this.config.media
			};
		}

		/*
   * Returns a proxy URL
   * If env != 'dev', use config.proxy
   * else use null
   *
   * @method proxy
   * @return {String|null} | proxy URL
   */

	}, {
		key: 'proxy',
		value: function proxy() {
			var proxy = null;
			if (this.config.env != 'dev') {
				proxy = this.config.proxy;
			}
			return proxy;
		}

		/*
   * Returns a template URL
   *
   * @method template
   * @return {String} | template URL
   */

	}, {
		key: 'template',
		value: function template() {
			return 'templates/' + this.config.template + '.hbs';
		}

		/*
   * Call the API service and template service
   * Populate template with API data
   *
   * @method core
   */

	}, {
		key: 'core',
		value: function core() {
			var _this = this;

			Promise.all([this.getAPIData(), this.getTemplateData()
			// Wait for both responses
			]).then(function (responses) {
				var data = ItunesWidget.formatData(responses[0]);
				var template = responses[1];
				var tmpl = Mustache.render(template, data);
				$(_this.el).append($(tmpl));
			}).catch(function (e) {
				console.log('Error', e);
			});
		}

		/*
   * Gets data from API endpoint
   *
   * @method getAPIData
   * @returns {Object.<XMLHttpRequest>} | API data
   */

	}, {
		key: 'getAPIData',
		value: function getAPIData() {
			return _Service2.default.get(this.endpoint, this.params, this.proxy);
		}

		/*
   * Gets raw template
   *
   * @method getTemplateData
   * @returns {Object.<XMLHttpRequest>} | raw template
   */

	}, {
		key: 'getTemplateData',
		value: function getTemplateData() {
			return _Service2.default.get(this.template);
		}

		/*
   * Maps API data to template-friendly object form
   *
   * @method formatData
   * @param {String} raw | raw JSON-parseable API data
   * @returns {Object} | formatted API data
   */

	}], [{
		key: 'formatData',
		value: function formatData(raw) {
			var json = JSON.parse(raw);
			var results = json.results;
			var data = [];
			results.forEach(function (d) {
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
				});
			});
			return {
				data: data
			};
		}
	}]);

	return ItunesWidget;
}();

exports.default = ItunesWidget;

},{"./Service":1,"./config":4,"./libs/mustache":5}],3:[function(require,module,exports){
'use strict';

var _Widget = require('./Widget');

var _Widget2 = _interopRequireDefault(_Widget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (typeof $ == 'undefined') {
	console.log('jQuery required!');
}

// Extend JQuery fn for $('.class').itunesWidget()
$.fn.itunesWidget = function (options) {
	return this.each(function () {
		new _Widget2.default(this, options);
	});
};

},{"./Widget":2}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
/**
 * Configuration object
 * These can be overridden by custom options passed into the widget
 */
var config = {
	search: 'spotify',
	media: 'software',
	proxy: 'proxy.php',
	template: 'template1',
	endpoints: {
		dev: 'src/js/data/service-shim.json',
		prod: 'https://itunes.apple.com/search?'
		// 'http://itunes.apple.com/lookup?id=400274934'
	},
	env: 'prod'
};

exports.default = config;

},{}],5:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

/*!
 * mustache.js - Logic-less {{mustache}} templates with JavaScript
 * http://github.com/janl/mustache.js
 */

/*global define: false Mustache: true*/

(function defineMustache(global, factory) {
  if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object' && exports && typeof exports.nodeName !== 'string') {
    factory(exports); // CommonJS
  } else if (typeof define === 'function' && define.amd) {
      define(['exports'], factory); // AMD
    } else {
        global.Mustache = {};
        factory(global.Mustache); // script, wsh, asp
      }
})(undefined, function mustacheFactory(mustache) {

  var objectToString = Object.prototype.toString;
  var isArray = Array.isArray || function isArrayPolyfill(object) {
    return objectToString.call(object) === '[object Array]';
  };

  function isFunction(object) {
    return typeof object === 'function';
  }

  /**
   * More correct typeof string handling array
   * which normally returns typeof 'object'
   */
  function typeStr(obj) {
    return isArray(obj) ? 'array' : typeof obj === 'undefined' ? 'undefined' : _typeof(obj);
  }

  function escapeRegExp(string) {
    return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
  }

  /**
   * Null safe way of checking whether or not an object,
   * including its prototype, has a given property
   */
  function hasProperty(obj, propName) {
    return obj != null && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && propName in obj;
  }

  // Workaround for https://issues.apache.org/jira/browse/COUCHDB-577
  // See https://github.com/janl/mustache.js/issues/189
  var regExpTest = RegExp.prototype.test;
  function testRegExp(re, string) {
    return regExpTest.call(re, string);
  }

  var nonSpaceRe = /\S/;
  function isWhitespace(string) {
    return !testRegExp(nonSpaceRe, string);
  }

  var entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };

  function escapeHtml(string) {
    return String(string).replace(/[&<>"'`=\/]/g, function fromEntityMap(s) {
      return entityMap[s];
    });
  }

  var whiteRe = /\s*/;
  var spaceRe = /\s+/;
  var equalsRe = /\s*=/;
  var curlyRe = /\s*\}/;
  var tagRe = /#|\^|\/|>|\{|&|=|!/;

  /**
   * Breaks up the given `template` string into a tree of tokens. If the `tags`
   * argument is given here it must be an array with two string values: the
   * opening and closing tags used in the template (e.g. [ "<%", "%>" ]). Of
   * course, the default is to use mustaches (i.e. mustache.tags).
   *
   * A token is an array with at least 4 elements. The first element is the
   * mustache symbol that was used inside the tag, e.g. "#" or "&". If the tag
   * did not contain a symbol (i.e. {{myValue}}) this element is "name". For
   * all text that appears outside a symbol this element is "text".
   *
   * The second element of a token is its "value". For mustache tags this is
   * whatever else was inside the tag besides the opening symbol. For text tokens
   * this is the text itself.
   *
   * The third and fourth elements of the token are the start and end indices,
   * respectively, of the token in the original template.
   *
   * Tokens that are the root node of a subtree contain two more elements: 1) an
   * array of tokens in the subtree and 2) the index in the original template at
   * which the closing tag for that section begins.
   */
  function parseTemplate(template, tags) {
    if (!template) return [];

    var sections = []; // Stack to hold section tokens
    var tokens = []; // Buffer to hold the tokens
    var spaces = []; // Indices of whitespace tokens on the current line
    var hasTag = false; // Is there a {{tag}} on the current line?
    var nonSpace = false; // Is there a non-space char on the current line?

    // Strips all whitespace tokens array for the current line
    // if there was a {{#tag}} on it and otherwise only space.
    function stripSpace() {
      if (hasTag && !nonSpace) {
        while (spaces.length) {
          delete tokens[spaces.pop()];
        }
      } else {
        spaces = [];
      }

      hasTag = false;
      nonSpace = false;
    }

    var openingTagRe, closingTagRe, closingCurlyRe;
    function compileTags(tagsToCompile) {
      if (typeof tagsToCompile === 'string') tagsToCompile = tagsToCompile.split(spaceRe, 2);

      if (!isArray(tagsToCompile) || tagsToCompile.length !== 2) throw new Error('Invalid tags: ' + tagsToCompile);

      openingTagRe = new RegExp(escapeRegExp(tagsToCompile[0]) + '\\s*');
      closingTagRe = new RegExp('\\s*' + escapeRegExp(tagsToCompile[1]));
      closingCurlyRe = new RegExp('\\s*' + escapeRegExp('}' + tagsToCompile[1]));
    }

    compileTags(tags || mustache.tags);

    var scanner = new Scanner(template);

    var start, type, value, chr, token, openSection;
    while (!scanner.eos()) {
      start = scanner.pos;

      // Match any text between tags.
      value = scanner.scanUntil(openingTagRe);

      if (value) {
        for (var i = 0, valueLength = value.length; i < valueLength; ++i) {
          chr = value.charAt(i);

          if (isWhitespace(chr)) {
            spaces.push(tokens.length);
          } else {
            nonSpace = true;
          }

          tokens.push(['text', chr, start, start + 1]);
          start += 1;

          // Check for whitespace on the current line.
          if (chr === '\n') stripSpace();
        }
      }

      // Match the opening tag.
      if (!scanner.scan(openingTagRe)) break;

      hasTag = true;

      // Get the tag type.
      type = scanner.scan(tagRe) || 'name';
      scanner.scan(whiteRe);

      // Get the tag value.
      if (type === '=') {
        value = scanner.scanUntil(equalsRe);
        scanner.scan(equalsRe);
        scanner.scanUntil(closingTagRe);
      } else if (type === '{') {
        value = scanner.scanUntil(closingCurlyRe);
        scanner.scan(curlyRe);
        scanner.scanUntil(closingTagRe);
        type = '&';
      } else {
        value = scanner.scanUntil(closingTagRe);
      }

      // Match the closing tag.
      if (!scanner.scan(closingTagRe)) throw new Error('Unclosed tag at ' + scanner.pos);

      token = [type, value, start, scanner.pos];
      tokens.push(token);

      if (type === '#' || type === '^') {
        sections.push(token);
      } else if (type === '/') {
        // Check section nesting.
        openSection = sections.pop();

        if (!openSection) throw new Error('Unopened section "' + value + '" at ' + start);

        if (openSection[1] !== value) throw new Error('Unclosed section "' + openSection[1] + '" at ' + start);
      } else if (type === 'name' || type === '{' || type === '&') {
        nonSpace = true;
      } else if (type === '=') {
        // Set the tags for the next time around.
        compileTags(value);
      }
    }

    // Make sure there are no open sections when we're done.
    openSection = sections.pop();

    if (openSection) throw new Error('Unclosed section "' + openSection[1] + '" at ' + scanner.pos);

    return nestTokens(squashTokens(tokens));
  }

  /**
   * Combines the values of consecutive text tokens in the given `tokens` array
   * to a single token.
   */
  function squashTokens(tokens) {
    var squashedTokens = [];

    var token, lastToken;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      token = tokens[i];

      if (token) {
        if (token[0] === 'text' && lastToken && lastToken[0] === 'text') {
          lastToken[1] += token[1];
          lastToken[3] = token[3];
        } else {
          squashedTokens.push(token);
          lastToken = token;
        }
      }
    }

    return squashedTokens;
  }

  /**
   * Forms the given array of `tokens` into a nested tree structure where
   * tokens that represent a section have two additional items: 1) an array of
   * all tokens that appear in that section and 2) the index in the original
   * template that represents the end of that section.
   */
  function nestTokens(tokens) {
    var nestedTokens = [];
    var collector = nestedTokens;
    var sections = [];

    var token, section;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      token = tokens[i];

      switch (token[0]) {
        case '#':
        case '^':
          collector.push(token);
          sections.push(token);
          collector = token[4] = [];
          break;
        case '/':
          section = sections.pop();
          section[5] = token[2];
          collector = sections.length > 0 ? sections[sections.length - 1][4] : nestedTokens;
          break;
        default:
          collector.push(token);
      }
    }

    return nestedTokens;
  }

  /**
   * A simple string scanner that is used by the template parser to find
   * tokens in template strings.
   */
  function Scanner(string) {
    this.string = string;
    this.tail = string;
    this.pos = 0;
  }

  /**
   * Returns `true` if the tail is empty (end of string).
   */
  Scanner.prototype.eos = function eos() {
    return this.tail === '';
  };

  /**
   * Tries to match the given regular expression at the current position.
   * Returns the matched text if it can match, the empty string otherwise.
   */
  Scanner.prototype.scan = function scan(re) {
    var match = this.tail.match(re);

    if (!match || match.index !== 0) return '';

    var string = match[0];

    this.tail = this.tail.substring(string.length);
    this.pos += string.length;

    return string;
  };

  /**
   * Skips all text until the given regular expression can be matched. Returns
   * the skipped string, which is the entire tail if no match can be made.
   */
  Scanner.prototype.scanUntil = function scanUntil(re) {
    var index = this.tail.search(re),
        match;

    switch (index) {
      case -1:
        match = this.tail;
        this.tail = '';
        break;
      case 0:
        match = '';
        break;
      default:
        match = this.tail.substring(0, index);
        this.tail = this.tail.substring(index);
    }

    this.pos += match.length;

    return match;
  };

  /**
   * Represents a rendering context by wrapping a view object and
   * maintaining a reference to the parent context.
   */
  function Context(view, parentContext) {
    this.view = view;
    this.cache = { '.': this.view };
    this.parent = parentContext;
  }

  /**
   * Creates a new context using the given view with this context
   * as the parent.
   */
  Context.prototype.push = function push(view) {
    return new Context(view, this);
  };

  /**
   * Returns the value of the given name in this context, traversing
   * up the context hierarchy if the value is absent in this context's view.
   */
  Context.prototype.lookup = function lookup(name) {
    var cache = this.cache;

    var value;
    if (cache.hasOwnProperty(name)) {
      value = cache[name];
    } else {
      var context = this,
          names,
          index,
          lookupHit = false;

      while (context) {
        if (name.indexOf('.') > 0) {
          value = context.view;
          names = name.split('.');
          index = 0;

          /**
           * Using the dot notion path in `name`, we descend through the
           * nested objects.
           *
           * To be certain that the lookup has been successful, we have to
           * check if the last object in the path actually has the property
           * we are looking for. We store the result in `lookupHit`.
           *
           * This is specially necessary for when the value has been set to
           * `undefined` and we want to avoid looking up parent contexts.
           **/
          while (value != null && index < names.length) {
            if (index === names.length - 1) lookupHit = hasProperty(value, names[index]);

            value = value[names[index++]];
          }
        } else {
          value = context.view[name];
          lookupHit = hasProperty(context.view, name);
        }

        if (lookupHit) break;

        context = context.parent;
      }

      cache[name] = value;
    }

    if (isFunction(value)) value = value.call(this.view);

    return value;
  };

  /**
   * A Writer knows how to take a stream of tokens and render them to a
   * string, given a context. It also maintains a cache of templates to
   * avoid the need to parse the same template twice.
   */
  function Writer() {
    this.cache = {};
  }

  /**
   * Clears all cached templates in this writer.
   */
  Writer.prototype.clearCache = function clearCache() {
    this.cache = {};
  };

  /**
   * Parses and caches the given `template` and returns the array of tokens
   * that is generated from the parse.
   */
  Writer.prototype.parse = function parse(template, tags) {
    var cache = this.cache;
    var tokens = cache[template];

    if (tokens == null) tokens = cache[template] = parseTemplate(template, tags);

    return tokens;
  };

  /**
   * High-level method that is used to render the given `template` with
   * the given `view`.
   *
   * The optional `partials` argument may be an object that contains the
   * names and templates of partials that are used in the template. It may
   * also be a function that is used to load partial templates on the fly
   * that takes a single argument: the name of the partial.
   */
  Writer.prototype.render = function render(template, view, partials) {
    var tokens = this.parse(template);
    var context = view instanceof Context ? view : new Context(view);
    return this.renderTokens(tokens, context, partials, template);
  };

  /**
   * Low-level method that renders the given array of `tokens` using
   * the given `context` and `partials`.
   *
   * Note: The `originalTemplate` is only ever used to extract the portion
   * of the original template that was contained in a higher-order section.
   * If the template doesn't use higher-order sections, this argument may
   * be omitted.
   */
  Writer.prototype.renderTokens = function renderTokens(tokens, context, partials, originalTemplate) {
    var buffer = '';

    var token, symbol, value;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      value = undefined;
      token = tokens[i];
      symbol = token[0];

      if (symbol === '#') value = this.renderSection(token, context, partials, originalTemplate);else if (symbol === '^') value = this.renderInverted(token, context, partials, originalTemplate);else if (symbol === '>') value = this.renderPartial(token, context, partials, originalTemplate);else if (symbol === '&') value = this.unescapedValue(token, context);else if (symbol === 'name') value = this.escapedValue(token, context);else if (symbol === 'text') value = this.rawValue(token);

      if (value !== undefined) buffer += value;
    }

    return buffer;
  };

  Writer.prototype.renderSection = function renderSection(token, context, partials, originalTemplate) {
    var self = this;
    var buffer = '';
    var value = context.lookup(token[1]);

    // This function is used to render an arbitrary template
    // in the current context by higher-order sections.
    function subRender(template) {
      return self.render(template, context, partials);
    }

    if (!value) return;

    if (isArray(value)) {
      for (var j = 0, valueLength = value.length; j < valueLength; ++j) {
        buffer += this.renderTokens(token[4], context.push(value[j]), partials, originalTemplate);
      }
    } else if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' || typeof value === 'string' || typeof value === 'number') {
      buffer += this.renderTokens(token[4], context.push(value), partials, originalTemplate);
    } else if (isFunction(value)) {
      if (typeof originalTemplate !== 'string') throw new Error('Cannot use higher-order sections without the original template');

      // Extract the portion of the original template that the section contains.
      value = value.call(context.view, originalTemplate.slice(token[3], token[5]), subRender);

      if (value != null) buffer += value;
    } else {
      buffer += this.renderTokens(token[4], context, partials, originalTemplate);
    }
    return buffer;
  };

  Writer.prototype.renderInverted = function renderInverted(token, context, partials, originalTemplate) {
    var value = context.lookup(token[1]);

    // Use JavaScript's definition of falsy. Include empty arrays.
    // See https://github.com/janl/mustache.js/issues/186
    if (!value || isArray(value) && value.length === 0) return this.renderTokens(token[4], context, partials, originalTemplate);
  };

  Writer.prototype.renderPartial = function renderPartial(token, context, partials) {
    if (!partials) return;

    var value = isFunction(partials) ? partials(token[1]) : partials[token[1]];
    if (value != null) return this.renderTokens(this.parse(value), context, partials, value);
  };

  Writer.prototype.unescapedValue = function unescapedValue(token, context) {
    var value = context.lookup(token[1]);
    if (value != null) return value;
  };

  Writer.prototype.escapedValue = function escapedValue(token, context) {
    var value = context.lookup(token[1]);
    if (value != null) return mustache.escape(value);
  };

  Writer.prototype.rawValue = function rawValue(token) {
    return token[1];
  };

  mustache.name = 'mustache.js';
  mustache.version = '2.2.1';
  mustache.tags = ['{{', '}}'];

  // All high-level mustache.* functions use this writer.
  var defaultWriter = new Writer();

  /**
   * Clears all cached templates in the default writer.
   */
  mustache.clearCache = function clearCache() {
    return defaultWriter.clearCache();
  };

  /**
   * Parses and caches the given template in the default writer and returns the
   * array of tokens it contains. Doing this ahead of time avoids the need to
   * parse templates on the fly as they are rendered.
   */
  mustache.parse = function parse(template, tags) {
    return defaultWriter.parse(template, tags);
  };

  /**
   * Renders the `template` with the given `view` and `partials` using the
   * default writer.
   */
  mustache.render = function render(template, view, partials) {
    if (typeof template !== 'string') {
      throw new TypeError('Invalid template! Template should be a "string" ' + 'but "' + typeStr(template) + '" was given as the first ' + 'argument for mustache#render(template, view, partials)');
    }

    return defaultWriter.render(template, view, partials);
  };

  // This is here for backwards compatibility with 0.4.x.,
  /*eslint-disable */ // eslint wants camel cased function name
  mustache.to_html = function to_html(template, view, partials, send) {
    /*eslint-enable*/

    var result = mustache.render(template, view, partials);

    if (isFunction(send)) {
      send(result);
    } else {
      return result;
    }
  };

  // Export the escaping function so that the user may override it.
  // See https://github.com/janl/mustache.js/issues/244
  mustache.escape = escapeHtml;

  // Export these mainly for testing, but also for advanced usage.
  mustache.Scanner = Scanner;
  mustache.Context = Context;
  mustache.Writer = Writer;
});

},{}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvU2VydmljZS5qcyIsInNyYy9qcy9XaWRnZXQuanMiLCJzcmMvanMvYXBwLmpzIiwic3JjL2pzL2NvbmZpZy5qcyIsInNyYy9qcy9saWJzL211c3RhY2hlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7OztJQ0tNOzs7Ozs7QUFLTCxVQUxLLE9BS0wsR0FBYzt3QkFMVCxTQUtTOztBQUNiLE9BQUssS0FBTCxHQUFhLEVBQWIsQ0FEYTtBQUViLE9BQUssS0FBTCxHQUFhLEVBQWIsQ0FGYTtFQUFkOzs7Ozs7Ozs7Ozs7OztjQUxLOztzQkFvQk0sS0FBbUQ7T0FBOUMsNkRBQU8sb0JBQXVDO09BQWpDLDhEQUFRLG9CQUF5QjtPQUFuQixpRUFBVyxzQkFBUTs7QUFDN0QsT0FBRyxLQUFILEVBQVU7QUFDVCxXQUFPO0FBQ04sVUFBSyxNQUFNLEVBQUUsS0FBRixDQUFRLElBQVIsQ0FBTjtLQUROLENBRFM7QUFJVCxVQUFNLEtBQU4sQ0FKUztJQUFWO0FBTUEsVUFBTyxFQUFFLElBQUYsQ0FBTztBQUNiLFNBQUssR0FBTDtBQUNBLFlBQVEsS0FBUjtBQUNBLFVBQU0sSUFBTjtBQUNBLGNBQVUsUUFBVjtJQUpNLEVBS0osSUFMSSxDQUtDLFVBQUMsQ0FBRCxFQUFPO0FBQ2QsWUFBUSxHQUFSLENBQVksY0FBWixFQUE0QixFQUFFLFlBQUYsQ0FBNUIsQ0FEYztJQUFQLENBTFIsQ0FQNkQ7Ozs7UUFwQnpEOzs7a0JBdUNTOzs7Ozs7Ozs7OztBQzVDZjs7OztBQUNBOzs7Ozs7OztBQUNBLElBQU0sV0FBVyxRQUFRLGlCQUFSLENBQVg7Ozs7Ozs7O0lBT0E7Ozs7Ozs7OztBQVFMLFVBUkssWUFRTCxDQUFZLEVBQVosRUFBZ0IsTUFBaEIsRUFBd0I7d0JBUm5CLGNBUW1COztBQUN2QixPQUFLLEVBQUwsR0FBVSxFQUFWLENBRHVCO0FBRXZCLE9BQUss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REEsR0FDVSxRQUFRLFFBQVIsQ0FEVixHQUM4QiwyQkFEOUIsR0FFQSx3REFGQSxDQUFwQixDQURnQztLQUFsQzs7QUFNQSxXQUFPLGNBQWMsTUFBZCxDQUFxQixRQUFyQixFQUErQixJQUEvQixFQUFxQyxRQUFyQyxDQUFQLENBUDJEO0dBQTNDOzs7O0FBbmtCd0IsVUEra0IxQyxDQUFTLE9BQVQsR0FBbUIsU0FBUyxPQUFULENBQWtCLFFBQWxCLEVBQTRCLElBQTVCLEVBQWtDLFFBQWxDLEVBQTRDLElBQTVDLEVBQWtEOzs7QUFHbkUsUUFBSSxTQUFTLFNBQVMsTUFBVCxDQUFnQixRQUFoQixFQUEwQixJQUExQixFQUFnQyxRQUFoQyxDQUFULENBSCtEOztBQUtuRSxRQUFJLFdBQVcsSUFBWCxDQUFKLEVBQXNCO0FBQ3BCLFdBQUssTUFBTCxFQURvQjtLQUF0QixNQUVPO0FBQ0wsYUFBTyxNQUFQLENBREs7S0FGUDtHQUxpQjs7OztBQS9rQnVCLFVBNmxCMUMsQ0FBUyxNQUFULEdBQWtCLFVBQWxCOzs7QUE3bEIwQyxVQWdtQjFDLENBQVMsT0FBVCxHQUFtQixPQUFuQixDQWhtQjBDO0FBaW1CMUMsV0FBUyxPQUFULEdBQW1CLE9BQW5CLENBam1CMEM7QUFrbUIxQyxXQUFTLE1BQVQsR0FBa0IsTUFBbEIsQ0FsbUIwQztDQUFwQyxDQVRSIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogU2VydmljZSByZXNwb25zaWJsZSBmb3IgZmV0Y2hpbmcgZmlsZXMgYXN5bmNocm9ub3VzbHlcbiAqXG4gKiBAY2xhc3MgU2VydmljZVxuICovXG5jbGFzcyBTZXJ2aWNlIHtcblxuXHQvKlxuXHR0b2RvXG5cdCAqL1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHR0aGlzLmNhY2hlID0ge307XG5cdFx0dGhpcy5wcm94eSA9ICcnO1xuXHR9XG5cblx0LyoqXG5cdCAqIE1ha2VzIGFuIEhUVFAgR0VUIHJlcXVlc3Rcblx0ICpcblx0ICogQG1ldGhvZCBnZXRcblx0ICogQHBhcmFtIHtTdHJpbmd9IHVybFxuXHQgKiBAcGFyYW0ge09iamVjdHxudWxsfSBkYXRhIHwgUXVlcnkgcGFyYW1ldGVyc1xuXHQgKiBAcGFyYW0ge1N0cmluZ30gcHJveHkgfCBTZXJ2ZXItc2lkZSBwcm94eSB0aGF0IHdpbGwgZm9yd2FyZCBvdXIgcmVxdWVzdFxuXHQgKiBAcGFyYW0ge1N0cmluZ30gZGF0YVR5cGUgfCBEYXRhdHlwZSB3ZSBhcmUgZXhwZWN0aW5nIHRvIHJlY2lldmVcblx0ICogQHJldHVybnMge09iamVjdC48WE1MSHR0cFJlcXVlc3Q+fSB8IHJlc3BvbnNlIGZyb20gdXJsXG5cdCAqL1xuXHRzdGF0aWMgZ2V0KHVybCwgZGF0YSA9IG51bGwsIHByb3h5ID0gbnVsbCwgZGF0YVR5cGUgPSAndGV4dCcpIHtcblx0XHRpZihwcm94eSkge1xuXHRcdFx0ZGF0YSA9IHtcblx0XHRcdFx0dXJsOiB1cmwgKyAkLnBhcmFtKGRhdGEpXG5cdFx0XHR9O1xuXHRcdFx0dXJsID0gcHJveHk7XG5cdFx0fVxuXHRcdHJldHVybiAkLmFqYXgoe1xuXHRcdFx0dXJsOiB1cmwsXG5cdFx0XHRtZXRob2Q6ICdnZXQnLFxuXHRcdFx0ZGF0YTogZGF0YSxcblx0XHRcdGRhdGFUeXBlOiBkYXRhVHlwZVxuXHRcdH0pLmZhaWwoKGUpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKCdHZXQgZmFpbGVkOiAnLCBlLnJlc3BvbnNlVGV4dCk7XG5cdFx0fSk7XG5cdH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBTZXJ2aWNlOyIsImltcG9ydCBjb25maWcgZnJvbSAnLi9jb25maWcnO1xuaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi9TZXJ2aWNlJztcbmNvbnN0IE11c3RhY2hlID0gcmVxdWlyZSgnLi9saWJzL211c3RhY2hlJyk7XG5cbi8qKlxuICogTWFpbiBpVHVuZXNXaWRnZXQgY2xhc3NcbiAqXG4gKiBAY2xhc3MgSXR1bmVzV2lkZ2V0XG4gKi9cbmNsYXNzIEl0dW5lc1dpZGdldCB7XG5cblx0LyoqXG5cdCAqIEBjb25zdHJ1Y3RvclxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gZWwgfCBDdXJyZW50IERPTSBlbGVtZW50XG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBjdXN0b20gfCBDdXN0b20gY29uZmlndXJhdGlvbiBvcHRpb25zXG5cdCAqL1xuXHRjb25zdHJ1Y3RvcihlbCwgY3VzdG9tKSB7XG5cdFx0dGhpcy5lbCA9IGVsO1xuXHRcdHRoaXMuY3VzdG9tID0gY3VzdG9tO1xuXHRcdHRoaXMuY29uZmlndXJlKCk7XG5cdFx0dGhpcy5jb3JlKCk7XG5cdH1cblxuXHQvKipcblx0ICogQ29uZmlndXJlcyBjdXJyZW50IG9iamVjdFxuXHQgKlxuXHQgKiBAbWV0aG9kIGNvbmZpZ3VyZVxuXHQgKi9cblx0Y29uZmlndXJlKCkge1xuXHRcdC8qKlxuXHRcdCAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBjb25maWcgfCBtZXJnZXMgY3VzdG9tIG9wdGlvbnMgYW5kIGNvbmZpZy5vcHRpb25zXG5cdFx0ICovXG5cdFx0dGhpcy5jb25maWcgPSAkLmV4dGVuZChjb25maWcsIHRoaXMuY3VzdG9tKTtcblx0XHR0aGlzLmVuZHBvaW50ID0gdGhpcy5lbmRwb2ludCgpO1xuXHRcdHRoaXMucGFyYW1zID0gdGhpcy5wYXJhbXMoKTtcblx0XHR0aGlzLnByb3h5ID0gdGhpcy5wcm94eSgpO1xuXHRcdHRoaXMudGVtcGxhdGUgPSB0aGlzLnRlbXBsYXRlKCk7XG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyBBUEkgZW5kcG9pbnQgdXJsXG5cdCAqIFJlZmVyZW5jZXMgY29uZmlnLmVudiBzZXR0aW5nc1xuXHQgKlxuXHQgKiBAbWV0aG9kIGVuZHBvaW50XG5cdCAqIEByZXR1cm4ge1N0cmluZ30gfCBlbmRwb2ludCB1cmxcblx0ICovXG5cdGVuZHBvaW50KCkge1xuXHRcdHJldHVybiB0aGlzLmNvbmZpZy5lbmRwb2ludHNbdGhpcy5jb25maWcuZW52XTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIEFQSSBwYXJhbWV0ZXJzIHRvIGJlIHBhc3NlZCB0byAuYWpheCByZXF1ZXN0XG5cdCAqXG5cdCAqIEBtZXRob2QgcGFyYW1zXG5cdCAqIEByZXR1cm4ge09iamVjdH0gfCBBUEkgcGFyYW1ldGVyc1xuXHQgKi9cblx0cGFyYW1zKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHR0ZXJtOiB0aGlzLmNvbmZpZy5zZWFyY2gsXG5cdFx0XHRtZWRpYTogdGhpcy5jb25maWcubWVkaWFcblx0XHR9O1xuXHR9XG5cblx0Lypcblx0ICogUmV0dXJucyBhIHByb3h5IFVSTFxuXHQgKiBJZiBlbnYgIT0gJ2RldicsIHVzZSBjb25maWcucHJveHlcblx0ICogZWxzZSB1c2UgbnVsbFxuXHQgKlxuXHQgKiBAbWV0aG9kIHByb3h5XG5cdCAqIEByZXR1cm4ge1N0cmluZ3xudWxsfSB8IHByb3h5IFVSTFxuXHQgKi9cblx0cHJveHkoKSB7XG5cdFx0dmFyIHByb3h5ID0gbnVsbDtcblx0XHRpZih0aGlzLmNvbmZpZy5lbnYgIT0gJ2RldicpIHtcblx0XHRcdHByb3h5ID0gdGhpcy5jb25maWcucHJveHk7XG5cdFx0fVxuXHRcdHJldHVybiBwcm94eTtcblx0fVxuXG5cdC8qXG5cdCAqIFJldHVybnMgYSB0ZW1wbGF0ZSBVUkxcblx0ICpcblx0ICogQG1ldGhvZCB0ZW1wbGF0ZVxuXHQgKiBAcmV0dXJuIHtTdHJpbmd9IHwgdGVtcGxhdGUgVVJMXG5cdCAqL1xuXHR0ZW1wbGF0ZSgpIHtcblx0XHRyZXR1cm4gYHRlbXBsYXRlcy8ke3RoaXMuY29uZmlnLnRlbXBsYXRlfS5oYnNgO1xuXHR9XG5cblx0Lypcblx0ICogQ2FsbCB0aGUgQVBJIHNlcnZpY2UgYW5kIHRlbXBsYXRlIHNlcnZpY2Vcblx0ICogUG9wdWxhdGUgdGVtcGxhdGUgd2l0aCBBUEkgZGF0YVxuXHQgKlxuXHQgKiBAbWV0aG9kIGNvcmVcblx0ICovXG5cdGNvcmUoKSB7XG5cdFx0UHJvbWlzZS5hbGwoW1xuXHRcdFx0dGhpcy5nZXRBUElEYXRhKCksXG5cdFx0XHR0aGlzLmdldFRlbXBsYXRlRGF0YSgpXG5cdFx0XHQvLyBXYWl0IGZvciBib3RoIHJlc3BvbnNlc1xuXHRcdF0pLnRoZW4oKHJlc3BvbnNlcykgPT4ge1xuXHRcdFx0Y29uc3QgZGF0YSA9IEl0dW5lc1dpZGdldC5mb3JtYXREYXRhKHJlc3BvbnNlc1swXSk7XG5cdFx0XHRjb25zdCB0ZW1wbGF0ZSA9IHJlc3BvbnNlc1sxXTtcblx0XHRcdGNvbnN0IHRtcGwgPSBNdXN0YWNoZS5yZW5kZXIodGVtcGxhdGUsIGRhdGEpO1xuXHRcdFx0JCh0aGlzLmVsKS5hcHBlbmQoJCh0bXBsKSk7XG5cdFx0fSkuY2F0Y2goKGUpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKCdFcnJvcicsIGUpO1xuXHRcdH0pO1xuXHR9XG5cblx0Lypcblx0ICogR2V0cyBkYXRhIGZyb20gQVBJIGVuZHBvaW50XG5cdCAqXG5cdCAqIEBtZXRob2QgZ2V0QVBJRGF0YVxuXHQgKiBAcmV0dXJucyB7T2JqZWN0LjxYTUxIdHRwUmVxdWVzdD59IHwgQVBJIGRhdGFcblx0ICovXG5cdGdldEFQSURhdGEoKSB7XG5cdFx0cmV0dXJuIFNlcnZpY2UuZ2V0KHRoaXMuZW5kcG9pbnQsIHRoaXMucGFyYW1zLCB0aGlzLnByb3h5KVxuXHR9XG5cblx0Lypcblx0ICogR2V0cyByYXcgdGVtcGxhdGVcblx0ICpcblx0ICogQG1ldGhvZCBnZXRUZW1wbGF0ZURhdGFcblx0ICogQHJldHVybnMge09iamVjdC48WE1MSHR0cFJlcXVlc3Q+fSB8IHJhdyB0ZW1wbGF0ZVxuXHQgKi9cblx0Z2V0VGVtcGxhdGVEYXRhKCkge1xuXHRcdHJldHVybiBTZXJ2aWNlLmdldCh0aGlzLnRlbXBsYXRlKVxuXHR9XG5cblx0Lypcblx0ICogTWFwcyBBUEkgZGF0YSB0byB0ZW1wbGF0ZS1mcmllbmRseSBvYmplY3QgZm9ybVxuXHQgKlxuXHQgKiBAbWV0aG9kIGZvcm1hdERhdGFcblx0ICogQHBhcmFtIHtTdHJpbmd9IHJhdyB8IHJhdyBKU09OLXBhcnNlYWJsZSBBUEkgZGF0YVxuXHQgKiBAcmV0dXJucyB7T2JqZWN0fSB8IGZvcm1hdHRlZCBBUEkgZGF0YVxuXHQgKi9cblx0c3RhdGljIGZvcm1hdERhdGEocmF3KSB7XG5cdFx0bGV0IGpzb24gPSBKU09OLnBhcnNlKHJhdyk7XG5cdFx0bGV0IHJlc3VsdHMgPSBqc29uLnJlc3VsdHM7XG5cdFx0bGV0IGRhdGEgPSBbXTtcblx0XHRyZXN1bHRzLmZvckVhY2goKGQpID0+IHtcblx0XHRcdGRhdGEucHVzaCh7XG5cdFx0XHRcdGltZzoge1xuXHRcdFx0XHRcdHNtYWxsOiBkLmFydHdvcmtVcmw2MCxcblx0XHRcdFx0XHRtZWRpdW06IGQuYXJ0d29ya1VybDEwMCxcblx0XHRcdFx0XHRsYXJnZTogZC5hcnR3b3JrVXJsNTEyXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGRldmVsb3Blcjoge1xuXHRcdFx0XHRcdG5hbWU6IGQuYXJ0aXN0TmFtZSxcblx0XHRcdFx0XHR1cmw6IGQuc2VsbGVyVXJsXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHByaWNlOiBkLmZvcm1hdHRlZFByaWNlLFxuXHRcdFx0XHRuYW1lOiBkLnRyYWNrTmFtZSxcblx0XHRcdFx0dXJsOiBkLnRyYWNrVmlld1VybCxcblx0XHRcdFx0ZGVzY3JpcHRpb246IGQuZGVzY3JpcHRpb24sXG5cdFx0XHRcdHJhdGluZzoge1xuXHRcdFx0XHRcdGF2ZXJhZ2U6IGQuYXZlcmFnZVVzZXJSYXRpbmcsXG5cdFx0XHRcdFx0Y291bnQ6IGQudXNlclJhdGluZ0NvdW50XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0fSk7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGRhdGE6IGRhdGFcblx0XHR9O1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEl0dW5lc1dpZGdldDsiLCJpZih0eXBlb2YgJCA9PSAndW5kZWZpbmVkJykge1xuXHRjb25zb2xlLmxvZygnalF1ZXJ5IHJlcXVpcmVkIScpO1xufVxuXG5pbXBvcnQgSXR1bmVzV2lkZ2V0IGZyb20gJy4vV2lkZ2V0JztcblxuLy8gRXh0ZW5kIEpRdWVyeSBmbiBmb3IgJCgnLmNsYXNzJykuaXR1bmVzV2lkZ2V0KClcbiQuZm4uaXR1bmVzV2lkZ2V0ID0gZnVuY3Rpb24ob3B0aW9ucykge1xuXHRyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdChuZXcgSXR1bmVzV2lkZ2V0KHRoaXMsIG9wdGlvbnMpKTtcblx0fSk7XG59OyIsIi8qKlxuICogQ29uZmlndXJhdGlvbiBvYmplY3RcbiAqIFRoZXNlIGNhbiBiZSBvdmVycmlkZGVuIGJ5IGN1c3RvbSBvcHRpb25zIHBhc3NlZCBpbnRvIHRoZSB3aWRnZXRcbiAqL1xuY29uc3QgY29uZmlnID0ge1xuXHRzZWFyY2g6ICdzcG90aWZ5Jyxcblx0bWVkaWE6ICdzb2Z0d2FyZScsXG5cdHByb3h5OiAncHJveHkucGhwJyxcblx0dGVtcGxhdGU6ICd0ZW1wbGF0ZTEnLFxuXHRlbmRwb2ludHM6IHtcblx0XHRkZXY6ICdzcmMvanMvZGF0YS9zZXJ2aWNlLXNoaW0uanNvbicsXG5cdFx0cHJvZDogJ2h0dHBzOi8vaXR1bmVzLmFwcGxlLmNvbS9zZWFyY2g/J1xuXHRcdC8vICdodHRwOi8vaXR1bmVzLmFwcGxlLmNvbS9sb29rdXA/aWQ9NDAwMjc0OTM0J1xuXHR9LFxuXHRlbnY6ICdwcm9kJ1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY29uZmlnOyIsIi8qIVxuICogbXVzdGFjaGUuanMgLSBMb2dpYy1sZXNzIHt7bXVzdGFjaGV9fSB0ZW1wbGF0ZXMgd2l0aCBKYXZhU2NyaXB0XG4gKiBodHRwOi8vZ2l0aHViLmNvbS9qYW5sL211c3RhY2hlLmpzXG4gKi9cblxuLypnbG9iYWwgZGVmaW5lOiBmYWxzZSBNdXN0YWNoZTogdHJ1ZSovXG5cbihmdW5jdGlvbiBkZWZpbmVNdXN0YWNoZSAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgZXhwb3J0cyAmJiB0eXBlb2YgZXhwb3J0cy5ub2RlTmFtZSAhPT0gJ3N0cmluZycpIHtcbiAgICBmYWN0b3J5KGV4cG9ydHMpOyAvLyBDb21tb25KU1xuICB9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZShbJ2V4cG9ydHMnXSwgZmFjdG9yeSk7IC8vIEFNRFxuICB9IGVsc2Uge1xuICAgIGdsb2JhbC5NdXN0YWNoZSA9IHt9O1xuICAgIGZhY3RvcnkoZ2xvYmFsLk11c3RhY2hlKTsgLy8gc2NyaXB0LCB3c2gsIGFzcFxuICB9XG59KHRoaXMsIGZ1bmN0aW9uIG11c3RhY2hlRmFjdG9yeSAobXVzdGFjaGUpIHtcblxuICB2YXIgb2JqZWN0VG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuICB2YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gaXNBcnJheVBvbHlmaWxsIChvYmplY3QpIHtcbiAgICByZXR1cm4gb2JqZWN0VG9TdHJpbmcuY2FsbChvYmplY3QpID09PSAnW29iamVjdCBBcnJheV0nO1xuICB9O1xuXG4gIGZ1bmN0aW9uIGlzRnVuY3Rpb24gKG9iamVjdCkge1xuICAgIHJldHVybiB0eXBlb2Ygb2JqZWN0ID09PSAnZnVuY3Rpb24nO1xuICB9XG5cbiAgLyoqXG4gICAqIE1vcmUgY29ycmVjdCB0eXBlb2Ygc3RyaW5nIGhhbmRsaW5nIGFycmF5XG4gICAqIHdoaWNoIG5vcm1hbGx5IHJldHVybnMgdHlwZW9mICdvYmplY3QnXG4gICAqL1xuICBmdW5jdGlvbiB0eXBlU3RyIChvYmopIHtcbiAgICByZXR1cm4gaXNBcnJheShvYmopID8gJ2FycmF5JyA6IHR5cGVvZiBvYmo7XG4gIH1cblxuICBmdW5jdGlvbiBlc2NhcGVSZWdFeHAgKHN0cmluZykge1xuICAgIHJldHVybiBzdHJpbmcucmVwbGFjZSgvW1xcLVxcW1xcXXt9KCkqKz8uLFxcXFxcXF4kfCNcXHNdL2csICdcXFxcJCYnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBOdWxsIHNhZmUgd2F5IG9mIGNoZWNraW5nIHdoZXRoZXIgb3Igbm90IGFuIG9iamVjdCxcbiAgICogaW5jbHVkaW5nIGl0cyBwcm90b3R5cGUsIGhhcyBhIGdpdmVuIHByb3BlcnR5XG4gICAqL1xuICBmdW5jdGlvbiBoYXNQcm9wZXJ0eSAob2JqLCBwcm9wTmFtZSkge1xuICAgIHJldHVybiBvYmogIT0gbnVsbCAmJiB0eXBlb2Ygb2JqID09PSAnb2JqZWN0JyAmJiAocHJvcE5hbWUgaW4gb2JqKTtcbiAgfVxuXG4gIC8vIFdvcmthcm91bmQgZm9yIGh0dHBzOi8vaXNzdWVzLmFwYWNoZS5vcmcvamlyYS9icm93c2UvQ09VQ0hEQi01NzdcbiAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9qYW5sL211c3RhY2hlLmpzL2lzc3Vlcy8xODlcbiAgdmFyIHJlZ0V4cFRlc3QgPSBSZWdFeHAucHJvdG90eXBlLnRlc3Q7XG4gIGZ1bmN0aW9uIHRlc3RSZWdFeHAgKHJlLCBzdHJpbmcpIHtcbiAgICByZXR1cm4gcmVnRXhwVGVzdC5jYWxsKHJlLCBzdHJpbmcpO1xuICB9XG5cbiAgdmFyIG5vblNwYWNlUmUgPSAvXFxTLztcbiAgZnVuY3Rpb24gaXNXaGl0ZXNwYWNlIChzdHJpbmcpIHtcbiAgICByZXR1cm4gIXRlc3RSZWdFeHAobm9uU3BhY2VSZSwgc3RyaW5nKTtcbiAgfVxuXG4gIHZhciBlbnRpdHlNYXAgPSB7XG4gICAgJyYnOiAnJmFtcDsnLFxuICAgICc8JzogJyZsdDsnLFxuICAgICc+JzogJyZndDsnLFxuICAgICdcIic6ICcmcXVvdDsnLFxuICAgIFwiJ1wiOiAnJiMzOTsnLFxuICAgICcvJzogJyYjeDJGOycsXG4gICAgJ2AnOiAnJiN4NjA7JyxcbiAgICAnPSc6ICcmI3gzRDsnXG4gIH07XG5cbiAgZnVuY3Rpb24gZXNjYXBlSHRtbCAoc3RyaW5nKSB7XG4gICAgcmV0dXJuIFN0cmluZyhzdHJpbmcpLnJlcGxhY2UoL1smPD5cIidgPVxcL10vZywgZnVuY3Rpb24gZnJvbUVudGl0eU1hcCAocykge1xuICAgICAgcmV0dXJuIGVudGl0eU1hcFtzXTtcbiAgICB9KTtcbiAgfVxuXG4gIHZhciB3aGl0ZVJlID0gL1xccyovO1xuICB2YXIgc3BhY2VSZSA9IC9cXHMrLztcbiAgdmFyIGVxdWFsc1JlID0gL1xccyo9LztcbiAgdmFyIGN1cmx5UmUgPSAvXFxzKlxcfS87XG4gIHZhciB0YWdSZSA9IC8jfFxcXnxcXC98PnxcXHt8Jnw9fCEvO1xuXG4gIC8qKlxuICAgKiBCcmVha3MgdXAgdGhlIGdpdmVuIGB0ZW1wbGF0ZWAgc3RyaW5nIGludG8gYSB0cmVlIG9mIHRva2Vucy4gSWYgdGhlIGB0YWdzYFxuICAgKiBhcmd1bWVudCBpcyBnaXZlbiBoZXJlIGl0IG11c3QgYmUgYW4gYXJyYXkgd2l0aCB0d28gc3RyaW5nIHZhbHVlczogdGhlXG4gICAqIG9wZW5pbmcgYW5kIGNsb3NpbmcgdGFncyB1c2VkIGluIHRoZSB0ZW1wbGF0ZSAoZS5nLiBbIFwiPCVcIiwgXCIlPlwiIF0pLiBPZlxuICAgKiBjb3Vyc2UsIHRoZSBkZWZhdWx0IGlzIHRvIHVzZSBtdXN0YWNoZXMgKGkuZS4gbXVzdGFjaGUudGFncykuXG4gICAqXG4gICAqIEEgdG9rZW4gaXMgYW4gYXJyYXkgd2l0aCBhdCBsZWFzdCA0IGVsZW1lbnRzLiBUaGUgZmlyc3QgZWxlbWVudCBpcyB0aGVcbiAgICogbXVzdGFjaGUgc3ltYm9sIHRoYXQgd2FzIHVzZWQgaW5zaWRlIHRoZSB0YWcsIGUuZy4gXCIjXCIgb3IgXCImXCIuIElmIHRoZSB0YWdcbiAgICogZGlkIG5vdCBjb250YWluIGEgc3ltYm9sIChpLmUuIHt7bXlWYWx1ZX19KSB0aGlzIGVsZW1lbnQgaXMgXCJuYW1lXCIuIEZvclxuICAgKiBhbGwgdGV4dCB0aGF0IGFwcGVhcnMgb3V0c2lkZSBhIHN5bWJvbCB0aGlzIGVsZW1lbnQgaXMgXCJ0ZXh0XCIuXG4gICAqXG4gICAqIFRoZSBzZWNvbmQgZWxlbWVudCBvZiBhIHRva2VuIGlzIGl0cyBcInZhbHVlXCIuIEZvciBtdXN0YWNoZSB0YWdzIHRoaXMgaXNcbiAgICogd2hhdGV2ZXIgZWxzZSB3YXMgaW5zaWRlIHRoZSB0YWcgYmVzaWRlcyB0aGUgb3BlbmluZyBzeW1ib2wuIEZvciB0ZXh0IHRva2Vuc1xuICAgKiB0aGlzIGlzIHRoZSB0ZXh0IGl0c2VsZi5cbiAgICpcbiAgICogVGhlIHRoaXJkIGFuZCBmb3VydGggZWxlbWVudHMgb2YgdGhlIHRva2VuIGFyZSB0aGUgc3RhcnQgYW5kIGVuZCBpbmRpY2VzLFxuICAgKiByZXNwZWN0aXZlbHksIG9mIHRoZSB0b2tlbiBpbiB0aGUgb3JpZ2luYWwgdGVtcGxhdGUuXG4gICAqXG4gICAqIFRva2VucyB0aGF0IGFyZSB0aGUgcm9vdCBub2RlIG9mIGEgc3VidHJlZSBjb250YWluIHR3byBtb3JlIGVsZW1lbnRzOiAxKSBhblxuICAgKiBhcnJheSBvZiB0b2tlbnMgaW4gdGhlIHN1YnRyZWUgYW5kIDIpIHRoZSBpbmRleCBpbiB0aGUgb3JpZ2luYWwgdGVtcGxhdGUgYXRcbiAgICogd2hpY2ggdGhlIGNsb3NpbmcgdGFnIGZvciB0aGF0IHNlY3Rpb24gYmVnaW5zLlxuICAgKi9cbiAgZnVuY3Rpb24gcGFyc2VUZW1wbGF0ZSAodGVtcGxhdGUsIHRhZ3MpIHtcbiAgICBpZiAoIXRlbXBsYXRlKVxuICAgICAgcmV0dXJuIFtdO1xuXG4gICAgdmFyIHNlY3Rpb25zID0gW107ICAgICAvLyBTdGFjayB0byBob2xkIHNlY3Rpb24gdG9rZW5zXG4gICAgdmFyIHRva2VucyA9IFtdOyAgICAgICAvLyBCdWZmZXIgdG8gaG9sZCB0aGUgdG9rZW5zXG4gICAgdmFyIHNwYWNlcyA9IFtdOyAgICAgICAvLyBJbmRpY2VzIG9mIHdoaXRlc3BhY2UgdG9rZW5zIG9uIHRoZSBjdXJyZW50IGxpbmVcbiAgICB2YXIgaGFzVGFnID0gZmFsc2U7ICAgIC8vIElzIHRoZXJlIGEge3t0YWd9fSBvbiB0aGUgY3VycmVudCBsaW5lP1xuICAgIHZhciBub25TcGFjZSA9IGZhbHNlOyAgLy8gSXMgdGhlcmUgYSBub24tc3BhY2UgY2hhciBvbiB0aGUgY3VycmVudCBsaW5lP1xuXG4gICAgLy8gU3RyaXBzIGFsbCB3aGl0ZXNwYWNlIHRva2VucyBhcnJheSBmb3IgdGhlIGN1cnJlbnQgbGluZVxuICAgIC8vIGlmIHRoZXJlIHdhcyBhIHt7I3RhZ319IG9uIGl0IGFuZCBvdGhlcndpc2Ugb25seSBzcGFjZS5cbiAgICBmdW5jdGlvbiBzdHJpcFNwYWNlICgpIHtcbiAgICAgIGlmIChoYXNUYWcgJiYgIW5vblNwYWNlKSB7XG4gICAgICAgIHdoaWxlIChzcGFjZXMubGVuZ3RoKVxuICAgICAgICAgIGRlbGV0ZSB0b2tlbnNbc3BhY2VzLnBvcCgpXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNwYWNlcyA9IFtdO1xuICAgICAgfVxuXG4gICAgICBoYXNUYWcgPSBmYWxzZTtcbiAgICAgIG5vblNwYWNlID0gZmFsc2U7XG4gICAgfVxuXG4gICAgdmFyIG9wZW5pbmdUYWdSZSwgY2xvc2luZ1RhZ1JlLCBjbG9zaW5nQ3VybHlSZTtcbiAgICBmdW5jdGlvbiBjb21waWxlVGFncyAodGFnc1RvQ29tcGlsZSkge1xuICAgICAgaWYgKHR5cGVvZiB0YWdzVG9Db21waWxlID09PSAnc3RyaW5nJylcbiAgICAgICAgdGFnc1RvQ29tcGlsZSA9IHRhZ3NUb0NvbXBpbGUuc3BsaXQoc3BhY2VSZSwgMik7XG5cbiAgICAgIGlmICghaXNBcnJheSh0YWdzVG9Db21waWxlKSB8fCB0YWdzVG9Db21waWxlLmxlbmd0aCAhPT0gMilcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHRhZ3M6ICcgKyB0YWdzVG9Db21waWxlKTtcblxuICAgICAgb3BlbmluZ1RhZ1JlID0gbmV3IFJlZ0V4cChlc2NhcGVSZWdFeHAodGFnc1RvQ29tcGlsZVswXSkgKyAnXFxcXHMqJyk7XG4gICAgICBjbG9zaW5nVGFnUmUgPSBuZXcgUmVnRXhwKCdcXFxccyonICsgZXNjYXBlUmVnRXhwKHRhZ3NUb0NvbXBpbGVbMV0pKTtcbiAgICAgIGNsb3NpbmdDdXJseVJlID0gbmV3IFJlZ0V4cCgnXFxcXHMqJyArIGVzY2FwZVJlZ0V4cCgnfScgKyB0YWdzVG9Db21waWxlWzFdKSk7XG4gICAgfVxuXG4gICAgY29tcGlsZVRhZ3ModGFncyB8fCBtdXN0YWNoZS50YWdzKTtcblxuICAgIHZhciBzY2FubmVyID0gbmV3IFNjYW5uZXIodGVtcGxhdGUpO1xuXG4gICAgdmFyIHN0YXJ0LCB0eXBlLCB2YWx1ZSwgY2hyLCB0b2tlbiwgb3BlblNlY3Rpb247XG4gICAgd2hpbGUgKCFzY2FubmVyLmVvcygpKSB7XG4gICAgICBzdGFydCA9IHNjYW5uZXIucG9zO1xuXG4gICAgICAvLyBNYXRjaCBhbnkgdGV4dCBiZXR3ZWVuIHRhZ3MuXG4gICAgICB2YWx1ZSA9IHNjYW5uZXIuc2NhblVudGlsKG9wZW5pbmdUYWdSZSk7XG5cbiAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgdmFsdWVMZW5ndGggPSB2YWx1ZS5sZW5ndGg7IGkgPCB2YWx1ZUxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgY2hyID0gdmFsdWUuY2hhckF0KGkpO1xuXG4gICAgICAgICAgaWYgKGlzV2hpdGVzcGFjZShjaHIpKSB7XG4gICAgICAgICAgICBzcGFjZXMucHVzaCh0b2tlbnMubGVuZ3RoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbm9uU3BhY2UgPSB0cnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRva2Vucy5wdXNoKFsgJ3RleHQnLCBjaHIsIHN0YXJ0LCBzdGFydCArIDEgXSk7XG4gICAgICAgICAgc3RhcnQgKz0gMTtcblxuICAgICAgICAgIC8vIENoZWNrIGZvciB3aGl0ZXNwYWNlIG9uIHRoZSBjdXJyZW50IGxpbmUuXG4gICAgICAgICAgaWYgKGNociA9PT0gJ1xcbicpXG4gICAgICAgICAgICBzdHJpcFNwYWNlKCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gTWF0Y2ggdGhlIG9wZW5pbmcgdGFnLlxuICAgICAgaWYgKCFzY2FubmVyLnNjYW4ob3BlbmluZ1RhZ1JlKSlcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGhhc1RhZyA9IHRydWU7XG5cbiAgICAgIC8vIEdldCB0aGUgdGFnIHR5cGUuXG4gICAgICB0eXBlID0gc2Nhbm5lci5zY2FuKHRhZ1JlKSB8fCAnbmFtZSc7XG4gICAgICBzY2FubmVyLnNjYW4od2hpdGVSZSk7XG5cbiAgICAgIC8vIEdldCB0aGUgdGFnIHZhbHVlLlxuICAgICAgaWYgKHR5cGUgPT09ICc9Jykge1xuICAgICAgICB2YWx1ZSA9IHNjYW5uZXIuc2NhblVudGlsKGVxdWFsc1JlKTtcbiAgICAgICAgc2Nhbm5lci5zY2FuKGVxdWFsc1JlKTtcbiAgICAgICAgc2Nhbm5lci5zY2FuVW50aWwoY2xvc2luZ1RhZ1JlKTtcbiAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ3snKSB7XG4gICAgICAgIHZhbHVlID0gc2Nhbm5lci5zY2FuVW50aWwoY2xvc2luZ0N1cmx5UmUpO1xuICAgICAgICBzY2FubmVyLnNjYW4oY3VybHlSZSk7XG4gICAgICAgIHNjYW5uZXIuc2NhblVudGlsKGNsb3NpbmdUYWdSZSk7XG4gICAgICAgIHR5cGUgPSAnJic7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWx1ZSA9IHNjYW5uZXIuc2NhblVudGlsKGNsb3NpbmdUYWdSZSk7XG4gICAgICB9XG5cbiAgICAgIC8vIE1hdGNoIHRoZSBjbG9zaW5nIHRhZy5cbiAgICAgIGlmICghc2Nhbm5lci5zY2FuKGNsb3NpbmdUYWdSZSkpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVW5jbG9zZWQgdGFnIGF0ICcgKyBzY2FubmVyLnBvcyk7XG5cbiAgICAgIHRva2VuID0gWyB0eXBlLCB2YWx1ZSwgc3RhcnQsIHNjYW5uZXIucG9zIF07XG4gICAgICB0b2tlbnMucHVzaCh0b2tlbik7XG5cbiAgICAgIGlmICh0eXBlID09PSAnIycgfHwgdHlwZSA9PT0gJ14nKSB7XG4gICAgICAgIHNlY3Rpb25zLnB1c2godG9rZW4pO1xuICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAnLycpIHtcbiAgICAgICAgLy8gQ2hlY2sgc2VjdGlvbiBuZXN0aW5nLlxuICAgICAgICBvcGVuU2VjdGlvbiA9IHNlY3Rpb25zLnBvcCgpO1xuXG4gICAgICAgIGlmICghb3BlblNlY3Rpb24pXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbm9wZW5lZCBzZWN0aW9uIFwiJyArIHZhbHVlICsgJ1wiIGF0ICcgKyBzdGFydCk7XG5cbiAgICAgICAgaWYgKG9wZW5TZWN0aW9uWzFdICE9PSB2YWx1ZSlcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuY2xvc2VkIHNlY3Rpb24gXCInICsgb3BlblNlY3Rpb25bMV0gKyAnXCIgYXQgJyArIHN0YXJ0KTtcbiAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ25hbWUnIHx8IHR5cGUgPT09ICd7JyB8fCB0eXBlID09PSAnJicpIHtcbiAgICAgICAgbm9uU3BhY2UgPSB0cnVlO1xuICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAnPScpIHtcbiAgICAgICAgLy8gU2V0IHRoZSB0YWdzIGZvciB0aGUgbmV4dCB0aW1lIGFyb3VuZC5cbiAgICAgICAgY29tcGlsZVRhZ3ModmFsdWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIE1ha2Ugc3VyZSB0aGVyZSBhcmUgbm8gb3BlbiBzZWN0aW9ucyB3aGVuIHdlJ3JlIGRvbmUuXG4gICAgb3BlblNlY3Rpb24gPSBzZWN0aW9ucy5wb3AoKTtcblxuICAgIGlmIChvcGVuU2VjdGlvbilcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5jbG9zZWQgc2VjdGlvbiBcIicgKyBvcGVuU2VjdGlvblsxXSArICdcIiBhdCAnICsgc2Nhbm5lci5wb3MpO1xuXG4gICAgcmV0dXJuIG5lc3RUb2tlbnMoc3F1YXNoVG9rZW5zKHRva2VucykpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbWJpbmVzIHRoZSB2YWx1ZXMgb2YgY29uc2VjdXRpdmUgdGV4dCB0b2tlbnMgaW4gdGhlIGdpdmVuIGB0b2tlbnNgIGFycmF5XG4gICAqIHRvIGEgc2luZ2xlIHRva2VuLlxuICAgKi9cbiAgZnVuY3Rpb24gc3F1YXNoVG9rZW5zICh0b2tlbnMpIHtcbiAgICB2YXIgc3F1YXNoZWRUb2tlbnMgPSBbXTtcblxuICAgIHZhciB0b2tlbiwgbGFzdFRva2VuO1xuICAgIGZvciAodmFyIGkgPSAwLCBudW1Ub2tlbnMgPSB0b2tlbnMubGVuZ3RoOyBpIDwgbnVtVG9rZW5zOyArK2kpIHtcbiAgICAgIHRva2VuID0gdG9rZW5zW2ldO1xuXG4gICAgICBpZiAodG9rZW4pIHtcbiAgICAgICAgaWYgKHRva2VuWzBdID09PSAndGV4dCcgJiYgbGFzdFRva2VuICYmIGxhc3RUb2tlblswXSA9PT0gJ3RleHQnKSB7XG4gICAgICAgICAgbGFzdFRva2VuWzFdICs9IHRva2VuWzFdO1xuICAgICAgICAgIGxhc3RUb2tlblszXSA9IHRva2VuWzNdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNxdWFzaGVkVG9rZW5zLnB1c2godG9rZW4pO1xuICAgICAgICAgIGxhc3RUb2tlbiA9IHRva2VuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHNxdWFzaGVkVG9rZW5zO1xuICB9XG5cbiAgLyoqXG4gICAqIEZvcm1zIHRoZSBnaXZlbiBhcnJheSBvZiBgdG9rZW5zYCBpbnRvIGEgbmVzdGVkIHRyZWUgc3RydWN0dXJlIHdoZXJlXG4gICAqIHRva2VucyB0aGF0IHJlcHJlc2VudCBhIHNlY3Rpb24gaGF2ZSB0d28gYWRkaXRpb25hbCBpdGVtczogMSkgYW4gYXJyYXkgb2ZcbiAgICogYWxsIHRva2VucyB0aGF0IGFwcGVhciBpbiB0aGF0IHNlY3Rpb24gYW5kIDIpIHRoZSBpbmRleCBpbiB0aGUgb3JpZ2luYWxcbiAgICogdGVtcGxhdGUgdGhhdCByZXByZXNlbnRzIHRoZSBlbmQgb2YgdGhhdCBzZWN0aW9uLlxuICAgKi9cbiAgZnVuY3Rpb24gbmVzdFRva2VucyAodG9rZW5zKSB7XG4gICAgdmFyIG5lc3RlZFRva2VucyA9IFtdO1xuICAgIHZhciBjb2xsZWN0b3IgPSBuZXN0ZWRUb2tlbnM7XG4gICAgdmFyIHNlY3Rpb25zID0gW107XG5cbiAgICB2YXIgdG9rZW4sIHNlY3Rpb247XG4gICAgZm9yICh2YXIgaSA9IDAsIG51bVRva2VucyA9IHRva2Vucy5sZW5ndGg7IGkgPCBudW1Ub2tlbnM7ICsraSkge1xuICAgICAgdG9rZW4gPSB0b2tlbnNbaV07XG5cbiAgICAgIHN3aXRjaCAodG9rZW5bMF0pIHtcbiAgICAgICAgY2FzZSAnIyc6XG4gICAgICAgIGNhc2UgJ14nOlxuICAgICAgICAgIGNvbGxlY3Rvci5wdXNoKHRva2VuKTtcbiAgICAgICAgICBzZWN0aW9ucy5wdXNoKHRva2VuKTtcbiAgICAgICAgICBjb2xsZWN0b3IgPSB0b2tlbls0XSA9IFtdO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICcvJzpcbiAgICAgICAgICBzZWN0aW9uID0gc2VjdGlvbnMucG9wKCk7XG4gICAgICAgICAgc2VjdGlvbls1XSA9IHRva2VuWzJdO1xuICAgICAgICAgIGNvbGxlY3RvciA9IHNlY3Rpb25zLmxlbmd0aCA+IDAgPyBzZWN0aW9uc1tzZWN0aW9ucy5sZW5ndGggLSAxXVs0XSA6IG5lc3RlZFRva2VucztcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBjb2xsZWN0b3IucHVzaCh0b2tlbik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG5lc3RlZFRva2VucztcbiAgfVxuXG4gIC8qKlxuICAgKiBBIHNpbXBsZSBzdHJpbmcgc2Nhbm5lciB0aGF0IGlzIHVzZWQgYnkgdGhlIHRlbXBsYXRlIHBhcnNlciB0byBmaW5kXG4gICAqIHRva2VucyBpbiB0ZW1wbGF0ZSBzdHJpbmdzLlxuICAgKi9cbiAgZnVuY3Rpb24gU2Nhbm5lciAoc3RyaW5nKSB7XG4gICAgdGhpcy5zdHJpbmcgPSBzdHJpbmc7XG4gICAgdGhpcy50YWlsID0gc3RyaW5nO1xuICAgIHRoaXMucG9zID0gMDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgdGFpbCBpcyBlbXB0eSAoZW5kIG9mIHN0cmluZykuXG4gICAqL1xuICBTY2FubmVyLnByb3RvdHlwZS5lb3MgPSBmdW5jdGlvbiBlb3MgKCkge1xuICAgIHJldHVybiB0aGlzLnRhaWwgPT09ICcnO1xuICB9O1xuXG4gIC8qKlxuICAgKiBUcmllcyB0byBtYXRjaCB0aGUgZ2l2ZW4gcmVndWxhciBleHByZXNzaW9uIGF0IHRoZSBjdXJyZW50IHBvc2l0aW9uLlxuICAgKiBSZXR1cm5zIHRoZSBtYXRjaGVkIHRleHQgaWYgaXQgY2FuIG1hdGNoLCB0aGUgZW1wdHkgc3RyaW5nIG90aGVyd2lzZS5cbiAgICovXG4gIFNjYW5uZXIucHJvdG90eXBlLnNjYW4gPSBmdW5jdGlvbiBzY2FuIChyZSkge1xuICAgIHZhciBtYXRjaCA9IHRoaXMudGFpbC5tYXRjaChyZSk7XG5cbiAgICBpZiAoIW1hdGNoIHx8IG1hdGNoLmluZGV4ICE9PSAwKVxuICAgICAgcmV0dXJuICcnO1xuXG4gICAgdmFyIHN0cmluZyA9IG1hdGNoWzBdO1xuXG4gICAgdGhpcy50YWlsID0gdGhpcy50YWlsLnN1YnN0cmluZyhzdHJpbmcubGVuZ3RoKTtcbiAgICB0aGlzLnBvcyArPSBzdHJpbmcubGVuZ3RoO1xuXG4gICAgcmV0dXJuIHN0cmluZztcbiAgfTtcblxuICAvKipcbiAgICogU2tpcHMgYWxsIHRleHQgdW50aWwgdGhlIGdpdmVuIHJlZ3VsYXIgZXhwcmVzc2lvbiBjYW4gYmUgbWF0Y2hlZC4gUmV0dXJuc1xuICAgKiB0aGUgc2tpcHBlZCBzdHJpbmcsIHdoaWNoIGlzIHRoZSBlbnRpcmUgdGFpbCBpZiBubyBtYXRjaCBjYW4gYmUgbWFkZS5cbiAgICovXG4gIFNjYW5uZXIucHJvdG90eXBlLnNjYW5VbnRpbCA9IGZ1bmN0aW9uIHNjYW5VbnRpbCAocmUpIHtcbiAgICB2YXIgaW5kZXggPSB0aGlzLnRhaWwuc2VhcmNoKHJlKSwgbWF0Y2g7XG5cbiAgICBzd2l0Y2ggKGluZGV4KSB7XG4gICAgICBjYXNlIC0xOlxuICAgICAgICBtYXRjaCA9IHRoaXMudGFpbDtcbiAgICAgICAgdGhpcy50YWlsID0gJyc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAwOlxuICAgICAgICBtYXRjaCA9ICcnO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIG1hdGNoID0gdGhpcy50YWlsLnN1YnN0cmluZygwLCBpbmRleCk7XG4gICAgICAgIHRoaXMudGFpbCA9IHRoaXMudGFpbC5zdWJzdHJpbmcoaW5kZXgpO1xuICAgIH1cblxuICAgIHRoaXMucG9zICs9IG1hdGNoLmxlbmd0aDtcblxuICAgIHJldHVybiBtYXRjaDtcbiAgfTtcblxuICAvKipcbiAgICogUmVwcmVzZW50cyBhIHJlbmRlcmluZyBjb250ZXh0IGJ5IHdyYXBwaW5nIGEgdmlldyBvYmplY3QgYW5kXG4gICAqIG1haW50YWluaW5nIGEgcmVmZXJlbmNlIHRvIHRoZSBwYXJlbnQgY29udGV4dC5cbiAgICovXG4gIGZ1bmN0aW9uIENvbnRleHQgKHZpZXcsIHBhcmVudENvbnRleHQpIHtcbiAgICB0aGlzLnZpZXcgPSB2aWV3O1xuICAgIHRoaXMuY2FjaGUgPSB7ICcuJzogdGhpcy52aWV3IH07XG4gICAgdGhpcy5wYXJlbnQgPSBwYXJlbnRDb250ZXh0O1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgY29udGV4dCB1c2luZyB0aGUgZ2l2ZW4gdmlldyB3aXRoIHRoaXMgY29udGV4dFxuICAgKiBhcyB0aGUgcGFyZW50LlxuICAgKi9cbiAgQ29udGV4dC5wcm90b3R5cGUucHVzaCA9IGZ1bmN0aW9uIHB1c2ggKHZpZXcpIHtcbiAgICByZXR1cm4gbmV3IENvbnRleHQodmlldywgdGhpcyk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHZhbHVlIG9mIHRoZSBnaXZlbiBuYW1lIGluIHRoaXMgY29udGV4dCwgdHJhdmVyc2luZ1xuICAgKiB1cCB0aGUgY29udGV4dCBoaWVyYXJjaHkgaWYgdGhlIHZhbHVlIGlzIGFic2VudCBpbiB0aGlzIGNvbnRleHQncyB2aWV3LlxuICAgKi9cbiAgQ29udGV4dC5wcm90b3R5cGUubG9va3VwID0gZnVuY3Rpb24gbG9va3VwIChuYW1lKSB7XG4gICAgdmFyIGNhY2hlID0gdGhpcy5jYWNoZTtcblxuICAgIHZhciB2YWx1ZTtcbiAgICBpZiAoY2FjaGUuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICAgIHZhbHVlID0gY2FjaGVbbmFtZV07XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBjb250ZXh0ID0gdGhpcywgbmFtZXMsIGluZGV4LCBsb29rdXBIaXQgPSBmYWxzZTtcblxuICAgICAgd2hpbGUgKGNvbnRleHQpIHtcbiAgICAgICAgaWYgKG5hbWUuaW5kZXhPZignLicpID4gMCkge1xuICAgICAgICAgIHZhbHVlID0gY29udGV4dC52aWV3O1xuICAgICAgICAgIG5hbWVzID0gbmFtZS5zcGxpdCgnLicpO1xuICAgICAgICAgIGluZGV4ID0gMDtcblxuICAgICAgICAgIC8qKlxuICAgICAgICAgICAqIFVzaW5nIHRoZSBkb3Qgbm90aW9uIHBhdGggaW4gYG5hbWVgLCB3ZSBkZXNjZW5kIHRocm91Z2ggdGhlXG4gICAgICAgICAgICogbmVzdGVkIG9iamVjdHMuXG4gICAgICAgICAgICpcbiAgICAgICAgICAgKiBUbyBiZSBjZXJ0YWluIHRoYXQgdGhlIGxvb2t1cCBoYXMgYmVlbiBzdWNjZXNzZnVsLCB3ZSBoYXZlIHRvXG4gICAgICAgICAgICogY2hlY2sgaWYgdGhlIGxhc3Qgb2JqZWN0IGluIHRoZSBwYXRoIGFjdHVhbGx5IGhhcyB0aGUgcHJvcGVydHlcbiAgICAgICAgICAgKiB3ZSBhcmUgbG9va2luZyBmb3IuIFdlIHN0b3JlIHRoZSByZXN1bHQgaW4gYGxvb2t1cEhpdGAuXG4gICAgICAgICAgICpcbiAgICAgICAgICAgKiBUaGlzIGlzIHNwZWNpYWxseSBuZWNlc3NhcnkgZm9yIHdoZW4gdGhlIHZhbHVlIGhhcyBiZWVuIHNldCB0b1xuICAgICAgICAgICAqIGB1bmRlZmluZWRgIGFuZCB3ZSB3YW50IHRvIGF2b2lkIGxvb2tpbmcgdXAgcGFyZW50IGNvbnRleHRzLlxuICAgICAgICAgICAqKi9cbiAgICAgICAgICB3aGlsZSAodmFsdWUgIT0gbnVsbCAmJiBpbmRleCA8IG5hbWVzLmxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKGluZGV4ID09PSBuYW1lcy5sZW5ndGggLSAxKVxuICAgICAgICAgICAgICBsb29rdXBIaXQgPSBoYXNQcm9wZXJ0eSh2YWx1ZSwgbmFtZXNbaW5kZXhdKTtcblxuICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZVtuYW1lc1tpbmRleCsrXV07XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhbHVlID0gY29udGV4dC52aWV3W25hbWVdO1xuICAgICAgICAgIGxvb2t1cEhpdCA9IGhhc1Byb3BlcnR5KGNvbnRleHQudmlldywgbmFtZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobG9va3VwSGl0KVxuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNvbnRleHQgPSBjb250ZXh0LnBhcmVudDtcbiAgICAgIH1cblxuICAgICAgY2FjaGVbbmFtZV0gPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBpZiAoaXNGdW5jdGlvbih2YWx1ZSkpXG4gICAgICB2YWx1ZSA9IHZhbHVlLmNhbGwodGhpcy52aWV3KTtcblxuICAgIHJldHVybiB2YWx1ZTtcbiAgfTtcblxuICAvKipcbiAgICogQSBXcml0ZXIga25vd3MgaG93IHRvIHRha2UgYSBzdHJlYW0gb2YgdG9rZW5zIGFuZCByZW5kZXIgdGhlbSB0byBhXG4gICAqIHN0cmluZywgZ2l2ZW4gYSBjb250ZXh0LiBJdCBhbHNvIG1haW50YWlucyBhIGNhY2hlIG9mIHRlbXBsYXRlcyB0b1xuICAgKiBhdm9pZCB0aGUgbmVlZCB0byBwYXJzZSB0aGUgc2FtZSB0ZW1wbGF0ZSB0d2ljZS5cbiAgICovXG4gIGZ1bmN0aW9uIFdyaXRlciAoKSB7XG4gICAgdGhpcy5jYWNoZSA9IHt9O1xuICB9XG5cbiAgLyoqXG4gICAqIENsZWFycyBhbGwgY2FjaGVkIHRlbXBsYXRlcyBpbiB0aGlzIHdyaXRlci5cbiAgICovXG4gIFdyaXRlci5wcm90b3R5cGUuY2xlYXJDYWNoZSA9IGZ1bmN0aW9uIGNsZWFyQ2FjaGUgKCkge1xuICAgIHRoaXMuY2FjaGUgPSB7fTtcbiAgfTtcblxuICAvKipcbiAgICogUGFyc2VzIGFuZCBjYWNoZXMgdGhlIGdpdmVuIGB0ZW1wbGF0ZWAgYW5kIHJldHVybnMgdGhlIGFycmF5IG9mIHRva2Vuc1xuICAgKiB0aGF0IGlzIGdlbmVyYXRlZCBmcm9tIHRoZSBwYXJzZS5cbiAgICovXG4gIFdyaXRlci5wcm90b3R5cGUucGFyc2UgPSBmdW5jdGlvbiBwYXJzZSAodGVtcGxhdGUsIHRhZ3MpIHtcbiAgICB2YXIgY2FjaGUgPSB0aGlzLmNhY2hlO1xuICAgIHZhciB0b2tlbnMgPSBjYWNoZVt0ZW1wbGF0ZV07XG5cbiAgICBpZiAodG9rZW5zID09IG51bGwpXG4gICAgICB0b2tlbnMgPSBjYWNoZVt0ZW1wbGF0ZV0gPSBwYXJzZVRlbXBsYXRlKHRlbXBsYXRlLCB0YWdzKTtcblxuICAgIHJldHVybiB0b2tlbnM7XG4gIH07XG5cbiAgLyoqXG4gICAqIEhpZ2gtbGV2ZWwgbWV0aG9kIHRoYXQgaXMgdXNlZCB0byByZW5kZXIgdGhlIGdpdmVuIGB0ZW1wbGF0ZWAgd2l0aFxuICAgKiB0aGUgZ2l2ZW4gYHZpZXdgLlxuICAgKlxuICAgKiBUaGUgb3B0aW9uYWwgYHBhcnRpYWxzYCBhcmd1bWVudCBtYXkgYmUgYW4gb2JqZWN0IHRoYXQgY29udGFpbnMgdGhlXG4gICAqIG5hbWVzIGFuZCB0ZW1wbGF0ZXMgb2YgcGFydGlhbHMgdGhhdCBhcmUgdXNlZCBpbiB0aGUgdGVtcGxhdGUuIEl0IG1heVxuICAgKiBhbHNvIGJlIGEgZnVuY3Rpb24gdGhhdCBpcyB1c2VkIHRvIGxvYWQgcGFydGlhbCB0ZW1wbGF0ZXMgb24gdGhlIGZseVxuICAgKiB0aGF0IHRha2VzIGEgc2luZ2xlIGFyZ3VtZW50OiB0aGUgbmFtZSBvZiB0aGUgcGFydGlhbC5cbiAgICovXG4gIFdyaXRlci5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gcmVuZGVyICh0ZW1wbGF0ZSwgdmlldywgcGFydGlhbHMpIHtcbiAgICB2YXIgdG9rZW5zID0gdGhpcy5wYXJzZSh0ZW1wbGF0ZSk7XG4gICAgdmFyIGNvbnRleHQgPSAodmlldyBpbnN0YW5jZW9mIENvbnRleHQpID8gdmlldyA6IG5ldyBDb250ZXh0KHZpZXcpO1xuICAgIHJldHVybiB0aGlzLnJlbmRlclRva2Vucyh0b2tlbnMsIGNvbnRleHQsIHBhcnRpYWxzLCB0ZW1wbGF0ZSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIExvdy1sZXZlbCBtZXRob2QgdGhhdCByZW5kZXJzIHRoZSBnaXZlbiBhcnJheSBvZiBgdG9rZW5zYCB1c2luZ1xuICAgKiB0aGUgZ2l2ZW4gYGNvbnRleHRgIGFuZCBgcGFydGlhbHNgLlxuICAgKlxuICAgKiBOb3RlOiBUaGUgYG9yaWdpbmFsVGVtcGxhdGVgIGlzIG9ubHkgZXZlciB1c2VkIHRvIGV4dHJhY3QgdGhlIHBvcnRpb25cbiAgICogb2YgdGhlIG9yaWdpbmFsIHRlbXBsYXRlIHRoYXQgd2FzIGNvbnRhaW5lZCBpbiBhIGhpZ2hlci1vcmRlciBzZWN0aW9uLlxuICAgKiBJZiB0aGUgdGVtcGxhdGUgZG9lc24ndCB1c2UgaGlnaGVyLW9yZGVyIHNlY3Rpb25zLCB0aGlzIGFyZ3VtZW50IG1heVxuICAgKiBiZSBvbWl0dGVkLlxuICAgKi9cbiAgV3JpdGVyLnByb3RvdHlwZS5yZW5kZXJUb2tlbnMgPSBmdW5jdGlvbiByZW5kZXJUb2tlbnMgKHRva2VucywgY29udGV4dCwgcGFydGlhbHMsIG9yaWdpbmFsVGVtcGxhdGUpIHtcbiAgICB2YXIgYnVmZmVyID0gJyc7XG5cbiAgICB2YXIgdG9rZW4sIHN5bWJvbCwgdmFsdWU7XG4gICAgZm9yICh2YXIgaSA9IDAsIG51bVRva2VucyA9IHRva2Vucy5sZW5ndGg7IGkgPCBudW1Ub2tlbnM7ICsraSkge1xuICAgICAgdmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgICB0b2tlbiA9IHRva2Vuc1tpXTtcbiAgICAgIHN5bWJvbCA9IHRva2VuWzBdO1xuXG4gICAgICBpZiAoc3ltYm9sID09PSAnIycpIHZhbHVlID0gdGhpcy5yZW5kZXJTZWN0aW9uKHRva2VuLCBjb250ZXh0LCBwYXJ0aWFscywgb3JpZ2luYWxUZW1wbGF0ZSk7XG4gICAgICBlbHNlIGlmIChzeW1ib2wgPT09ICdeJykgdmFsdWUgPSB0aGlzLnJlbmRlckludmVydGVkKHRva2VuLCBjb250ZXh0LCBwYXJ0aWFscywgb3JpZ2luYWxUZW1wbGF0ZSk7XG4gICAgICBlbHNlIGlmIChzeW1ib2wgPT09ICc+JykgdmFsdWUgPSB0aGlzLnJlbmRlclBhcnRpYWwodG9rZW4sIGNvbnRleHQsIHBhcnRpYWxzLCBvcmlnaW5hbFRlbXBsYXRlKTtcbiAgICAgIGVsc2UgaWYgKHN5bWJvbCA9PT0gJyYnKSB2YWx1ZSA9IHRoaXMudW5lc2NhcGVkVmFsdWUodG9rZW4sIGNvbnRleHQpO1xuICAgICAgZWxzZSBpZiAoc3ltYm9sID09PSAnbmFtZScpIHZhbHVlID0gdGhpcy5lc2NhcGVkVmFsdWUodG9rZW4sIGNvbnRleHQpO1xuICAgICAgZWxzZSBpZiAoc3ltYm9sID09PSAndGV4dCcpIHZhbHVlID0gdGhpcy5yYXdWYWx1ZSh0b2tlbik7XG5cbiAgICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKVxuICAgICAgICBidWZmZXIgKz0gdmFsdWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGJ1ZmZlcjtcbiAgfTtcblxuICBXcml0ZXIucHJvdG90eXBlLnJlbmRlclNlY3Rpb24gPSBmdW5jdGlvbiByZW5kZXJTZWN0aW9uICh0b2tlbiwgY29udGV4dCwgcGFydGlhbHMsIG9yaWdpbmFsVGVtcGxhdGUpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIGJ1ZmZlciA9ICcnO1xuICAgIHZhciB2YWx1ZSA9IGNvbnRleHQubG9va3VwKHRva2VuWzFdKTtcblxuICAgIC8vIFRoaXMgZnVuY3Rpb24gaXMgdXNlZCB0byByZW5kZXIgYW4gYXJiaXRyYXJ5IHRlbXBsYXRlXG4gICAgLy8gaW4gdGhlIGN1cnJlbnQgY29udGV4dCBieSBoaWdoZXItb3JkZXIgc2VjdGlvbnMuXG4gICAgZnVuY3Rpb24gc3ViUmVuZGVyICh0ZW1wbGF0ZSkge1xuICAgICAgcmV0dXJuIHNlbGYucmVuZGVyKHRlbXBsYXRlLCBjb250ZXh0LCBwYXJ0aWFscyk7XG4gICAgfVxuXG4gICAgaWYgKCF2YWx1ZSkgcmV0dXJuO1xuXG4gICAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgICBmb3IgKHZhciBqID0gMCwgdmFsdWVMZW5ndGggPSB2YWx1ZS5sZW5ndGg7IGogPCB2YWx1ZUxlbmd0aDsgKytqKSB7XG4gICAgICAgIGJ1ZmZlciArPSB0aGlzLnJlbmRlclRva2Vucyh0b2tlbls0XSwgY29udGV4dC5wdXNoKHZhbHVlW2pdKSwgcGFydGlhbHMsIG9yaWdpbmFsVGVtcGxhdGUpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyB8fCB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnIHx8IHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicpIHtcbiAgICAgIGJ1ZmZlciArPSB0aGlzLnJlbmRlclRva2Vucyh0b2tlbls0XSwgY29udGV4dC5wdXNoKHZhbHVlKSwgcGFydGlhbHMsIG9yaWdpbmFsVGVtcGxhdGUpO1xuICAgIH0gZWxzZSBpZiAoaXNGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICAgIGlmICh0eXBlb2Ygb3JpZ2luYWxUZW1wbGF0ZSAhPT0gJ3N0cmluZycpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IHVzZSBoaWdoZXItb3JkZXIgc2VjdGlvbnMgd2l0aG91dCB0aGUgb3JpZ2luYWwgdGVtcGxhdGUnKTtcblxuICAgICAgLy8gRXh0cmFjdCB0aGUgcG9ydGlvbiBvZiB0aGUgb3JpZ2luYWwgdGVtcGxhdGUgdGhhdCB0aGUgc2VjdGlvbiBjb250YWlucy5cbiAgICAgIHZhbHVlID0gdmFsdWUuY2FsbChjb250ZXh0LnZpZXcsIG9yaWdpbmFsVGVtcGxhdGUuc2xpY2UodG9rZW5bM10sIHRva2VuWzVdKSwgc3ViUmVuZGVyKTtcblxuICAgICAgaWYgKHZhbHVlICE9IG51bGwpXG4gICAgICAgIGJ1ZmZlciArPSB2YWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgYnVmZmVyICs9IHRoaXMucmVuZGVyVG9rZW5zKHRva2VuWzRdLCBjb250ZXh0LCBwYXJ0aWFscywgb3JpZ2luYWxUZW1wbGF0ZSk7XG4gICAgfVxuICAgIHJldHVybiBidWZmZXI7XG4gIH07XG5cbiAgV3JpdGVyLnByb3RvdHlwZS5yZW5kZXJJbnZlcnRlZCA9IGZ1bmN0aW9uIHJlbmRlckludmVydGVkICh0b2tlbiwgY29udGV4dCwgcGFydGlhbHMsIG9yaWdpbmFsVGVtcGxhdGUpIHtcbiAgICB2YXIgdmFsdWUgPSBjb250ZXh0Lmxvb2t1cCh0b2tlblsxXSk7XG5cbiAgICAvLyBVc2UgSmF2YVNjcmlwdCdzIGRlZmluaXRpb24gb2YgZmFsc3kuIEluY2x1ZGUgZW1wdHkgYXJyYXlzLlxuICAgIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vamFubC9tdXN0YWNoZS5qcy9pc3N1ZXMvMTg2XG4gICAgaWYgKCF2YWx1ZSB8fCAoaXNBcnJheSh2YWx1ZSkgJiYgdmFsdWUubGVuZ3RoID09PSAwKSlcbiAgICAgIHJldHVybiB0aGlzLnJlbmRlclRva2Vucyh0b2tlbls0XSwgY29udGV4dCwgcGFydGlhbHMsIG9yaWdpbmFsVGVtcGxhdGUpO1xuICB9O1xuXG4gIFdyaXRlci5wcm90b3R5cGUucmVuZGVyUGFydGlhbCA9IGZ1bmN0aW9uIHJlbmRlclBhcnRpYWwgKHRva2VuLCBjb250ZXh0LCBwYXJ0aWFscykge1xuICAgIGlmICghcGFydGlhbHMpIHJldHVybjtcblxuICAgIHZhciB2YWx1ZSA9IGlzRnVuY3Rpb24ocGFydGlhbHMpID8gcGFydGlhbHModG9rZW5bMV0pIDogcGFydGlhbHNbdG9rZW5bMV1dO1xuICAgIGlmICh2YWx1ZSAhPSBudWxsKVxuICAgICAgcmV0dXJuIHRoaXMucmVuZGVyVG9rZW5zKHRoaXMucGFyc2UodmFsdWUpLCBjb250ZXh0LCBwYXJ0aWFscywgdmFsdWUpO1xuICB9O1xuXG4gIFdyaXRlci5wcm90b3R5cGUudW5lc2NhcGVkVmFsdWUgPSBmdW5jdGlvbiB1bmVzY2FwZWRWYWx1ZSAodG9rZW4sIGNvbnRleHQpIHtcbiAgICB2YXIgdmFsdWUgPSBjb250ZXh0Lmxvb2t1cCh0b2tlblsxXSk7XG4gICAgaWYgKHZhbHVlICE9IG51bGwpXG4gICAgICByZXR1cm4gdmFsdWU7XG4gIH07XG5cbiAgV3JpdGVyLnByb3RvdHlwZS5lc2NhcGVkVmFsdWUgPSBmdW5jdGlvbiBlc2NhcGVkVmFsdWUgKHRva2VuLCBjb250ZXh0KSB7XG4gICAgdmFyIHZhbHVlID0gY29udGV4dC5sb29rdXAodG9rZW5bMV0pO1xuICAgIGlmICh2YWx1ZSAhPSBudWxsKVxuICAgICAgcmV0dXJuIG11c3RhY2hlLmVzY2FwZSh2YWx1ZSk7XG4gIH07XG5cbiAgV3JpdGVyLnByb3RvdHlwZS5yYXdWYWx1ZSA9IGZ1bmN0aW9uIHJhd1ZhbHVlICh0b2tlbikge1xuICAgIHJldHVybiB0b2tlblsxXTtcbiAgfTtcblxuICBtdXN0YWNoZS5uYW1lID0gJ211c3RhY2hlLmpzJztcbiAgbXVzdGFjaGUudmVyc2lvbiA9ICcyLjIuMSc7XG4gIG11c3RhY2hlLnRhZ3MgPSBbICd7eycsICd9fScgXTtcblxuICAvLyBBbGwgaGlnaC1sZXZlbCBtdXN0YWNoZS4qIGZ1bmN0aW9ucyB1c2UgdGhpcyB3cml0ZXIuXG4gIHZhciBkZWZhdWx0V3JpdGVyID0gbmV3IFdyaXRlcigpO1xuXG4gIC8qKlxuICAgKiBDbGVhcnMgYWxsIGNhY2hlZCB0ZW1wbGF0ZXMgaW4gdGhlIGRlZmF1bHQgd3JpdGVyLlxuICAgKi9cbiAgbXVzdGFjaGUuY2xlYXJDYWNoZSA9IGZ1bmN0aW9uIGNsZWFyQ2FjaGUgKCkge1xuICAgIHJldHVybiBkZWZhdWx0V3JpdGVyLmNsZWFyQ2FjaGUoKTtcbiAgfTtcblxuICAvKipcbiAgICogUGFyc2VzIGFuZCBjYWNoZXMgdGhlIGdpdmVuIHRlbXBsYXRlIGluIHRoZSBkZWZhdWx0IHdyaXRlciBhbmQgcmV0dXJucyB0aGVcbiAgICogYXJyYXkgb2YgdG9rZW5zIGl0IGNvbnRhaW5zLiBEb2luZyB0aGlzIGFoZWFkIG9mIHRpbWUgYXZvaWRzIHRoZSBuZWVkIHRvXG4gICAqIHBhcnNlIHRlbXBsYXRlcyBvbiB0aGUgZmx5IGFzIHRoZXkgYXJlIHJlbmRlcmVkLlxuICAgKi9cbiAgbXVzdGFjaGUucGFyc2UgPSBmdW5jdGlvbiBwYXJzZSAodGVtcGxhdGUsIHRhZ3MpIHtcbiAgICByZXR1cm4gZGVmYXVsdFdyaXRlci5wYXJzZSh0ZW1wbGF0ZSwgdGFncyk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJlbmRlcnMgdGhlIGB0ZW1wbGF0ZWAgd2l0aCB0aGUgZ2l2ZW4gYHZpZXdgIGFuZCBgcGFydGlhbHNgIHVzaW5nIHRoZVxuICAgKiBkZWZhdWx0IHdyaXRlci5cbiAgICovXG4gIG11c3RhY2hlLnJlbmRlciA9IGZ1bmN0aW9uIHJlbmRlciAodGVtcGxhdGUsIHZpZXcsIHBhcnRpYWxzKSB7XG4gICAgaWYgKHR5cGVvZiB0ZW1wbGF0ZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgdGVtcGxhdGUhIFRlbXBsYXRlIHNob3VsZCBiZSBhIFwic3RyaW5nXCIgJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdidXQgXCInICsgdHlwZVN0cih0ZW1wbGF0ZSkgKyAnXCIgd2FzIGdpdmVuIGFzIHRoZSBmaXJzdCAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ2FyZ3VtZW50IGZvciBtdXN0YWNoZSNyZW5kZXIodGVtcGxhdGUsIHZpZXcsIHBhcnRpYWxzKScpO1xuICAgIH1cblxuICAgIHJldHVybiBkZWZhdWx0V3JpdGVyLnJlbmRlcih0ZW1wbGF0ZSwgdmlldywgcGFydGlhbHMpO1xuICB9O1xuXG4gIC8vIFRoaXMgaXMgaGVyZSBmb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHkgd2l0aCAwLjQueC4sXG4gIC8qZXNsaW50LWRpc2FibGUgKi8gLy8gZXNsaW50IHdhbnRzIGNhbWVsIGNhc2VkIGZ1bmN0aW9uIG5hbWVcbiAgbXVzdGFjaGUudG9faHRtbCA9IGZ1bmN0aW9uIHRvX2h0bWwgKHRlbXBsYXRlLCB2aWV3LCBwYXJ0aWFscywgc2VuZCkge1xuICAgIC8qZXNsaW50LWVuYWJsZSovXG5cbiAgICB2YXIgcmVzdWx0ID0gbXVzdGFjaGUucmVuZGVyKHRlbXBsYXRlLCB2aWV3LCBwYXJ0aWFscyk7XG5cbiAgICBpZiAoaXNGdW5jdGlvbihzZW5kKSkge1xuICAgICAgc2VuZChyZXN1bHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgfTtcblxuICAvLyBFeHBvcnQgdGhlIGVzY2FwaW5nIGZ1bmN0aW9uIHNvIHRoYXQgdGhlIHVzZXIgbWF5IG92ZXJyaWRlIGl0LlxuICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2phbmwvbXVzdGFjaGUuanMvaXNzdWVzLzI0NFxuICBtdXN0YWNoZS5lc2NhcGUgPSBlc2NhcGVIdG1sO1xuXG4gIC8vIEV4cG9ydCB0aGVzZSBtYWlubHkgZm9yIHRlc3RpbmcsIGJ1dCBhbHNvIGZvciBhZHZhbmNlZCB1c2FnZS5cbiAgbXVzdGFjaGUuU2Nhbm5lciA9IFNjYW5uZXI7XG4gIG11c3RhY2hlLkNvbnRleHQgPSBDb250ZXh0O1xuICBtdXN0YWNoZS5Xcml0ZXIgPSBXcml0ZXI7XG5cbn0pKTsiXX0=
