(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Service = function () {

	/*
 todo: caching, proxy
  */

	function Service() {
		_classCallCheck(this, Service);

		this.cache = {};
		this.proxy = '';
	}

	_createClass(Service, null, [{
		key: 'get',
		value: function get(url) {
			var data = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
			var proxy = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
			var dataType = arguments.length <= 3 || arguments[3] === undefined ? 'text' : arguments[3];

			if (proxy) {
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

var RecipeWidget = function () {
	function RecipeWidget(el, options) {
		var _this = this;

		_classCallCheck(this, RecipeWidget);

		this.el = el;
		this.opts = $.extend(_config2.default.options, options);

		// Run multiple promises. Wait for both responses
		Promise.all([_Service2.default.get(this.opts.endpoints[this.opts.env], null, this.opts.proxy), _Service2.default.get('templates/' + this.opts.template + '.hbs')]).then(function (responses) {
			var template = responses[1];
			var data = RecipeWidget.mapData(responses[0]);
			var tmpl = Mustache.render(template, data);
			_this.build(tmpl);
		}).catch(function (e) {
			console.log('Error', e.responseText);
		});
	}

	// Append to $.selector


	_createClass(RecipeWidget, [{
		key: 'build',
		value: function build(template) {
			var $tmp = $(template);
			$(this.el).append($tmp);
		}

		// Convert raw API data to template-friendly object

	}], [{
		key: 'mapData',
		value: function mapData(raw) {
			var json = JSON.parse(raw);
			var data = json.results[0];
			return {
				developer: data.artistName,
				price: data.formattedPrice,
				name: data.trackName
			};
		}
	}]);

	return RecipeWidget;
}();

exports.default = RecipeWidget;

},{"./Service":1,"./config":4,"./libs/mustache":5}],3:[function(require,module,exports){
'use strict';

var _Widget = require('./Widget');

var _Widget2 = _interopRequireDefault(_Widget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (typeof $ == 'undefined') {
	console.log('jQuery required!');
}

// Extend JQuery fn for $('.class').recipeWidget()
$.fn.recipeWidget = function (options) {
	return this.each(function () {
		new _Widget2.default(this, options);
	});
};

},{"./Widget":2}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var config = {
	options: {
		search: 'healthy',
		key: null,
		proxy: 'proxy.php',
		imgProxy: null,
		template: 'template1',
		endpoints: {
			development: 'src/js/data/service-shim.json',
			production: 'http://itunes.apple.com/lookup?id=400274934'
		},
		env: 'production'
	}
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvU2VydmljZS5qcyIsInNyYy9qcy9XaWRnZXQuanMiLCJzcmMvanMvYXBwLmpzIiwic3JjL2pzL2NvbmZpZy5qcyIsInNyYy9qcy9saWJzL211c3RhY2hlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7OztJQ0FNOzs7Ozs7QUFLTCxVQUxLLE9BS0wsR0FBYzt3QkFMVCxTQUtTOztBQUNiLE9BQUssS0FBTCxHQUFhLEVBQWIsQ0FEYTtBQUViLE9BQUssS0FBTCxHQUFhLEVBQWIsQ0FGYTtFQUFkOztjQUxLOztzQkFVTSxLQUFtRDtPQUE5Qyw2REFBTyxvQkFBdUM7T0FBakMsOERBQVEsb0JBQXlCO09BQW5CLGlFQUFXLHNCQUFROztBQUM3RCxPQUFHLEtBQUgsRUFBVTtBQUNULFdBQU87QUFDTixVQUFLLEdBQUw7S0FERCxDQURTO0FBSVQsVUFBTSxLQUFOLENBSlM7SUFBVjtBQU1BLFVBQU8sRUFBRSxJQUFGLENBQU87QUFDYixTQUFLLEdBQUw7QUFDQSxZQUFRLEtBQVI7QUFDQSxVQUFNLElBQU47QUFDQSxjQUFVLFFBQVY7SUFKTSxFQUtKLElBTEksQ0FLQyxVQUFDLENBQUQsRUFBTztBQUNkLFlBQVEsR0FBUixDQUFZLGNBQVosRUFBNEIsRUFBRSxZQUFGLENBQTVCLENBRGM7SUFBUCxDQUxSLENBUDZEOzs7O1FBVnpEOzs7a0JBNkJTOzs7Ozs7Ozs7OztBQzdCZjs7OztBQUNBOzs7Ozs7OztBQUNBLElBQU0sV0FBVyxRQUFRLGlCQUFSLENBQVg7O0lBRUE7QUFFTCxVQUZLLFlBRUwsQ0FBWSxFQUFaLEVBQWdCLE9BQWhCLEVBQXlCOzs7d0JBRnBCLGNBRW9COztBQUV4QixPQUFLLEVBQUwsR0FBVSxFQUFWLENBRndCO0FBR3hCLE9BQUssSUFBTCxHQUFZLEVBQUUsTUFBRixDQUFTLGlCQUFPLE9BQVAsRUFBZ0IsT0FBekIsQ0FBWjs7O0FB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Y0FBYyxNQUFkLENBQXFCLFFBQXJCLEVBQStCLElBQS9CLEVBQXFDLFFBQXJDLENBQVAsQ0FQMkQ7R0FBM0M7Ozs7QUFua0J3QixVQStrQjFDLENBQVMsT0FBVCxHQUFtQixTQUFTLE9BQVQsQ0FBa0IsUUFBbEIsRUFBNEIsSUFBNUIsRUFBa0MsUUFBbEMsRUFBNEMsSUFBNUMsRUFBa0Q7OztBQUduRSxRQUFJLFNBQVMsU0FBUyxNQUFULENBQWdCLFFBQWhCLEVBQTBCLElBQTFCLEVBQWdDLFFBQWhDLENBQVQsQ0FIK0Q7O0FBS25FLFFBQUksV0FBVyxJQUFYLENBQUosRUFBc0I7QUFDcEIsV0FBSyxNQUFMLEVBRG9CO0tBQXRCLE1BRU87QUFDTCxhQUFPLE1BQVAsQ0FESztLQUZQO0dBTGlCOzs7O0FBL2tCdUIsVUE2bEIxQyxDQUFTLE1BQVQsR0FBa0IsVUFBbEI7OztBQTdsQjBDLFVBZ21CMUMsQ0FBUyxPQUFULEdBQW1CLE9BQW5CLENBaG1CMEM7QUFpbUIxQyxXQUFTLE9BQVQsR0FBbUIsT0FBbkIsQ0FqbUIwQztBQWttQjFDLFdBQVMsTUFBVCxHQUFrQixNQUFsQixDQWxtQjBDO0NBQXBDLENBVFIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiY2xhc3MgU2VydmljZSB7XG5cblx0Lypcblx0dG9kbzogY2FjaGluZywgcHJveHlcblx0ICovXG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHRoaXMuY2FjaGUgPSB7fTtcblx0XHR0aGlzLnByb3h5ID0gJyc7XG5cdH1cblxuXHRzdGF0aWMgZ2V0KHVybCwgZGF0YSA9IG51bGwsIHByb3h5ID0gbnVsbCwgZGF0YVR5cGUgPSAndGV4dCcpIHtcblx0XHRpZihwcm94eSkge1xuXHRcdFx0ZGF0YSA9IHtcblx0XHRcdFx0dXJsOiB1cmxcblx0XHRcdH07XG5cdFx0XHR1cmwgPSBwcm94eTtcblx0XHR9XG5cdFx0cmV0dXJuICQuYWpheCh7XG5cdFx0XHR1cmw6IHVybCxcblx0XHRcdG1ldGhvZDogJ2dldCcsXG5cdFx0XHRkYXRhOiBkYXRhLFxuXHRcdFx0ZGF0YVR5cGU6IGRhdGFUeXBlXG5cdFx0fSkuZmFpbCgoZSkgPT4ge1xuXHRcdFx0Y29uc29sZS5sb2coJ0dldCBmYWlsZWQ6ICcsIGUucmVzcG9uc2VUZXh0KTtcblx0XHR9KTtcblx0fVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IFNlcnZpY2U7IiwiaW1wb3J0IGNvbmZpZyBmcm9tICcuL2NvbmZpZyc7XG5pbXBvcnQgU2VydmljZSBmcm9tICcuL1NlcnZpY2UnO1xuY29uc3QgTXVzdGFjaGUgPSByZXF1aXJlKCcuL2xpYnMvbXVzdGFjaGUnKTtcblxuY2xhc3MgUmVjaXBlV2lkZ2V0IHtcblxuXHRjb25zdHJ1Y3RvcihlbCwgb3B0aW9ucykge1xuXG5cdFx0dGhpcy5lbCA9IGVsO1xuXHRcdHRoaXMub3B0cyA9ICQuZXh0ZW5kKGNvbmZpZy5vcHRpb25zLCBvcHRpb25zKTtcblxuXHRcdC8vIFJ1biBtdWx0aXBsZSBwcm9taXNlcy4gV2FpdCBmb3IgYm90aCByZXNwb25zZXNcblx0XHRQcm9taXNlLmFsbChbXG5cdFx0XHRTZXJ2aWNlLmdldCh0aGlzLm9wdHMuZW5kcG9pbnRzW3RoaXMub3B0cy5lbnZdLCBudWxsLCB0aGlzLm9wdHMucHJveHkpLFxuXHRcdFx0U2VydmljZS5nZXQoYHRlbXBsYXRlcy8ke3RoaXMub3B0cy50ZW1wbGF0ZX0uaGJzYClcblx0XHRdKS50aGVuKChyZXNwb25zZXMpID0+IHtcblx0XHRcdGNvbnN0IHRlbXBsYXRlID0gcmVzcG9uc2VzWzFdO1xuXHRcdFx0Y29uc3QgZGF0YSA9IFJlY2lwZVdpZGdldC5tYXBEYXRhKHJlc3BvbnNlc1swXSk7XG5cdFx0XHRjb25zdCB0bXBsID0gTXVzdGFjaGUucmVuZGVyKHRlbXBsYXRlLCBkYXRhKTtcblx0XHRcdHRoaXMuYnVpbGQodG1wbCk7XG5cdFx0fSkuY2F0Y2goKGUpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKCdFcnJvcicsIGUucmVzcG9uc2VUZXh0KTtcblx0XHR9KTtcblx0fVxuXG5cdC8vIEFwcGVuZCB0byAkLnNlbGVjdG9yXG5cdGJ1aWxkKHRlbXBsYXRlKSB7XG5cdFx0Y29uc3QgJHRtcCA9ICQodGVtcGxhdGUpO1xuXHRcdCQodGhpcy5lbCkuYXBwZW5kKCR0bXApO1xuXHR9XG5cblx0Ly8gQ29udmVydCByYXcgQVBJIGRhdGEgdG8gdGVtcGxhdGUtZnJpZW5kbHkgb2JqZWN0XG5cdHN0YXRpYyBtYXBEYXRhKHJhdykge1xuXHRcdGxldCBqc29uID0gSlNPTi5wYXJzZShyYXcpO1xuXHRcdGxldCBkYXRhID0ganNvbi5yZXN1bHRzWzBdO1xuXHRcdHJldHVybiB7XG5cdFx0XHRkZXZlbG9wZXI6IGRhdGEuYXJ0aXN0TmFtZSxcblx0XHRcdHByaWNlOiBkYXRhLmZvcm1hdHRlZFByaWNlLFxuXHRcdFx0bmFtZTogZGF0YS50cmFja05hbWVcblx0XHR9O1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFJlY2lwZVdpZGdldDsiLCJpZih0eXBlb2YgJCA9PSAndW5kZWZpbmVkJykge1xuXHRjb25zb2xlLmxvZygnalF1ZXJ5IHJlcXVpcmVkIScpO1xufVxuXG5pbXBvcnQgUmVjaXBlV2lkZ2V0IGZyb20gJy4vV2lkZ2V0JztcblxuLy8gRXh0ZW5kIEpRdWVyeSBmbiBmb3IgJCgnLmNsYXNzJykucmVjaXBlV2lkZ2V0KClcbiQuZm4ucmVjaXBlV2lkZ2V0ID0gZnVuY3Rpb24ob3B0aW9ucykge1xuXHRyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdChuZXcgUmVjaXBlV2lkZ2V0KHRoaXMsIG9wdGlvbnMpKTtcblx0fSk7XG59OyIsImNvbnN0IGNvbmZpZyA9IHtcblx0b3B0aW9uczoge1xuXHRcdHNlYXJjaDogJ2hlYWx0aHknLFxuXHRcdGtleTogbnVsbCxcblx0XHRwcm94eTogJ3Byb3h5LnBocCcsXG5cdFx0aW1nUHJveHk6IG51bGwsXG5cdFx0dGVtcGxhdGU6ICd0ZW1wbGF0ZTEnLFxuXHRcdGVuZHBvaW50czoge1xuXHRcdFx0ZGV2ZWxvcG1lbnQ6ICdzcmMvanMvZGF0YS9zZXJ2aWNlLXNoaW0uanNvbicsXG5cdFx0XHRwcm9kdWN0aW9uOiAnaHR0cDovL2l0dW5lcy5hcHBsZS5jb20vbG9va3VwP2lkPTQwMDI3NDkzNCdcblx0XHR9LFxuXHRcdGVudjogJ3Byb2R1Y3Rpb24nXG5cdH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNvbmZpZzsiLCIvKiFcbiAqIG11c3RhY2hlLmpzIC0gTG9naWMtbGVzcyB7e211c3RhY2hlfX0gdGVtcGxhdGVzIHdpdGggSmF2YVNjcmlwdFxuICogaHR0cDovL2dpdGh1Yi5jb20vamFubC9tdXN0YWNoZS5qc1xuICovXG5cbi8qZ2xvYmFsIGRlZmluZTogZmFsc2UgTXVzdGFjaGU6IHRydWUqL1xuXG4oZnVuY3Rpb24gZGVmaW5lTXVzdGFjaGUgKGdsb2JhbCwgZmFjdG9yeSkge1xuICBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIGV4cG9ydHMgJiYgdHlwZW9mIGV4cG9ydHMubm9kZU5hbWUgIT09ICdzdHJpbmcnKSB7XG4gICAgZmFjdG9yeShleHBvcnRzKTsgLy8gQ29tbW9uSlNcbiAgfSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoWydleHBvcnRzJ10sIGZhY3RvcnkpOyAvLyBBTURcbiAgfSBlbHNlIHtcbiAgICBnbG9iYWwuTXVzdGFjaGUgPSB7fTtcbiAgICBmYWN0b3J5KGdsb2JhbC5NdXN0YWNoZSk7IC8vIHNjcmlwdCwgd3NoLCBhc3BcbiAgfVxufSh0aGlzLCBmdW5jdGlvbiBtdXN0YWNoZUZhY3RvcnkgKG11c3RhY2hlKSB7XG5cbiAgdmFyIG9iamVjdFRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcbiAgdmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uIGlzQXJyYXlQb2x5ZmlsbCAob2JqZWN0KSB7XG4gICAgcmV0dXJuIG9iamVjdFRvU3RyaW5nLmNhbGwob2JqZWN0KSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbiAgfTtcblxuICBmdW5jdGlvbiBpc0Z1bmN0aW9uIChvYmplY3QpIHtcbiAgICByZXR1cm4gdHlwZW9mIG9iamVjdCA9PT0gJ2Z1bmN0aW9uJztcbiAgfVxuXG4gIC8qKlxuICAgKiBNb3JlIGNvcnJlY3QgdHlwZW9mIHN0cmluZyBoYW5kbGluZyBhcnJheVxuICAgKiB3aGljaCBub3JtYWxseSByZXR1cm5zIHR5cGVvZiAnb2JqZWN0J1xuICAgKi9cbiAgZnVuY3Rpb24gdHlwZVN0ciAob2JqKSB7XG4gICAgcmV0dXJuIGlzQXJyYXkob2JqKSA/ICdhcnJheScgOiB0eXBlb2Ygb2JqO1xuICB9XG5cbiAgZnVuY3Rpb24gZXNjYXBlUmVnRXhwIChzdHJpbmcpIHtcbiAgICByZXR1cm4gc3RyaW5nLnJlcGxhY2UoL1tcXC1cXFtcXF17fSgpKis/LixcXFxcXFxeJHwjXFxzXS9nLCAnXFxcXCQmJyk7XG4gIH1cblxuICAvKipcbiAgICogTnVsbCBzYWZlIHdheSBvZiBjaGVja2luZyB3aGV0aGVyIG9yIG5vdCBhbiBvYmplY3QsXG4gICAqIGluY2x1ZGluZyBpdHMgcHJvdG90eXBlLCBoYXMgYSBnaXZlbiBwcm9wZXJ0eVxuICAgKi9cbiAgZnVuY3Rpb24gaGFzUHJvcGVydHkgKG9iaiwgcHJvcE5hbWUpIHtcbiAgICByZXR1cm4gb2JqICE9IG51bGwgJiYgdHlwZW9mIG9iaiA9PT0gJ29iamVjdCcgJiYgKHByb3BOYW1lIGluIG9iaik7XG4gIH1cblxuICAvLyBXb3JrYXJvdW5kIGZvciBodHRwczovL2lzc3Vlcy5hcGFjaGUub3JnL2ppcmEvYnJvd3NlL0NPVUNIREItNTc3XG4gIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vamFubC9tdXN0YWNoZS5qcy9pc3N1ZXMvMTg5XG4gIHZhciByZWdFeHBUZXN0ID0gUmVnRXhwLnByb3RvdHlwZS50ZXN0O1xuICBmdW5jdGlvbiB0ZXN0UmVnRXhwIChyZSwgc3RyaW5nKSB7XG4gICAgcmV0dXJuIHJlZ0V4cFRlc3QuY2FsbChyZSwgc3RyaW5nKTtcbiAgfVxuXG4gIHZhciBub25TcGFjZVJlID0gL1xcUy87XG4gIGZ1bmN0aW9uIGlzV2hpdGVzcGFjZSAoc3RyaW5nKSB7XG4gICAgcmV0dXJuICF0ZXN0UmVnRXhwKG5vblNwYWNlUmUsIHN0cmluZyk7XG4gIH1cblxuICB2YXIgZW50aXR5TWFwID0ge1xuICAgICcmJzogJyZhbXA7JyxcbiAgICAnPCc6ICcmbHQ7JyxcbiAgICAnPic6ICcmZ3Q7JyxcbiAgICAnXCInOiAnJnF1b3Q7JyxcbiAgICBcIidcIjogJyYjMzk7JyxcbiAgICAnLyc6ICcmI3gyRjsnLFxuICAgICdgJzogJyYjeDYwOycsXG4gICAgJz0nOiAnJiN4M0Q7J1xuICB9O1xuXG4gIGZ1bmN0aW9uIGVzY2FwZUh0bWwgKHN0cmluZykge1xuICAgIHJldHVybiBTdHJpbmcoc3RyaW5nKS5yZXBsYWNlKC9bJjw+XCInYD1cXC9dL2csIGZ1bmN0aW9uIGZyb21FbnRpdHlNYXAgKHMpIHtcbiAgICAgIHJldHVybiBlbnRpdHlNYXBbc107XG4gICAgfSk7XG4gIH1cblxuICB2YXIgd2hpdGVSZSA9IC9cXHMqLztcbiAgdmFyIHNwYWNlUmUgPSAvXFxzKy87XG4gIHZhciBlcXVhbHNSZSA9IC9cXHMqPS87XG4gIHZhciBjdXJseVJlID0gL1xccypcXH0vO1xuICB2YXIgdGFnUmUgPSAvI3xcXF58XFwvfD58XFx7fCZ8PXwhLztcblxuICAvKipcbiAgICogQnJlYWtzIHVwIHRoZSBnaXZlbiBgdGVtcGxhdGVgIHN0cmluZyBpbnRvIGEgdHJlZSBvZiB0b2tlbnMuIElmIHRoZSBgdGFnc2BcbiAgICogYXJndW1lbnQgaXMgZ2l2ZW4gaGVyZSBpdCBtdXN0IGJlIGFuIGFycmF5IHdpdGggdHdvIHN0cmluZyB2YWx1ZXM6IHRoZVxuICAgKiBvcGVuaW5nIGFuZCBjbG9zaW5nIHRhZ3MgdXNlZCBpbiB0aGUgdGVtcGxhdGUgKGUuZy4gWyBcIjwlXCIsIFwiJT5cIiBdKS4gT2ZcbiAgICogY291cnNlLCB0aGUgZGVmYXVsdCBpcyB0byB1c2UgbXVzdGFjaGVzIChpLmUuIG11c3RhY2hlLnRhZ3MpLlxuICAgKlxuICAgKiBBIHRva2VuIGlzIGFuIGFycmF5IHdpdGggYXQgbGVhc3QgNCBlbGVtZW50cy4gVGhlIGZpcnN0IGVsZW1lbnQgaXMgdGhlXG4gICAqIG11c3RhY2hlIHN5bWJvbCB0aGF0IHdhcyB1c2VkIGluc2lkZSB0aGUgdGFnLCBlLmcuIFwiI1wiIG9yIFwiJlwiLiBJZiB0aGUgdGFnXG4gICAqIGRpZCBub3QgY29udGFpbiBhIHN5bWJvbCAoaS5lLiB7e215VmFsdWV9fSkgdGhpcyBlbGVtZW50IGlzIFwibmFtZVwiLiBGb3JcbiAgICogYWxsIHRleHQgdGhhdCBhcHBlYXJzIG91dHNpZGUgYSBzeW1ib2wgdGhpcyBlbGVtZW50IGlzIFwidGV4dFwiLlxuICAgKlxuICAgKiBUaGUgc2Vjb25kIGVsZW1lbnQgb2YgYSB0b2tlbiBpcyBpdHMgXCJ2YWx1ZVwiLiBGb3IgbXVzdGFjaGUgdGFncyB0aGlzIGlzXG4gICAqIHdoYXRldmVyIGVsc2Ugd2FzIGluc2lkZSB0aGUgdGFnIGJlc2lkZXMgdGhlIG9wZW5pbmcgc3ltYm9sLiBGb3IgdGV4dCB0b2tlbnNcbiAgICogdGhpcyBpcyB0aGUgdGV4dCBpdHNlbGYuXG4gICAqXG4gICAqIFRoZSB0aGlyZCBhbmQgZm91cnRoIGVsZW1lbnRzIG9mIHRoZSB0b2tlbiBhcmUgdGhlIHN0YXJ0IGFuZCBlbmQgaW5kaWNlcyxcbiAgICogcmVzcGVjdGl2ZWx5LCBvZiB0aGUgdG9rZW4gaW4gdGhlIG9yaWdpbmFsIHRlbXBsYXRlLlxuICAgKlxuICAgKiBUb2tlbnMgdGhhdCBhcmUgdGhlIHJvb3Qgbm9kZSBvZiBhIHN1YnRyZWUgY29udGFpbiB0d28gbW9yZSBlbGVtZW50czogMSkgYW5cbiAgICogYXJyYXkgb2YgdG9rZW5zIGluIHRoZSBzdWJ0cmVlIGFuZCAyKSB0aGUgaW5kZXggaW4gdGhlIG9yaWdpbmFsIHRlbXBsYXRlIGF0XG4gICAqIHdoaWNoIHRoZSBjbG9zaW5nIHRhZyBmb3IgdGhhdCBzZWN0aW9uIGJlZ2lucy5cbiAgICovXG4gIGZ1bmN0aW9uIHBhcnNlVGVtcGxhdGUgKHRlbXBsYXRlLCB0YWdzKSB7XG4gICAgaWYgKCF0ZW1wbGF0ZSlcbiAgICAgIHJldHVybiBbXTtcblxuICAgIHZhciBzZWN0aW9ucyA9IFtdOyAgICAgLy8gU3RhY2sgdG8gaG9sZCBzZWN0aW9uIHRva2Vuc1xuICAgIHZhciB0b2tlbnMgPSBbXTsgICAgICAgLy8gQnVmZmVyIHRvIGhvbGQgdGhlIHRva2Vuc1xuICAgIHZhciBzcGFjZXMgPSBbXTsgICAgICAgLy8gSW5kaWNlcyBvZiB3aGl0ZXNwYWNlIHRva2VucyBvbiB0aGUgY3VycmVudCBsaW5lXG4gICAgdmFyIGhhc1RhZyA9IGZhbHNlOyAgICAvLyBJcyB0aGVyZSBhIHt7dGFnfX0gb24gdGhlIGN1cnJlbnQgbGluZT9cbiAgICB2YXIgbm9uU3BhY2UgPSBmYWxzZTsgIC8vIElzIHRoZXJlIGEgbm9uLXNwYWNlIGNoYXIgb24gdGhlIGN1cnJlbnQgbGluZT9cblxuICAgIC8vIFN0cmlwcyBhbGwgd2hpdGVzcGFjZSB0b2tlbnMgYXJyYXkgZm9yIHRoZSBjdXJyZW50IGxpbmVcbiAgICAvLyBpZiB0aGVyZSB3YXMgYSB7eyN0YWd9fSBvbiBpdCBhbmQgb3RoZXJ3aXNlIG9ubHkgc3BhY2UuXG4gICAgZnVuY3Rpb24gc3RyaXBTcGFjZSAoKSB7XG4gICAgICBpZiAoaGFzVGFnICYmICFub25TcGFjZSkge1xuICAgICAgICB3aGlsZSAoc3BhY2VzLmxlbmd0aClcbiAgICAgICAgICBkZWxldGUgdG9rZW5zW3NwYWNlcy5wb3AoKV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzcGFjZXMgPSBbXTtcbiAgICAgIH1cblxuICAgICAgaGFzVGFnID0gZmFsc2U7XG4gICAgICBub25TcGFjZSA9IGZhbHNlO1xuICAgIH1cblxuICAgIHZhciBvcGVuaW5nVGFnUmUsIGNsb3NpbmdUYWdSZSwgY2xvc2luZ0N1cmx5UmU7XG4gICAgZnVuY3Rpb24gY29tcGlsZVRhZ3MgKHRhZ3NUb0NvbXBpbGUpIHtcbiAgICAgIGlmICh0eXBlb2YgdGFnc1RvQ29tcGlsZSA9PT0gJ3N0cmluZycpXG4gICAgICAgIHRhZ3NUb0NvbXBpbGUgPSB0YWdzVG9Db21waWxlLnNwbGl0KHNwYWNlUmUsIDIpO1xuXG4gICAgICBpZiAoIWlzQXJyYXkodGFnc1RvQ29tcGlsZSkgfHwgdGFnc1RvQ29tcGlsZS5sZW5ndGggIT09IDIpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCB0YWdzOiAnICsgdGFnc1RvQ29tcGlsZSk7XG5cbiAgICAgIG9wZW5pbmdUYWdSZSA9IG5ldyBSZWdFeHAoZXNjYXBlUmVnRXhwKHRhZ3NUb0NvbXBpbGVbMF0pICsgJ1xcXFxzKicpO1xuICAgICAgY2xvc2luZ1RhZ1JlID0gbmV3IFJlZ0V4cCgnXFxcXHMqJyArIGVzY2FwZVJlZ0V4cCh0YWdzVG9Db21waWxlWzFdKSk7XG4gICAgICBjbG9zaW5nQ3VybHlSZSA9IG5ldyBSZWdFeHAoJ1xcXFxzKicgKyBlc2NhcGVSZWdFeHAoJ30nICsgdGFnc1RvQ29tcGlsZVsxXSkpO1xuICAgIH1cblxuICAgIGNvbXBpbGVUYWdzKHRhZ3MgfHwgbXVzdGFjaGUudGFncyk7XG5cbiAgICB2YXIgc2Nhbm5lciA9IG5ldyBTY2FubmVyKHRlbXBsYXRlKTtcblxuICAgIHZhciBzdGFydCwgdHlwZSwgdmFsdWUsIGNociwgdG9rZW4sIG9wZW5TZWN0aW9uO1xuICAgIHdoaWxlICghc2Nhbm5lci5lb3MoKSkge1xuICAgICAgc3RhcnQgPSBzY2FubmVyLnBvcztcblxuICAgICAgLy8gTWF0Y2ggYW55IHRleHQgYmV0d2VlbiB0YWdzLlxuICAgICAgdmFsdWUgPSBzY2FubmVyLnNjYW5VbnRpbChvcGVuaW5nVGFnUmUpO1xuXG4gICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIHZhbHVlTGVuZ3RoID0gdmFsdWUubGVuZ3RoOyBpIDwgdmFsdWVMZW5ndGg7ICsraSkge1xuICAgICAgICAgIGNociA9IHZhbHVlLmNoYXJBdChpKTtcblxuICAgICAgICAgIGlmIChpc1doaXRlc3BhY2UoY2hyKSkge1xuICAgICAgICAgICAgc3BhY2VzLnB1c2godG9rZW5zLmxlbmd0aCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5vblNwYWNlID0gdHJ1ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0b2tlbnMucHVzaChbICd0ZXh0JywgY2hyLCBzdGFydCwgc3RhcnQgKyAxIF0pO1xuICAgICAgICAgIHN0YXJ0ICs9IDE7XG5cbiAgICAgICAgICAvLyBDaGVjayBmb3Igd2hpdGVzcGFjZSBvbiB0aGUgY3VycmVudCBsaW5lLlxuICAgICAgICAgIGlmIChjaHIgPT09ICdcXG4nKVxuICAgICAgICAgICAgc3RyaXBTcGFjZSgpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIE1hdGNoIHRoZSBvcGVuaW5nIHRhZy5cbiAgICAgIGlmICghc2Nhbm5lci5zY2FuKG9wZW5pbmdUYWdSZSkpXG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBoYXNUYWcgPSB0cnVlO1xuXG4gICAgICAvLyBHZXQgdGhlIHRhZyB0eXBlLlxuICAgICAgdHlwZSA9IHNjYW5uZXIuc2Nhbih0YWdSZSkgfHwgJ25hbWUnO1xuICAgICAgc2Nhbm5lci5zY2FuKHdoaXRlUmUpO1xuXG4gICAgICAvLyBHZXQgdGhlIHRhZyB2YWx1ZS5cbiAgICAgIGlmICh0eXBlID09PSAnPScpIHtcbiAgICAgICAgdmFsdWUgPSBzY2FubmVyLnNjYW5VbnRpbChlcXVhbHNSZSk7XG4gICAgICAgIHNjYW5uZXIuc2NhbihlcXVhbHNSZSk7XG4gICAgICAgIHNjYW5uZXIuc2NhblVudGlsKGNsb3NpbmdUYWdSZSk7XG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICd7Jykge1xuICAgICAgICB2YWx1ZSA9IHNjYW5uZXIuc2NhblVudGlsKGNsb3NpbmdDdXJseVJlKTtcbiAgICAgICAgc2Nhbm5lci5zY2FuKGN1cmx5UmUpO1xuICAgICAgICBzY2FubmVyLnNjYW5VbnRpbChjbG9zaW5nVGFnUmUpO1xuICAgICAgICB0eXBlID0gJyYnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFsdWUgPSBzY2FubmVyLnNjYW5VbnRpbChjbG9zaW5nVGFnUmUpO1xuICAgICAgfVxuXG4gICAgICAvLyBNYXRjaCB0aGUgY2xvc2luZyB0YWcuXG4gICAgICBpZiAoIXNjYW5uZXIuc2NhbihjbG9zaW5nVGFnUmUpKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuY2xvc2VkIHRhZyBhdCAnICsgc2Nhbm5lci5wb3MpO1xuXG4gICAgICB0b2tlbiA9IFsgdHlwZSwgdmFsdWUsIHN0YXJ0LCBzY2FubmVyLnBvcyBdO1xuICAgICAgdG9rZW5zLnB1c2godG9rZW4pO1xuXG4gICAgICBpZiAodHlwZSA9PT0gJyMnIHx8IHR5cGUgPT09ICdeJykge1xuICAgICAgICBzZWN0aW9ucy5wdXNoKHRva2VuKTtcbiAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJy8nKSB7XG4gICAgICAgIC8vIENoZWNrIHNlY3Rpb24gbmVzdGluZy5cbiAgICAgICAgb3BlblNlY3Rpb24gPSBzZWN0aW9ucy5wb3AoKTtcblxuICAgICAgICBpZiAoIW9wZW5TZWN0aW9uKVxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVW5vcGVuZWQgc2VjdGlvbiBcIicgKyB2YWx1ZSArICdcIiBhdCAnICsgc3RhcnQpO1xuXG4gICAgICAgIGlmIChvcGVuU2VjdGlvblsxXSAhPT0gdmFsdWUpXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmNsb3NlZCBzZWN0aW9uIFwiJyArIG9wZW5TZWN0aW9uWzFdICsgJ1wiIGF0ICcgKyBzdGFydCk7XG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICduYW1lJyB8fCB0eXBlID09PSAneycgfHwgdHlwZSA9PT0gJyYnKSB7XG4gICAgICAgIG5vblNwYWNlID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJz0nKSB7XG4gICAgICAgIC8vIFNldCB0aGUgdGFncyBmb3IgdGhlIG5leHQgdGltZSBhcm91bmQuXG4gICAgICAgIGNvbXBpbGVUYWdzKHZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBNYWtlIHN1cmUgdGhlcmUgYXJlIG5vIG9wZW4gc2VjdGlvbnMgd2hlbiB3ZSdyZSBkb25lLlxuICAgIG9wZW5TZWN0aW9uID0gc2VjdGlvbnMucG9wKCk7XG5cbiAgICBpZiAob3BlblNlY3Rpb24pXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuY2xvc2VkIHNlY3Rpb24gXCInICsgb3BlblNlY3Rpb25bMV0gKyAnXCIgYXQgJyArIHNjYW5uZXIucG9zKTtcblxuICAgIHJldHVybiBuZXN0VG9rZW5zKHNxdWFzaFRva2Vucyh0b2tlbnMpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb21iaW5lcyB0aGUgdmFsdWVzIG9mIGNvbnNlY3V0aXZlIHRleHQgdG9rZW5zIGluIHRoZSBnaXZlbiBgdG9rZW5zYCBhcnJheVxuICAgKiB0byBhIHNpbmdsZSB0b2tlbi5cbiAgICovXG4gIGZ1bmN0aW9uIHNxdWFzaFRva2VucyAodG9rZW5zKSB7XG4gICAgdmFyIHNxdWFzaGVkVG9rZW5zID0gW107XG5cbiAgICB2YXIgdG9rZW4sIGxhc3RUb2tlbjtcbiAgICBmb3IgKHZhciBpID0gMCwgbnVtVG9rZW5zID0gdG9rZW5zLmxlbmd0aDsgaSA8IG51bVRva2VuczsgKytpKSB7XG4gICAgICB0b2tlbiA9IHRva2Vuc1tpXTtcblxuICAgICAgaWYgKHRva2VuKSB7XG4gICAgICAgIGlmICh0b2tlblswXSA9PT0gJ3RleHQnICYmIGxhc3RUb2tlbiAmJiBsYXN0VG9rZW5bMF0gPT09ICd0ZXh0Jykge1xuICAgICAgICAgIGxhc3RUb2tlblsxXSArPSB0b2tlblsxXTtcbiAgICAgICAgICBsYXN0VG9rZW5bM10gPSB0b2tlblszXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzcXVhc2hlZFRva2Vucy5wdXNoKHRva2VuKTtcbiAgICAgICAgICBsYXN0VG9rZW4gPSB0b2tlbjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBzcXVhc2hlZFRva2VucztcbiAgfVxuXG4gIC8qKlxuICAgKiBGb3JtcyB0aGUgZ2l2ZW4gYXJyYXkgb2YgYHRva2Vuc2AgaW50byBhIG5lc3RlZCB0cmVlIHN0cnVjdHVyZSB3aGVyZVxuICAgKiB0b2tlbnMgdGhhdCByZXByZXNlbnQgYSBzZWN0aW9uIGhhdmUgdHdvIGFkZGl0aW9uYWwgaXRlbXM6IDEpIGFuIGFycmF5IG9mXG4gICAqIGFsbCB0b2tlbnMgdGhhdCBhcHBlYXIgaW4gdGhhdCBzZWN0aW9uIGFuZCAyKSB0aGUgaW5kZXggaW4gdGhlIG9yaWdpbmFsXG4gICAqIHRlbXBsYXRlIHRoYXQgcmVwcmVzZW50cyB0aGUgZW5kIG9mIHRoYXQgc2VjdGlvbi5cbiAgICovXG4gIGZ1bmN0aW9uIG5lc3RUb2tlbnMgKHRva2Vucykge1xuICAgIHZhciBuZXN0ZWRUb2tlbnMgPSBbXTtcbiAgICB2YXIgY29sbGVjdG9yID0gbmVzdGVkVG9rZW5zO1xuICAgIHZhciBzZWN0aW9ucyA9IFtdO1xuXG4gICAgdmFyIHRva2VuLCBzZWN0aW9uO1xuICAgIGZvciAodmFyIGkgPSAwLCBudW1Ub2tlbnMgPSB0b2tlbnMubGVuZ3RoOyBpIDwgbnVtVG9rZW5zOyArK2kpIHtcbiAgICAgIHRva2VuID0gdG9rZW5zW2ldO1xuXG4gICAgICBzd2l0Y2ggKHRva2VuWzBdKSB7XG4gICAgICAgIGNhc2UgJyMnOlxuICAgICAgICBjYXNlICdeJzpcbiAgICAgICAgICBjb2xsZWN0b3IucHVzaCh0b2tlbik7XG4gICAgICAgICAgc2VjdGlvbnMucHVzaCh0b2tlbik7XG4gICAgICAgICAgY29sbGVjdG9yID0gdG9rZW5bNF0gPSBbXTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnLyc6XG4gICAgICAgICAgc2VjdGlvbiA9IHNlY3Rpb25zLnBvcCgpO1xuICAgICAgICAgIHNlY3Rpb25bNV0gPSB0b2tlblsyXTtcbiAgICAgICAgICBjb2xsZWN0b3IgPSBzZWN0aW9ucy5sZW5ndGggPiAwID8gc2VjdGlvbnNbc2VjdGlvbnMubGVuZ3RoIC0gMV1bNF0gOiBuZXN0ZWRUb2tlbnM7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgY29sbGVjdG9yLnB1c2godG9rZW4pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBuZXN0ZWRUb2tlbnM7XG4gIH1cblxuICAvKipcbiAgICogQSBzaW1wbGUgc3RyaW5nIHNjYW5uZXIgdGhhdCBpcyB1c2VkIGJ5IHRoZSB0ZW1wbGF0ZSBwYXJzZXIgdG8gZmluZFxuICAgKiB0b2tlbnMgaW4gdGVtcGxhdGUgc3RyaW5ncy5cbiAgICovXG4gIGZ1bmN0aW9uIFNjYW5uZXIgKHN0cmluZykge1xuICAgIHRoaXMuc3RyaW5nID0gc3RyaW5nO1xuICAgIHRoaXMudGFpbCA9IHN0cmluZztcbiAgICB0aGlzLnBvcyA9IDA7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIHRhaWwgaXMgZW1wdHkgKGVuZCBvZiBzdHJpbmcpLlxuICAgKi9cbiAgU2Nhbm5lci5wcm90b3R5cGUuZW9zID0gZnVuY3Rpb24gZW9zICgpIHtcbiAgICByZXR1cm4gdGhpcy50YWlsID09PSAnJztcbiAgfTtcblxuICAvKipcbiAgICogVHJpZXMgdG8gbWF0Y2ggdGhlIGdpdmVuIHJlZ3VsYXIgZXhwcmVzc2lvbiBhdCB0aGUgY3VycmVudCBwb3NpdGlvbi5cbiAgICogUmV0dXJucyB0aGUgbWF0Y2hlZCB0ZXh0IGlmIGl0IGNhbiBtYXRjaCwgdGhlIGVtcHR5IHN0cmluZyBvdGhlcndpc2UuXG4gICAqL1xuICBTY2FubmVyLnByb3RvdHlwZS5zY2FuID0gZnVuY3Rpb24gc2NhbiAocmUpIHtcbiAgICB2YXIgbWF0Y2ggPSB0aGlzLnRhaWwubWF0Y2gocmUpO1xuXG4gICAgaWYgKCFtYXRjaCB8fCBtYXRjaC5pbmRleCAhPT0gMClcbiAgICAgIHJldHVybiAnJztcblxuICAgIHZhciBzdHJpbmcgPSBtYXRjaFswXTtcblxuICAgIHRoaXMudGFpbCA9IHRoaXMudGFpbC5zdWJzdHJpbmcoc3RyaW5nLmxlbmd0aCk7XG4gICAgdGhpcy5wb3MgKz0gc3RyaW5nLmxlbmd0aDtcblxuICAgIHJldHVybiBzdHJpbmc7XG4gIH07XG5cbiAgLyoqXG4gICAqIFNraXBzIGFsbCB0ZXh0IHVudGlsIHRoZSBnaXZlbiByZWd1bGFyIGV4cHJlc3Npb24gY2FuIGJlIG1hdGNoZWQuIFJldHVybnNcbiAgICogdGhlIHNraXBwZWQgc3RyaW5nLCB3aGljaCBpcyB0aGUgZW50aXJlIHRhaWwgaWYgbm8gbWF0Y2ggY2FuIGJlIG1hZGUuXG4gICAqL1xuICBTY2FubmVyLnByb3RvdHlwZS5zY2FuVW50aWwgPSBmdW5jdGlvbiBzY2FuVW50aWwgKHJlKSB7XG4gICAgdmFyIGluZGV4ID0gdGhpcy50YWlsLnNlYXJjaChyZSksIG1hdGNoO1xuXG4gICAgc3dpdGNoIChpbmRleCkge1xuICAgICAgY2FzZSAtMTpcbiAgICAgICAgbWF0Y2ggPSB0aGlzLnRhaWw7XG4gICAgICAgIHRoaXMudGFpbCA9ICcnO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgbWF0Y2ggPSAnJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBtYXRjaCA9IHRoaXMudGFpbC5zdWJzdHJpbmcoMCwgaW5kZXgpO1xuICAgICAgICB0aGlzLnRhaWwgPSB0aGlzLnRhaWwuc3Vic3RyaW5nKGluZGV4KTtcbiAgICB9XG5cbiAgICB0aGlzLnBvcyArPSBtYXRjaC5sZW5ndGg7XG5cbiAgICByZXR1cm4gbWF0Y2g7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJlcHJlc2VudHMgYSByZW5kZXJpbmcgY29udGV4dCBieSB3cmFwcGluZyBhIHZpZXcgb2JqZWN0IGFuZFxuICAgKiBtYWludGFpbmluZyBhIHJlZmVyZW5jZSB0byB0aGUgcGFyZW50IGNvbnRleHQuXG4gICAqL1xuICBmdW5jdGlvbiBDb250ZXh0ICh2aWV3LCBwYXJlbnRDb250ZXh0KSB7XG4gICAgdGhpcy52aWV3ID0gdmlldztcbiAgICB0aGlzLmNhY2hlID0geyAnLic6IHRoaXMudmlldyB9O1xuICAgIHRoaXMucGFyZW50ID0gcGFyZW50Q29udGV4dDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IGNvbnRleHQgdXNpbmcgdGhlIGdpdmVuIHZpZXcgd2l0aCB0aGlzIGNvbnRleHRcbiAgICogYXMgdGhlIHBhcmVudC5cbiAgICovXG4gIENvbnRleHQucHJvdG90eXBlLnB1c2ggPSBmdW5jdGlvbiBwdXNoICh2aWV3KSB7XG4gICAgcmV0dXJuIG5ldyBDb250ZXh0KHZpZXcsIHRoaXMpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB2YWx1ZSBvZiB0aGUgZ2l2ZW4gbmFtZSBpbiB0aGlzIGNvbnRleHQsIHRyYXZlcnNpbmdcbiAgICogdXAgdGhlIGNvbnRleHQgaGllcmFyY2h5IGlmIHRoZSB2YWx1ZSBpcyBhYnNlbnQgaW4gdGhpcyBjb250ZXh0J3Mgdmlldy5cbiAgICovXG4gIENvbnRleHQucHJvdG90eXBlLmxvb2t1cCA9IGZ1bmN0aW9uIGxvb2t1cCAobmFtZSkge1xuICAgIHZhciBjYWNoZSA9IHRoaXMuY2FjaGU7XG5cbiAgICB2YXIgdmFsdWU7XG4gICAgaWYgKGNhY2hlLmhhc093blByb3BlcnR5KG5hbWUpKSB7XG4gICAgICB2YWx1ZSA9IGNhY2hlW25hbWVdO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgY29udGV4dCA9IHRoaXMsIG5hbWVzLCBpbmRleCwgbG9va3VwSGl0ID0gZmFsc2U7XG5cbiAgICAgIHdoaWxlIChjb250ZXh0KSB7XG4gICAgICAgIGlmIChuYW1lLmluZGV4T2YoJy4nKSA+IDApIHtcbiAgICAgICAgICB2YWx1ZSA9IGNvbnRleHQudmlldztcbiAgICAgICAgICBuYW1lcyA9IG5hbWUuc3BsaXQoJy4nKTtcbiAgICAgICAgICBpbmRleCA9IDA7XG5cbiAgICAgICAgICAvKipcbiAgICAgICAgICAgKiBVc2luZyB0aGUgZG90IG5vdGlvbiBwYXRoIGluIGBuYW1lYCwgd2UgZGVzY2VuZCB0aHJvdWdoIHRoZVxuICAgICAgICAgICAqIG5lc3RlZCBvYmplY3RzLlxuICAgICAgICAgICAqXG4gICAgICAgICAgICogVG8gYmUgY2VydGFpbiB0aGF0IHRoZSBsb29rdXAgaGFzIGJlZW4gc3VjY2Vzc2Z1bCwgd2UgaGF2ZSB0b1xuICAgICAgICAgICAqIGNoZWNrIGlmIHRoZSBsYXN0IG9iamVjdCBpbiB0aGUgcGF0aCBhY3R1YWxseSBoYXMgdGhlIHByb3BlcnR5XG4gICAgICAgICAgICogd2UgYXJlIGxvb2tpbmcgZm9yLiBXZSBzdG9yZSB0aGUgcmVzdWx0IGluIGBsb29rdXBIaXRgLlxuICAgICAgICAgICAqXG4gICAgICAgICAgICogVGhpcyBpcyBzcGVjaWFsbHkgbmVjZXNzYXJ5IGZvciB3aGVuIHRoZSB2YWx1ZSBoYXMgYmVlbiBzZXQgdG9cbiAgICAgICAgICAgKiBgdW5kZWZpbmVkYCBhbmQgd2Ugd2FudCB0byBhdm9pZCBsb29raW5nIHVwIHBhcmVudCBjb250ZXh0cy5cbiAgICAgICAgICAgKiovXG4gICAgICAgICAgd2hpbGUgKHZhbHVlICE9IG51bGwgJiYgaW5kZXggPCBuYW1lcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmIChpbmRleCA9PT0gbmFtZXMubGVuZ3RoIC0gMSlcbiAgICAgICAgICAgICAgbG9va3VwSGl0ID0gaGFzUHJvcGVydHkodmFsdWUsIG5hbWVzW2luZGV4XSk7XG5cbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWVbbmFtZXNbaW5kZXgrK11dO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YWx1ZSA9IGNvbnRleHQudmlld1tuYW1lXTtcbiAgICAgICAgICBsb29rdXBIaXQgPSBoYXNQcm9wZXJ0eShjb250ZXh0LnZpZXcsIG5hbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGxvb2t1cEhpdClcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjb250ZXh0ID0gY29udGV4dC5wYXJlbnQ7XG4gICAgICB9XG5cbiAgICAgIGNhY2hlW25hbWVdID0gdmFsdWU7XG4gICAgfVxuXG4gICAgaWYgKGlzRnVuY3Rpb24odmFsdWUpKVxuICAgICAgdmFsdWUgPSB2YWx1ZS5jYWxsKHRoaXMudmlldyk7XG5cbiAgICByZXR1cm4gdmFsdWU7XG4gIH07XG5cbiAgLyoqXG4gICAqIEEgV3JpdGVyIGtub3dzIGhvdyB0byB0YWtlIGEgc3RyZWFtIG9mIHRva2VucyBhbmQgcmVuZGVyIHRoZW0gdG8gYVxuICAgKiBzdHJpbmcsIGdpdmVuIGEgY29udGV4dC4gSXQgYWxzbyBtYWludGFpbnMgYSBjYWNoZSBvZiB0ZW1wbGF0ZXMgdG9cbiAgICogYXZvaWQgdGhlIG5lZWQgdG8gcGFyc2UgdGhlIHNhbWUgdGVtcGxhdGUgdHdpY2UuXG4gICAqL1xuICBmdW5jdGlvbiBXcml0ZXIgKCkge1xuICAgIHRoaXMuY2FjaGUgPSB7fTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbGVhcnMgYWxsIGNhY2hlZCB0ZW1wbGF0ZXMgaW4gdGhpcyB3cml0ZXIuXG4gICAqL1xuICBXcml0ZXIucHJvdG90eXBlLmNsZWFyQ2FjaGUgPSBmdW5jdGlvbiBjbGVhckNhY2hlICgpIHtcbiAgICB0aGlzLmNhY2hlID0ge307XG4gIH07XG5cbiAgLyoqXG4gICAqIFBhcnNlcyBhbmQgY2FjaGVzIHRoZSBnaXZlbiBgdGVtcGxhdGVgIGFuZCByZXR1cm5zIHRoZSBhcnJheSBvZiB0b2tlbnNcbiAgICogdGhhdCBpcyBnZW5lcmF0ZWQgZnJvbSB0aGUgcGFyc2UuXG4gICAqL1xuICBXcml0ZXIucHJvdG90eXBlLnBhcnNlID0gZnVuY3Rpb24gcGFyc2UgKHRlbXBsYXRlLCB0YWdzKSB7XG4gICAgdmFyIGNhY2hlID0gdGhpcy5jYWNoZTtcbiAgICB2YXIgdG9rZW5zID0gY2FjaGVbdGVtcGxhdGVdO1xuXG4gICAgaWYgKHRva2VucyA9PSBudWxsKVxuICAgICAgdG9rZW5zID0gY2FjaGVbdGVtcGxhdGVdID0gcGFyc2VUZW1wbGF0ZSh0ZW1wbGF0ZSwgdGFncyk7XG5cbiAgICByZXR1cm4gdG9rZW5zO1xuICB9O1xuXG4gIC8qKlxuICAgKiBIaWdoLWxldmVsIG1ldGhvZCB0aGF0IGlzIHVzZWQgdG8gcmVuZGVyIHRoZSBnaXZlbiBgdGVtcGxhdGVgIHdpdGhcbiAgICogdGhlIGdpdmVuIGB2aWV3YC5cbiAgICpcbiAgICogVGhlIG9wdGlvbmFsIGBwYXJ0aWFsc2AgYXJndW1lbnQgbWF5IGJlIGFuIG9iamVjdCB0aGF0IGNvbnRhaW5zIHRoZVxuICAgKiBuYW1lcyBhbmQgdGVtcGxhdGVzIG9mIHBhcnRpYWxzIHRoYXQgYXJlIHVzZWQgaW4gdGhlIHRlbXBsYXRlLiBJdCBtYXlcbiAgICogYWxzbyBiZSBhIGZ1bmN0aW9uIHRoYXQgaXMgdXNlZCB0byBsb2FkIHBhcnRpYWwgdGVtcGxhdGVzIG9uIHRoZSBmbHlcbiAgICogdGhhdCB0YWtlcyBhIHNpbmdsZSBhcmd1bWVudDogdGhlIG5hbWUgb2YgdGhlIHBhcnRpYWwuXG4gICAqL1xuICBXcml0ZXIucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uIHJlbmRlciAodGVtcGxhdGUsIHZpZXcsIHBhcnRpYWxzKSB7XG4gICAgdmFyIHRva2VucyA9IHRoaXMucGFyc2UodGVtcGxhdGUpO1xuICAgIHZhciBjb250ZXh0ID0gKHZpZXcgaW5zdGFuY2VvZiBDb250ZXh0KSA/IHZpZXcgOiBuZXcgQ29udGV4dCh2aWV3KTtcbiAgICByZXR1cm4gdGhpcy5yZW5kZXJUb2tlbnModG9rZW5zLCBjb250ZXh0LCBwYXJ0aWFscywgdGVtcGxhdGUpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBMb3ctbGV2ZWwgbWV0aG9kIHRoYXQgcmVuZGVycyB0aGUgZ2l2ZW4gYXJyYXkgb2YgYHRva2Vuc2AgdXNpbmdcbiAgICogdGhlIGdpdmVuIGBjb250ZXh0YCBhbmQgYHBhcnRpYWxzYC5cbiAgICpcbiAgICogTm90ZTogVGhlIGBvcmlnaW5hbFRlbXBsYXRlYCBpcyBvbmx5IGV2ZXIgdXNlZCB0byBleHRyYWN0IHRoZSBwb3J0aW9uXG4gICAqIG9mIHRoZSBvcmlnaW5hbCB0ZW1wbGF0ZSB0aGF0IHdhcyBjb250YWluZWQgaW4gYSBoaWdoZXItb3JkZXIgc2VjdGlvbi5cbiAgICogSWYgdGhlIHRlbXBsYXRlIGRvZXNuJ3QgdXNlIGhpZ2hlci1vcmRlciBzZWN0aW9ucywgdGhpcyBhcmd1bWVudCBtYXlcbiAgICogYmUgb21pdHRlZC5cbiAgICovXG4gIFdyaXRlci5wcm90b3R5cGUucmVuZGVyVG9rZW5zID0gZnVuY3Rpb24gcmVuZGVyVG9rZW5zICh0b2tlbnMsIGNvbnRleHQsIHBhcnRpYWxzLCBvcmlnaW5hbFRlbXBsYXRlKSB7XG4gICAgdmFyIGJ1ZmZlciA9ICcnO1xuXG4gICAgdmFyIHRva2VuLCBzeW1ib2wsIHZhbHVlO1xuICAgIGZvciAodmFyIGkgPSAwLCBudW1Ub2tlbnMgPSB0b2tlbnMubGVuZ3RoOyBpIDwgbnVtVG9rZW5zOyArK2kpIHtcbiAgICAgIHZhbHVlID0gdW5kZWZpbmVkO1xuICAgICAgdG9rZW4gPSB0b2tlbnNbaV07XG4gICAgICBzeW1ib2wgPSB0b2tlblswXTtcblxuICAgICAgaWYgKHN5bWJvbCA9PT0gJyMnKSB2YWx1ZSA9IHRoaXMucmVuZGVyU2VjdGlvbih0b2tlbiwgY29udGV4dCwgcGFydGlhbHMsIG9yaWdpbmFsVGVtcGxhdGUpO1xuICAgICAgZWxzZSBpZiAoc3ltYm9sID09PSAnXicpIHZhbHVlID0gdGhpcy5yZW5kZXJJbnZlcnRlZCh0b2tlbiwgY29udGV4dCwgcGFydGlhbHMsIG9yaWdpbmFsVGVtcGxhdGUpO1xuICAgICAgZWxzZSBpZiAoc3ltYm9sID09PSAnPicpIHZhbHVlID0gdGhpcy5yZW5kZXJQYXJ0aWFsKHRva2VuLCBjb250ZXh0LCBwYXJ0aWFscywgb3JpZ2luYWxUZW1wbGF0ZSk7XG4gICAgICBlbHNlIGlmIChzeW1ib2wgPT09ICcmJykgdmFsdWUgPSB0aGlzLnVuZXNjYXBlZFZhbHVlKHRva2VuLCBjb250ZXh0KTtcbiAgICAgIGVsc2UgaWYgKHN5bWJvbCA9PT0gJ25hbWUnKSB2YWx1ZSA9IHRoaXMuZXNjYXBlZFZhbHVlKHRva2VuLCBjb250ZXh0KTtcbiAgICAgIGVsc2UgaWYgKHN5bWJvbCA9PT0gJ3RleHQnKSB2YWx1ZSA9IHRoaXMucmF3VmFsdWUodG9rZW4pO1xuXG4gICAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZClcbiAgICAgICAgYnVmZmVyICs9IHZhbHVlO1xuICAgIH1cblxuICAgIHJldHVybiBidWZmZXI7XG4gIH07XG5cbiAgV3JpdGVyLnByb3RvdHlwZS5yZW5kZXJTZWN0aW9uID0gZnVuY3Rpb24gcmVuZGVyU2VjdGlvbiAodG9rZW4sIGNvbnRleHQsIHBhcnRpYWxzLCBvcmlnaW5hbFRlbXBsYXRlKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBidWZmZXIgPSAnJztcbiAgICB2YXIgdmFsdWUgPSBjb250ZXh0Lmxvb2t1cCh0b2tlblsxXSk7XG5cbiAgICAvLyBUaGlzIGZ1bmN0aW9uIGlzIHVzZWQgdG8gcmVuZGVyIGFuIGFyYml0cmFyeSB0ZW1wbGF0ZVxuICAgIC8vIGluIHRoZSBjdXJyZW50IGNvbnRleHQgYnkgaGlnaGVyLW9yZGVyIHNlY3Rpb25zLlxuICAgIGZ1bmN0aW9uIHN1YlJlbmRlciAodGVtcGxhdGUpIHtcbiAgICAgIHJldHVybiBzZWxmLnJlbmRlcih0ZW1wbGF0ZSwgY29udGV4dCwgcGFydGlhbHMpO1xuICAgIH1cblxuICAgIGlmICghdmFsdWUpIHJldHVybjtcblxuICAgIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgICAgZm9yICh2YXIgaiA9IDAsIHZhbHVlTGVuZ3RoID0gdmFsdWUubGVuZ3RoOyBqIDwgdmFsdWVMZW5ndGg7ICsraikge1xuICAgICAgICBidWZmZXIgKz0gdGhpcy5yZW5kZXJUb2tlbnModG9rZW5bNF0sIGNvbnRleHQucHVzaCh2YWx1ZVtqXSksIHBhcnRpYWxzLCBvcmlnaW5hbFRlbXBsYXRlKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgfHwgdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyB8fCB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInKSB7XG4gICAgICBidWZmZXIgKz0gdGhpcy5yZW5kZXJUb2tlbnModG9rZW5bNF0sIGNvbnRleHQucHVzaCh2YWx1ZSksIHBhcnRpYWxzLCBvcmlnaW5hbFRlbXBsYXRlKTtcbiAgICB9IGVsc2UgaWYgKGlzRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgICBpZiAodHlwZW9mIG9yaWdpbmFsVGVtcGxhdGUgIT09ICdzdHJpbmcnKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCB1c2UgaGlnaGVyLW9yZGVyIHNlY3Rpb25zIHdpdGhvdXQgdGhlIG9yaWdpbmFsIHRlbXBsYXRlJyk7XG5cbiAgICAgIC8vIEV4dHJhY3QgdGhlIHBvcnRpb24gb2YgdGhlIG9yaWdpbmFsIHRlbXBsYXRlIHRoYXQgdGhlIHNlY3Rpb24gY29udGFpbnMuXG4gICAgICB2YWx1ZSA9IHZhbHVlLmNhbGwoY29udGV4dC52aWV3LCBvcmlnaW5hbFRlbXBsYXRlLnNsaWNlKHRva2VuWzNdLCB0b2tlbls1XSksIHN1YlJlbmRlcik7XG5cbiAgICAgIGlmICh2YWx1ZSAhPSBudWxsKVxuICAgICAgICBidWZmZXIgKz0gdmFsdWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGJ1ZmZlciArPSB0aGlzLnJlbmRlclRva2Vucyh0b2tlbls0XSwgY29udGV4dCwgcGFydGlhbHMsIG9yaWdpbmFsVGVtcGxhdGUpO1xuICAgIH1cbiAgICByZXR1cm4gYnVmZmVyO1xuICB9O1xuXG4gIFdyaXRlci5wcm90b3R5cGUucmVuZGVySW52ZXJ0ZWQgPSBmdW5jdGlvbiByZW5kZXJJbnZlcnRlZCAodG9rZW4sIGNvbnRleHQsIHBhcnRpYWxzLCBvcmlnaW5hbFRlbXBsYXRlKSB7XG4gICAgdmFyIHZhbHVlID0gY29udGV4dC5sb29rdXAodG9rZW5bMV0pO1xuXG4gICAgLy8gVXNlIEphdmFTY3JpcHQncyBkZWZpbml0aW9uIG9mIGZhbHN5LiBJbmNsdWRlIGVtcHR5IGFycmF5cy5cbiAgICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2phbmwvbXVzdGFjaGUuanMvaXNzdWVzLzE4NlxuICAgIGlmICghdmFsdWUgfHwgKGlzQXJyYXkodmFsdWUpICYmIHZhbHVlLmxlbmd0aCA9PT0gMCkpXG4gICAgICByZXR1cm4gdGhpcy5yZW5kZXJUb2tlbnModG9rZW5bNF0sIGNvbnRleHQsIHBhcnRpYWxzLCBvcmlnaW5hbFRlbXBsYXRlKTtcbiAgfTtcblxuICBXcml0ZXIucHJvdG90eXBlLnJlbmRlclBhcnRpYWwgPSBmdW5jdGlvbiByZW5kZXJQYXJ0aWFsICh0b2tlbiwgY29udGV4dCwgcGFydGlhbHMpIHtcbiAgICBpZiAoIXBhcnRpYWxzKSByZXR1cm47XG5cbiAgICB2YXIgdmFsdWUgPSBpc0Z1bmN0aW9uKHBhcnRpYWxzKSA/IHBhcnRpYWxzKHRva2VuWzFdKSA6IHBhcnRpYWxzW3Rva2VuWzFdXTtcbiAgICBpZiAodmFsdWUgIT0gbnVsbClcbiAgICAgIHJldHVybiB0aGlzLnJlbmRlclRva2Vucyh0aGlzLnBhcnNlKHZhbHVlKSwgY29udGV4dCwgcGFydGlhbHMsIHZhbHVlKTtcbiAgfTtcblxuICBXcml0ZXIucHJvdG90eXBlLnVuZXNjYXBlZFZhbHVlID0gZnVuY3Rpb24gdW5lc2NhcGVkVmFsdWUgKHRva2VuLCBjb250ZXh0KSB7XG4gICAgdmFyIHZhbHVlID0gY29udGV4dC5sb29rdXAodG9rZW5bMV0pO1xuICAgIGlmICh2YWx1ZSAhPSBudWxsKVxuICAgICAgcmV0dXJuIHZhbHVlO1xuICB9O1xuXG4gIFdyaXRlci5wcm90b3R5cGUuZXNjYXBlZFZhbHVlID0gZnVuY3Rpb24gZXNjYXBlZFZhbHVlICh0b2tlbiwgY29udGV4dCkge1xuICAgIHZhciB2YWx1ZSA9IGNvbnRleHQubG9va3VwKHRva2VuWzFdKTtcbiAgICBpZiAodmFsdWUgIT0gbnVsbClcbiAgICAgIHJldHVybiBtdXN0YWNoZS5lc2NhcGUodmFsdWUpO1xuICB9O1xuXG4gIFdyaXRlci5wcm90b3R5cGUucmF3VmFsdWUgPSBmdW5jdGlvbiByYXdWYWx1ZSAodG9rZW4pIHtcbiAgICByZXR1cm4gdG9rZW5bMV07XG4gIH07XG5cbiAgbXVzdGFjaGUubmFtZSA9ICdtdXN0YWNoZS5qcyc7XG4gIG11c3RhY2hlLnZlcnNpb24gPSAnMi4yLjEnO1xuICBtdXN0YWNoZS50YWdzID0gWyAne3snLCAnfX0nIF07XG5cbiAgLy8gQWxsIGhpZ2gtbGV2ZWwgbXVzdGFjaGUuKiBmdW5jdGlvbnMgdXNlIHRoaXMgd3JpdGVyLlxuICB2YXIgZGVmYXVsdFdyaXRlciA9IG5ldyBXcml0ZXIoKTtcblxuICAvKipcbiAgICogQ2xlYXJzIGFsbCBjYWNoZWQgdGVtcGxhdGVzIGluIHRoZSBkZWZhdWx0IHdyaXRlci5cbiAgICovXG4gIG11c3RhY2hlLmNsZWFyQ2FjaGUgPSBmdW5jdGlvbiBjbGVhckNhY2hlICgpIHtcbiAgICByZXR1cm4gZGVmYXVsdFdyaXRlci5jbGVhckNhY2hlKCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFBhcnNlcyBhbmQgY2FjaGVzIHRoZSBnaXZlbiB0ZW1wbGF0ZSBpbiB0aGUgZGVmYXVsdCB3cml0ZXIgYW5kIHJldHVybnMgdGhlXG4gICAqIGFycmF5IG9mIHRva2VucyBpdCBjb250YWlucy4gRG9pbmcgdGhpcyBhaGVhZCBvZiB0aW1lIGF2b2lkcyB0aGUgbmVlZCB0b1xuICAgKiBwYXJzZSB0ZW1wbGF0ZXMgb24gdGhlIGZseSBhcyB0aGV5IGFyZSByZW5kZXJlZC5cbiAgICovXG4gIG11c3RhY2hlLnBhcnNlID0gZnVuY3Rpb24gcGFyc2UgKHRlbXBsYXRlLCB0YWdzKSB7XG4gICAgcmV0dXJuIGRlZmF1bHRXcml0ZXIucGFyc2UodGVtcGxhdGUsIHRhZ3MpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZW5kZXJzIHRoZSBgdGVtcGxhdGVgIHdpdGggdGhlIGdpdmVuIGB2aWV3YCBhbmQgYHBhcnRpYWxzYCB1c2luZyB0aGVcbiAgICogZGVmYXVsdCB3cml0ZXIuXG4gICAqL1xuICBtdXN0YWNoZS5yZW5kZXIgPSBmdW5jdGlvbiByZW5kZXIgKHRlbXBsYXRlLCB2aWV3LCBwYXJ0aWFscykge1xuICAgIGlmICh0eXBlb2YgdGVtcGxhdGUgIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIHRlbXBsYXRlISBUZW1wbGF0ZSBzaG91bGQgYmUgYSBcInN0cmluZ1wiICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAnYnV0IFwiJyArIHR5cGVTdHIodGVtcGxhdGUpICsgJ1wiIHdhcyBnaXZlbiBhcyB0aGUgZmlyc3QgJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdhcmd1bWVudCBmb3IgbXVzdGFjaGUjcmVuZGVyKHRlbXBsYXRlLCB2aWV3LCBwYXJ0aWFscyknKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGVmYXVsdFdyaXRlci5yZW5kZXIodGVtcGxhdGUsIHZpZXcsIHBhcnRpYWxzKTtcbiAgfTtcblxuICAvLyBUaGlzIGlzIGhlcmUgZm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5IHdpdGggMC40LnguLFxuICAvKmVzbGludC1kaXNhYmxlICovIC8vIGVzbGludCB3YW50cyBjYW1lbCBjYXNlZCBmdW5jdGlvbiBuYW1lXG4gIG11c3RhY2hlLnRvX2h0bWwgPSBmdW5jdGlvbiB0b19odG1sICh0ZW1wbGF0ZSwgdmlldywgcGFydGlhbHMsIHNlbmQpIHtcbiAgICAvKmVzbGludC1lbmFibGUqL1xuXG4gICAgdmFyIHJlc3VsdCA9IG11c3RhY2hlLnJlbmRlcih0ZW1wbGF0ZSwgdmlldywgcGFydGlhbHMpO1xuXG4gICAgaWYgKGlzRnVuY3Rpb24oc2VuZCkpIHtcbiAgICAgIHNlbmQocmVzdWx0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gIH07XG5cbiAgLy8gRXhwb3J0IHRoZSBlc2NhcGluZyBmdW5jdGlvbiBzbyB0aGF0IHRoZSB1c2VyIG1heSBvdmVycmlkZSBpdC5cbiAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9qYW5sL211c3RhY2hlLmpzL2lzc3Vlcy8yNDRcbiAgbXVzdGFjaGUuZXNjYXBlID0gZXNjYXBlSHRtbDtcblxuICAvLyBFeHBvcnQgdGhlc2UgbWFpbmx5IGZvciB0ZXN0aW5nLCBidXQgYWxzbyBmb3IgYWR2YW5jZWQgdXNhZ2UuXG4gIG11c3RhY2hlLlNjYW5uZXIgPSBTY2FubmVyO1xuICBtdXN0YWNoZS5Db250ZXh0ID0gQ29udGV4dDtcbiAgbXVzdGFjaGUuV3JpdGVyID0gV3JpdGVyO1xuXG59KSk7Il19
