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
			var dataType = arguments.length <= 2 || arguments[2] === undefined ? 'html' : arguments[2];
			var proxy = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

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
		Promise.all([_Service2.default.get(this.opts.endpoints[this.opts.env]), _Service2.default.get('templates/' + this.opts.template + '.hbs')]).then(function (responses) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvU2VydmljZS5qcyIsInNyYy9qcy9XaWRnZXQuanMiLCJzcmMvanMvYXBwLmpzIiwic3JjL2pzL2NvbmZpZy5qcyIsInNyYy9qcy9saWJzL211c3RhY2hlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7OztJQ0FNOzs7Ozs7QUFLTCxVQUxLLE9BS0wsR0FBYzt3QkFMVCxTQUtTOztBQUNiLE9BQUssS0FBTCxHQUFhLEVBQWIsQ0FEYTtBQUViLE9BQUssS0FBTCxHQUFhLEVBQWIsQ0FGYTtFQUFkOztjQUxLOztzQkFVTSxLQUFtRDtPQUE5Qyw2REFBTyxvQkFBdUM7T0FBakMsaUVBQVcsc0JBQXNCO09BQWQsOERBQVEsb0JBQU07O0FBQzdELFVBQU8sRUFBRSxJQUFGLENBQU87QUFDYixTQUFLLEdBQUw7QUFDQSxZQUFRLEtBQVI7QUFDQSxVQUFNLElBQU47QUFDQSxjQUFVLFFBQVY7SUFKTSxFQUtKLElBTEksQ0FLQyxVQUFDLENBQUQsRUFBTztBQUNkLFlBQVEsR0FBUixDQUFZLGNBQVosRUFBNEIsRUFBRSxZQUFGLENBQTVCLENBRGM7SUFBUCxDQUxSLENBRDZEOzs7O1FBVnpEOzs7a0JBdUJTOzs7Ozs7Ozs7OztBQ3ZCZjs7OztBQUNBOzs7Ozs7OztBQUNBLElBQU0sV0FBVyxRQUFRLGlCQUFSLENBQVg7O0lBRUE7QUFFTCxVQUZLLFlBRUwsQ0FBWSxFQUFaLEVBQWdCLE9BQWhCLEVBQXlCOzs7d0JBRnBCLGNBRW9COztBQUV4QixPQUFLLEVBQUwsR0FBVSxFQUFWLENBRndCO0FBR3hCLE9BQUssSUFBTCxHQUFZLEVBQUUsTUFBRixDQUFTLGlCQUFPLE9BQVAsRUFBZ0IsT0FBekIsQ0FBWjs7O0FBSHdCLFNBTXhCLENBQVEsR0FBUixDQUFZLENBQ1gsa0JBQVEsR0FBUixDQUFZLEtBQUssSUFBTCxDQUFVLFNBQVYsQ0FBb0IsS0FBSyxJQUFM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bEIsRUFBNEIsSUFBNUIsRUFBa0MsUUFBbEMsRUFBNEMsSUFBNUMsRUFBa0Q7OztBQUduRSxRQUFJLFNBQVMsU0FBUyxNQUFULENBQWdCLFFBQWhCLEVBQTBCLElBQTFCLEVBQWdDLFFBQWhDLENBQVQsQ0FIK0Q7O0FBS25FLFFBQUksV0FBVyxJQUFYLENBQUosRUFBc0I7QUFDcEIsV0FBSyxNQUFMLEVBRG9CO0tBQXRCLE1BRU87QUFDTCxhQUFPLE1BQVAsQ0FESztLQUZQO0dBTGlCOzs7O0FBL2tCdUIsVUE2bEIxQyxDQUFTLE1BQVQsR0FBa0IsVUFBbEI7OztBQTdsQjBDLFVBZ21CMUMsQ0FBUyxPQUFULEdBQW1CLE9BQW5CLENBaG1CMEM7QUFpbUIxQyxXQUFTLE9BQVQsR0FBbUIsT0FBbkIsQ0FqbUIwQztBQWttQjFDLFdBQVMsTUFBVCxHQUFrQixNQUFsQixDQWxtQjBDO0NBQXBDLENBVFIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiY2xhc3MgU2VydmljZSB7XG5cblx0Lypcblx0dG9kbzogY2FjaGluZywgcHJveHlcblx0ICovXG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHRoaXMuY2FjaGUgPSB7fTtcblx0XHR0aGlzLnByb3h5ID0gJyc7XG5cdH1cblxuXHRzdGF0aWMgZ2V0KHVybCwgZGF0YSA9IG51bGwsIGRhdGFUeXBlID0gJ2h0bWwnLCBwcm94eSA9IG51bGwpIHtcblx0XHRyZXR1cm4gJC5hamF4KHtcblx0XHRcdHVybDogdXJsLFxuXHRcdFx0bWV0aG9kOiAnZ2V0Jyxcblx0XHRcdGRhdGE6IGRhdGEsXG5cdFx0XHRkYXRhVHlwZTogZGF0YVR5cGVcblx0XHR9KS5mYWlsKChlKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZygnR2V0IGZhaWxlZDogJywgZS5yZXNwb25zZVRleHQpO1xuXHRcdH0pO1xuXHR9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2VydmljZTsiLCJpbXBvcnQgY29uZmlnIGZyb20gJy4vY29uZmlnJztcbmltcG9ydCBTZXJ2aWNlIGZyb20gJy4vU2VydmljZSc7XG5jb25zdCBNdXN0YWNoZSA9IHJlcXVpcmUoJy4vbGlicy9tdXN0YWNoZScpO1xuXG5jbGFzcyBSZWNpcGVXaWRnZXQge1xuXG5cdGNvbnN0cnVjdG9yKGVsLCBvcHRpb25zKSB7XG5cblx0XHR0aGlzLmVsID0gZWw7XG5cdFx0dGhpcy5vcHRzID0gJC5leHRlbmQoY29uZmlnLm9wdGlvbnMsIG9wdGlvbnMpO1xuXG5cdFx0Ly8gUnVuIG11bHRpcGxlIHByb21pc2VzLiBXYWl0IGZvciBib3RoIHJlc3BvbnNlc1xuXHRcdFByb21pc2UuYWxsKFtcblx0XHRcdFNlcnZpY2UuZ2V0KHRoaXMub3B0cy5lbmRwb2ludHNbdGhpcy5vcHRzLmVudl0pLFxuXHRcdFx0U2VydmljZS5nZXQoYHRlbXBsYXRlcy8ke3RoaXMub3B0cy50ZW1wbGF0ZX0uaGJzYClcblx0XHRdKS50aGVuKChyZXNwb25zZXMpID0+IHtcblx0XHRcdGNvbnN0IHRlbXBsYXRlID0gcmVzcG9uc2VzWzFdO1xuXHRcdFx0Y29uc3QgZGF0YSA9IFJlY2lwZVdpZGdldC5tYXBEYXRhKHJlc3BvbnNlc1swXSk7XG5cdFx0XHRjb25zdCB0bXBsID0gTXVzdGFjaGUucmVuZGVyKHRlbXBsYXRlLCBkYXRhKTtcblx0XHRcdHRoaXMuYnVpbGQodG1wbCk7XG5cdFx0fSkuY2F0Y2goKGUpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKCdFcnJvcicsIGUucmVzcG9uc2VUZXh0KTtcblx0XHR9KTtcblx0fVxuXG5cdC8vIEFwcGVuZCB0byAkLnNlbGVjdG9yXG5cdGJ1aWxkKHRlbXBsYXRlKSB7XG5cdFx0Y29uc3QgJHRtcCA9ICQodGVtcGxhdGUpO1xuXHRcdCQodGhpcy5lbCkuYXBwZW5kKCR0bXApO1xuXHR9XG5cblx0Ly8gQ29udmVydCByYXcgQVBJIGRhdGEgdG8gdGVtcGxhdGUtZnJpZW5kbHkgb2JqZWN0XG5cdHN0YXRpYyBtYXBEYXRhKHJhdykge1xuXHRcdGxldCBqc29uID0gSlNPTi5wYXJzZShyYXcpO1xuXHRcdGxldCBkYXRhID0ganNvbi5yZXN1bHRzWzBdO1xuXHRcdHJldHVybiB7XG5cdFx0XHRkZXZlbG9wZXI6IGRhdGEuYXJ0aXN0TmFtZSxcblx0XHRcdHByaWNlOiBkYXRhLmZvcm1hdHRlZFByaWNlLFxuXHRcdFx0bmFtZTogZGF0YS50cmFja05hbWVcblx0XHR9O1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFJlY2lwZVdpZGdldDsiLCJpZih0eXBlb2YgJCA9PSAndW5kZWZpbmVkJykge1xuXHRjb25zb2xlLmxvZygnalF1ZXJ5IHJlcXVpcmVkIScpO1xufVxuXG5pbXBvcnQgUmVjaXBlV2lkZ2V0IGZyb20gJy4vV2lkZ2V0JztcblxuLy8gRXh0ZW5kIEpRdWVyeSBmbiBmb3IgJCgnLmNsYXNzJykucmVjaXBlV2lkZ2V0KClcbiQuZm4ucmVjaXBlV2lkZ2V0ID0gZnVuY3Rpb24ob3B0aW9ucykge1xuXHRyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdChuZXcgUmVjaXBlV2lkZ2V0KHRoaXMsIG9wdGlvbnMpKTtcblx0fSk7XG59OyIsImNvbnN0IGNvbmZpZyA9IHtcblx0b3B0aW9uczoge1xuXHRcdHNlYXJjaDogJ2hlYWx0aHknLFxuXHRcdGtleTogbnVsbCxcblx0XHRzZXJ2ZXJTaWRlU2NyaXB0OiAnLi4vY3VybC5waHAnLFxuXHRcdGltZ1Byb3h5OiBudWxsLFxuXHRcdHRlbXBsYXRlOiAndGVtcGxhdGUxJyxcblx0XHRlbmRwb2ludHM6IHtcblx0XHRcdGRldmVsb3BtZW50OiAnc3JjL2pzL2RhdGEvc2VydmljZS1zaGltLmpzb24nLFxuXHRcdFx0cHJvZHVjdGlvbjogJ2h0dHA6Ly9pdHVuZXMuYXBwbGUuY29tL2xvb2t1cD9pZD00MDAyNzQ5MzQnXG5cdFx0fSxcblx0XHRlbnY6ICdwcm9kdWN0aW9uJ1xuXHR9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjb25maWc7IiwiLyohXG4gKiBtdXN0YWNoZS5qcyAtIExvZ2ljLWxlc3Mge3ttdXN0YWNoZX19IHRlbXBsYXRlcyB3aXRoIEphdmFTY3JpcHRcbiAqIGh0dHA6Ly9naXRodWIuY29tL2phbmwvbXVzdGFjaGUuanNcbiAqL1xuXG4vKmdsb2JhbCBkZWZpbmU6IGZhbHNlIE11c3RhY2hlOiB0cnVlKi9cblxuKGZ1bmN0aW9uIGRlZmluZU11c3RhY2hlIChnbG9iYWwsIGZhY3RvcnkpIHtcbiAgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiBleHBvcnRzICYmIHR5cGVvZiBleHBvcnRzLm5vZGVOYW1lICE9PSAnc3RyaW5nJykge1xuICAgIGZhY3RvcnkoZXhwb3J0cyk7IC8vIENvbW1vbkpTXG4gIH0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgZGVmaW5lKFsnZXhwb3J0cyddLCBmYWN0b3J5KTsgLy8gQU1EXG4gIH0gZWxzZSB7XG4gICAgZ2xvYmFsLk11c3RhY2hlID0ge307XG4gICAgZmFjdG9yeShnbG9iYWwuTXVzdGFjaGUpOyAvLyBzY3JpcHQsIHdzaCwgYXNwXG4gIH1cbn0odGhpcywgZnVuY3Rpb24gbXVzdGFjaGVGYWN0b3J5IChtdXN0YWNoZSkge1xuXG4gIHZhciBvYmplY3RUb1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG4gIHZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiBpc0FycmF5UG9seWZpbGwgKG9iamVjdCkge1xuICAgIHJldHVybiBvYmplY3RUb1N0cmluZy5jYWxsKG9iamVjdCkgPT09ICdbb2JqZWN0IEFycmF5XSc7XG4gIH07XG5cbiAgZnVuY3Rpb24gaXNGdW5jdGlvbiAob2JqZWN0KSB7XG4gICAgcmV0dXJuIHR5cGVvZiBvYmplY3QgPT09ICdmdW5jdGlvbic7XG4gIH1cblxuICAvKipcbiAgICogTW9yZSBjb3JyZWN0IHR5cGVvZiBzdHJpbmcgaGFuZGxpbmcgYXJyYXlcbiAgICogd2hpY2ggbm9ybWFsbHkgcmV0dXJucyB0eXBlb2YgJ29iamVjdCdcbiAgICovXG4gIGZ1bmN0aW9uIHR5cGVTdHIgKG9iaikge1xuICAgIHJldHVybiBpc0FycmF5KG9iaikgPyAnYXJyYXknIDogdHlwZW9mIG9iajtcbiAgfVxuXG4gIGZ1bmN0aW9uIGVzY2FwZVJlZ0V4cCAoc3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKC9bXFwtXFxbXFxde30oKSorPy4sXFxcXFxcXiR8I1xcc10vZywgJ1xcXFwkJicpO1xuICB9XG5cbiAgLyoqXG4gICAqIE51bGwgc2FmZSB3YXkgb2YgY2hlY2tpbmcgd2hldGhlciBvciBub3QgYW4gb2JqZWN0LFxuICAgKiBpbmNsdWRpbmcgaXRzIHByb3RvdHlwZSwgaGFzIGEgZ2l2ZW4gcHJvcGVydHlcbiAgICovXG4gIGZ1bmN0aW9uIGhhc1Byb3BlcnR5IChvYmosIHByb3BOYW1lKSB7XG4gICAgcmV0dXJuIG9iaiAhPSBudWxsICYmIHR5cGVvZiBvYmogPT09ICdvYmplY3QnICYmIChwcm9wTmFtZSBpbiBvYmopO1xuICB9XG5cbiAgLy8gV29ya2Fyb3VuZCBmb3IgaHR0cHM6Ly9pc3N1ZXMuYXBhY2hlLm9yZy9qaXJhL2Jyb3dzZS9DT1VDSERCLTU3N1xuICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2phbmwvbXVzdGFjaGUuanMvaXNzdWVzLzE4OVxuICB2YXIgcmVnRXhwVGVzdCA9IFJlZ0V4cC5wcm90b3R5cGUudGVzdDtcbiAgZnVuY3Rpb24gdGVzdFJlZ0V4cCAocmUsIHN0cmluZykge1xuICAgIHJldHVybiByZWdFeHBUZXN0LmNhbGwocmUsIHN0cmluZyk7XG4gIH1cblxuICB2YXIgbm9uU3BhY2VSZSA9IC9cXFMvO1xuICBmdW5jdGlvbiBpc1doaXRlc3BhY2UgKHN0cmluZykge1xuICAgIHJldHVybiAhdGVzdFJlZ0V4cChub25TcGFjZVJlLCBzdHJpbmcpO1xuICB9XG5cbiAgdmFyIGVudGl0eU1hcCA9IHtcbiAgICAnJic6ICcmYW1wOycsXG4gICAgJzwnOiAnJmx0OycsXG4gICAgJz4nOiAnJmd0OycsXG4gICAgJ1wiJzogJyZxdW90OycsXG4gICAgXCInXCI6ICcmIzM5OycsXG4gICAgJy8nOiAnJiN4MkY7JyxcbiAgICAnYCc6ICcmI3g2MDsnLFxuICAgICc9JzogJyYjeDNEOydcbiAgfTtcblxuICBmdW5jdGlvbiBlc2NhcGVIdG1sIChzdHJpbmcpIHtcbiAgICByZXR1cm4gU3RyaW5nKHN0cmluZykucmVwbGFjZSgvWyY8PlwiJ2A9XFwvXS9nLCBmdW5jdGlvbiBmcm9tRW50aXR5TWFwIChzKSB7XG4gICAgICByZXR1cm4gZW50aXR5TWFwW3NdO1xuICAgIH0pO1xuICB9XG5cbiAgdmFyIHdoaXRlUmUgPSAvXFxzKi87XG4gIHZhciBzcGFjZVJlID0gL1xccysvO1xuICB2YXIgZXF1YWxzUmUgPSAvXFxzKj0vO1xuICB2YXIgY3VybHlSZSA9IC9cXHMqXFx9LztcbiAgdmFyIHRhZ1JlID0gLyN8XFxefFxcL3w+fFxce3wmfD18IS87XG5cbiAgLyoqXG4gICAqIEJyZWFrcyB1cCB0aGUgZ2l2ZW4gYHRlbXBsYXRlYCBzdHJpbmcgaW50byBhIHRyZWUgb2YgdG9rZW5zLiBJZiB0aGUgYHRhZ3NgXG4gICAqIGFyZ3VtZW50IGlzIGdpdmVuIGhlcmUgaXQgbXVzdCBiZSBhbiBhcnJheSB3aXRoIHR3byBzdHJpbmcgdmFsdWVzOiB0aGVcbiAgICogb3BlbmluZyBhbmQgY2xvc2luZyB0YWdzIHVzZWQgaW4gdGhlIHRlbXBsYXRlIChlLmcuIFsgXCI8JVwiLCBcIiU+XCIgXSkuIE9mXG4gICAqIGNvdXJzZSwgdGhlIGRlZmF1bHQgaXMgdG8gdXNlIG11c3RhY2hlcyAoaS5lLiBtdXN0YWNoZS50YWdzKS5cbiAgICpcbiAgICogQSB0b2tlbiBpcyBhbiBhcnJheSB3aXRoIGF0IGxlYXN0IDQgZWxlbWVudHMuIFRoZSBmaXJzdCBlbGVtZW50IGlzIHRoZVxuICAgKiBtdXN0YWNoZSBzeW1ib2wgdGhhdCB3YXMgdXNlZCBpbnNpZGUgdGhlIHRhZywgZS5nLiBcIiNcIiBvciBcIiZcIi4gSWYgdGhlIHRhZ1xuICAgKiBkaWQgbm90IGNvbnRhaW4gYSBzeW1ib2wgKGkuZS4ge3tteVZhbHVlfX0pIHRoaXMgZWxlbWVudCBpcyBcIm5hbWVcIi4gRm9yXG4gICAqIGFsbCB0ZXh0IHRoYXQgYXBwZWFycyBvdXRzaWRlIGEgc3ltYm9sIHRoaXMgZWxlbWVudCBpcyBcInRleHRcIi5cbiAgICpcbiAgICogVGhlIHNlY29uZCBlbGVtZW50IG9mIGEgdG9rZW4gaXMgaXRzIFwidmFsdWVcIi4gRm9yIG11c3RhY2hlIHRhZ3MgdGhpcyBpc1xuICAgKiB3aGF0ZXZlciBlbHNlIHdhcyBpbnNpZGUgdGhlIHRhZyBiZXNpZGVzIHRoZSBvcGVuaW5nIHN5bWJvbC4gRm9yIHRleHQgdG9rZW5zXG4gICAqIHRoaXMgaXMgdGhlIHRleHQgaXRzZWxmLlxuICAgKlxuICAgKiBUaGUgdGhpcmQgYW5kIGZvdXJ0aCBlbGVtZW50cyBvZiB0aGUgdG9rZW4gYXJlIHRoZSBzdGFydCBhbmQgZW5kIGluZGljZXMsXG4gICAqIHJlc3BlY3RpdmVseSwgb2YgdGhlIHRva2VuIGluIHRoZSBvcmlnaW5hbCB0ZW1wbGF0ZS5cbiAgICpcbiAgICogVG9rZW5zIHRoYXQgYXJlIHRoZSByb290IG5vZGUgb2YgYSBzdWJ0cmVlIGNvbnRhaW4gdHdvIG1vcmUgZWxlbWVudHM6IDEpIGFuXG4gICAqIGFycmF5IG9mIHRva2VucyBpbiB0aGUgc3VidHJlZSBhbmQgMikgdGhlIGluZGV4IGluIHRoZSBvcmlnaW5hbCB0ZW1wbGF0ZSBhdFxuICAgKiB3aGljaCB0aGUgY2xvc2luZyB0YWcgZm9yIHRoYXQgc2VjdGlvbiBiZWdpbnMuXG4gICAqL1xuICBmdW5jdGlvbiBwYXJzZVRlbXBsYXRlICh0ZW1wbGF0ZSwgdGFncykge1xuICAgIGlmICghdGVtcGxhdGUpXG4gICAgICByZXR1cm4gW107XG5cbiAgICB2YXIgc2VjdGlvbnMgPSBbXTsgICAgIC8vIFN0YWNrIHRvIGhvbGQgc2VjdGlvbiB0b2tlbnNcbiAgICB2YXIgdG9rZW5zID0gW107ICAgICAgIC8vIEJ1ZmZlciB0byBob2xkIHRoZSB0b2tlbnNcbiAgICB2YXIgc3BhY2VzID0gW107ICAgICAgIC8vIEluZGljZXMgb2Ygd2hpdGVzcGFjZSB0b2tlbnMgb24gdGhlIGN1cnJlbnQgbGluZVxuICAgIHZhciBoYXNUYWcgPSBmYWxzZTsgICAgLy8gSXMgdGhlcmUgYSB7e3RhZ319IG9uIHRoZSBjdXJyZW50IGxpbmU/XG4gICAgdmFyIG5vblNwYWNlID0gZmFsc2U7ICAvLyBJcyB0aGVyZSBhIG5vbi1zcGFjZSBjaGFyIG9uIHRoZSBjdXJyZW50IGxpbmU/XG5cbiAgICAvLyBTdHJpcHMgYWxsIHdoaXRlc3BhY2UgdG9rZW5zIGFycmF5IGZvciB0aGUgY3VycmVudCBsaW5lXG4gICAgLy8gaWYgdGhlcmUgd2FzIGEge3sjdGFnfX0gb24gaXQgYW5kIG90aGVyd2lzZSBvbmx5IHNwYWNlLlxuICAgIGZ1bmN0aW9uIHN0cmlwU3BhY2UgKCkge1xuICAgICAgaWYgKGhhc1RhZyAmJiAhbm9uU3BhY2UpIHtcbiAgICAgICAgd2hpbGUgKHNwYWNlcy5sZW5ndGgpXG4gICAgICAgICAgZGVsZXRlIHRva2Vuc1tzcGFjZXMucG9wKCldO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3BhY2VzID0gW107XG4gICAgICB9XG5cbiAgICAgIGhhc1RhZyA9IGZhbHNlO1xuICAgICAgbm9uU3BhY2UgPSBmYWxzZTtcbiAgICB9XG5cbiAgICB2YXIgb3BlbmluZ1RhZ1JlLCBjbG9zaW5nVGFnUmUsIGNsb3NpbmdDdXJseVJlO1xuICAgIGZ1bmN0aW9uIGNvbXBpbGVUYWdzICh0YWdzVG9Db21waWxlKSB7XG4gICAgICBpZiAodHlwZW9mIHRhZ3NUb0NvbXBpbGUgPT09ICdzdHJpbmcnKVxuICAgICAgICB0YWdzVG9Db21waWxlID0gdGFnc1RvQ29tcGlsZS5zcGxpdChzcGFjZVJlLCAyKTtcblxuICAgICAgaWYgKCFpc0FycmF5KHRhZ3NUb0NvbXBpbGUpIHx8IHRhZ3NUb0NvbXBpbGUubGVuZ3RoICE9PSAyKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgdGFnczogJyArIHRhZ3NUb0NvbXBpbGUpO1xuXG4gICAgICBvcGVuaW5nVGFnUmUgPSBuZXcgUmVnRXhwKGVzY2FwZVJlZ0V4cCh0YWdzVG9Db21waWxlWzBdKSArICdcXFxccyonKTtcbiAgICAgIGNsb3NpbmdUYWdSZSA9IG5ldyBSZWdFeHAoJ1xcXFxzKicgKyBlc2NhcGVSZWdFeHAodGFnc1RvQ29tcGlsZVsxXSkpO1xuICAgICAgY2xvc2luZ0N1cmx5UmUgPSBuZXcgUmVnRXhwKCdcXFxccyonICsgZXNjYXBlUmVnRXhwKCd9JyArIHRhZ3NUb0NvbXBpbGVbMV0pKTtcbiAgICB9XG5cbiAgICBjb21waWxlVGFncyh0YWdzIHx8IG11c3RhY2hlLnRhZ3MpO1xuXG4gICAgdmFyIHNjYW5uZXIgPSBuZXcgU2Nhbm5lcih0ZW1wbGF0ZSk7XG5cbiAgICB2YXIgc3RhcnQsIHR5cGUsIHZhbHVlLCBjaHIsIHRva2VuLCBvcGVuU2VjdGlvbjtcbiAgICB3aGlsZSAoIXNjYW5uZXIuZW9zKCkpIHtcbiAgICAgIHN0YXJ0ID0gc2Nhbm5lci5wb3M7XG5cbiAgICAgIC8vIE1hdGNoIGFueSB0ZXh0IGJldHdlZW4gdGFncy5cbiAgICAgIHZhbHVlID0gc2Nhbm5lci5zY2FuVW50aWwob3BlbmluZ1RhZ1JlKTtcblxuICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCB2YWx1ZUxlbmd0aCA9IHZhbHVlLmxlbmd0aDsgaSA8IHZhbHVlTGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICBjaHIgPSB2YWx1ZS5jaGFyQXQoaSk7XG5cbiAgICAgICAgICBpZiAoaXNXaGl0ZXNwYWNlKGNocikpIHtcbiAgICAgICAgICAgIHNwYWNlcy5wdXNoKHRva2Vucy5sZW5ndGgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBub25TcGFjZSA9IHRydWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdG9rZW5zLnB1c2goWyAndGV4dCcsIGNociwgc3RhcnQsIHN0YXJ0ICsgMSBdKTtcbiAgICAgICAgICBzdGFydCArPSAxO1xuXG4gICAgICAgICAgLy8gQ2hlY2sgZm9yIHdoaXRlc3BhY2Ugb24gdGhlIGN1cnJlbnQgbGluZS5cbiAgICAgICAgICBpZiAoY2hyID09PSAnXFxuJylcbiAgICAgICAgICAgIHN0cmlwU3BhY2UoKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBNYXRjaCB0aGUgb3BlbmluZyB0YWcuXG4gICAgICBpZiAoIXNjYW5uZXIuc2NhbihvcGVuaW5nVGFnUmUpKVxuICAgICAgICBicmVhaztcblxuICAgICAgaGFzVGFnID0gdHJ1ZTtcblxuICAgICAgLy8gR2V0IHRoZSB0YWcgdHlwZS5cbiAgICAgIHR5cGUgPSBzY2FubmVyLnNjYW4odGFnUmUpIHx8ICduYW1lJztcbiAgICAgIHNjYW5uZXIuc2Nhbih3aGl0ZVJlKTtcblxuICAgICAgLy8gR2V0IHRoZSB0YWcgdmFsdWUuXG4gICAgICBpZiAodHlwZSA9PT0gJz0nKSB7XG4gICAgICAgIHZhbHVlID0gc2Nhbm5lci5zY2FuVW50aWwoZXF1YWxzUmUpO1xuICAgICAgICBzY2FubmVyLnNjYW4oZXF1YWxzUmUpO1xuICAgICAgICBzY2FubmVyLnNjYW5VbnRpbChjbG9zaW5nVGFnUmUpO1xuICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAneycpIHtcbiAgICAgICAgdmFsdWUgPSBzY2FubmVyLnNjYW5VbnRpbChjbG9zaW5nQ3VybHlSZSk7XG4gICAgICAgIHNjYW5uZXIuc2NhbihjdXJseVJlKTtcbiAgICAgICAgc2Nhbm5lci5zY2FuVW50aWwoY2xvc2luZ1RhZ1JlKTtcbiAgICAgICAgdHlwZSA9ICcmJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbHVlID0gc2Nhbm5lci5zY2FuVW50aWwoY2xvc2luZ1RhZ1JlKTtcbiAgICAgIH1cblxuICAgICAgLy8gTWF0Y2ggdGhlIGNsb3NpbmcgdGFnLlxuICAgICAgaWYgKCFzY2FubmVyLnNjYW4oY2xvc2luZ1RhZ1JlKSlcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmNsb3NlZCB0YWcgYXQgJyArIHNjYW5uZXIucG9zKTtcblxuICAgICAgdG9rZW4gPSBbIHR5cGUsIHZhbHVlLCBzdGFydCwgc2Nhbm5lci5wb3MgXTtcbiAgICAgIHRva2Vucy5wdXNoKHRva2VuKTtcblxuICAgICAgaWYgKHR5cGUgPT09ICcjJyB8fCB0eXBlID09PSAnXicpIHtcbiAgICAgICAgc2VjdGlvbnMucHVzaCh0b2tlbik7XG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICcvJykge1xuICAgICAgICAvLyBDaGVjayBzZWN0aW9uIG5lc3RpbmcuXG4gICAgICAgIG9wZW5TZWN0aW9uID0gc2VjdGlvbnMucG9wKCk7XG5cbiAgICAgICAgaWYgKCFvcGVuU2VjdGlvbilcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vub3BlbmVkIHNlY3Rpb24gXCInICsgdmFsdWUgKyAnXCIgYXQgJyArIHN0YXJ0KTtcblxuICAgICAgICBpZiAob3BlblNlY3Rpb25bMV0gIT09IHZhbHVlKVxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVW5jbG9zZWQgc2VjdGlvbiBcIicgKyBvcGVuU2VjdGlvblsxXSArICdcIiBhdCAnICsgc3RhcnQpO1xuICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAnbmFtZScgfHwgdHlwZSA9PT0gJ3snIHx8IHR5cGUgPT09ICcmJykge1xuICAgICAgICBub25TcGFjZSA9IHRydWU7XG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICc9Jykge1xuICAgICAgICAvLyBTZXQgdGhlIHRhZ3MgZm9yIHRoZSBuZXh0IHRpbWUgYXJvdW5kLlxuICAgICAgICBjb21waWxlVGFncyh2YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gTWFrZSBzdXJlIHRoZXJlIGFyZSBubyBvcGVuIHNlY3Rpb25zIHdoZW4gd2UncmUgZG9uZS5cbiAgICBvcGVuU2VjdGlvbiA9IHNlY3Rpb25zLnBvcCgpO1xuXG4gICAgaWYgKG9wZW5TZWN0aW9uKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmNsb3NlZCBzZWN0aW9uIFwiJyArIG9wZW5TZWN0aW9uWzFdICsgJ1wiIGF0ICcgKyBzY2FubmVyLnBvcyk7XG5cbiAgICByZXR1cm4gbmVzdFRva2VucyhzcXVhc2hUb2tlbnModG9rZW5zKSk7XG4gIH1cblxuICAvKipcbiAgICogQ29tYmluZXMgdGhlIHZhbHVlcyBvZiBjb25zZWN1dGl2ZSB0ZXh0IHRva2VucyBpbiB0aGUgZ2l2ZW4gYHRva2Vuc2AgYXJyYXlcbiAgICogdG8gYSBzaW5nbGUgdG9rZW4uXG4gICAqL1xuICBmdW5jdGlvbiBzcXVhc2hUb2tlbnMgKHRva2Vucykge1xuICAgIHZhciBzcXVhc2hlZFRva2VucyA9IFtdO1xuXG4gICAgdmFyIHRva2VuLCBsYXN0VG9rZW47XG4gICAgZm9yICh2YXIgaSA9IDAsIG51bVRva2VucyA9IHRva2Vucy5sZW5ndGg7IGkgPCBudW1Ub2tlbnM7ICsraSkge1xuICAgICAgdG9rZW4gPSB0b2tlbnNbaV07XG5cbiAgICAgIGlmICh0b2tlbikge1xuICAgICAgICBpZiAodG9rZW5bMF0gPT09ICd0ZXh0JyAmJiBsYXN0VG9rZW4gJiYgbGFzdFRva2VuWzBdID09PSAndGV4dCcpIHtcbiAgICAgICAgICBsYXN0VG9rZW5bMV0gKz0gdG9rZW5bMV07XG4gICAgICAgICAgbGFzdFRva2VuWzNdID0gdG9rZW5bM107XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3F1YXNoZWRUb2tlbnMucHVzaCh0b2tlbik7XG4gICAgICAgICAgbGFzdFRva2VuID0gdG9rZW47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gc3F1YXNoZWRUb2tlbnM7XG4gIH1cblxuICAvKipcbiAgICogRm9ybXMgdGhlIGdpdmVuIGFycmF5IG9mIGB0b2tlbnNgIGludG8gYSBuZXN0ZWQgdHJlZSBzdHJ1Y3R1cmUgd2hlcmVcbiAgICogdG9rZW5zIHRoYXQgcmVwcmVzZW50IGEgc2VjdGlvbiBoYXZlIHR3byBhZGRpdGlvbmFsIGl0ZW1zOiAxKSBhbiBhcnJheSBvZlxuICAgKiBhbGwgdG9rZW5zIHRoYXQgYXBwZWFyIGluIHRoYXQgc2VjdGlvbiBhbmQgMikgdGhlIGluZGV4IGluIHRoZSBvcmlnaW5hbFxuICAgKiB0ZW1wbGF0ZSB0aGF0IHJlcHJlc2VudHMgdGhlIGVuZCBvZiB0aGF0IHNlY3Rpb24uXG4gICAqL1xuICBmdW5jdGlvbiBuZXN0VG9rZW5zICh0b2tlbnMpIHtcbiAgICB2YXIgbmVzdGVkVG9rZW5zID0gW107XG4gICAgdmFyIGNvbGxlY3RvciA9IG5lc3RlZFRva2VucztcbiAgICB2YXIgc2VjdGlvbnMgPSBbXTtcblxuICAgIHZhciB0b2tlbiwgc2VjdGlvbjtcbiAgICBmb3IgKHZhciBpID0gMCwgbnVtVG9rZW5zID0gdG9rZW5zLmxlbmd0aDsgaSA8IG51bVRva2VuczsgKytpKSB7XG4gICAgICB0b2tlbiA9IHRva2Vuc1tpXTtcblxuICAgICAgc3dpdGNoICh0b2tlblswXSkge1xuICAgICAgICBjYXNlICcjJzpcbiAgICAgICAgY2FzZSAnXic6XG4gICAgICAgICAgY29sbGVjdG9yLnB1c2godG9rZW4pO1xuICAgICAgICAgIHNlY3Rpb25zLnB1c2godG9rZW4pO1xuICAgICAgICAgIGNvbGxlY3RvciA9IHRva2VuWzRdID0gW107XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJy8nOlxuICAgICAgICAgIHNlY3Rpb24gPSBzZWN0aW9ucy5wb3AoKTtcbiAgICAgICAgICBzZWN0aW9uWzVdID0gdG9rZW5bMl07XG4gICAgICAgICAgY29sbGVjdG9yID0gc2VjdGlvbnMubGVuZ3RoID4gMCA/IHNlY3Rpb25zW3NlY3Rpb25zLmxlbmd0aCAtIDFdWzRdIDogbmVzdGVkVG9rZW5zO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGNvbGxlY3Rvci5wdXNoKHRva2VuKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbmVzdGVkVG9rZW5zO1xuICB9XG5cbiAgLyoqXG4gICAqIEEgc2ltcGxlIHN0cmluZyBzY2FubmVyIHRoYXQgaXMgdXNlZCBieSB0aGUgdGVtcGxhdGUgcGFyc2VyIHRvIGZpbmRcbiAgICogdG9rZW5zIGluIHRlbXBsYXRlIHN0cmluZ3MuXG4gICAqL1xuICBmdW5jdGlvbiBTY2FubmVyIChzdHJpbmcpIHtcbiAgICB0aGlzLnN0cmluZyA9IHN0cmluZztcbiAgICB0aGlzLnRhaWwgPSBzdHJpbmc7XG4gICAgdGhpcy5wb3MgPSAwO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYHRydWVgIGlmIHRoZSB0YWlsIGlzIGVtcHR5IChlbmQgb2Ygc3RyaW5nKS5cbiAgICovXG4gIFNjYW5uZXIucHJvdG90eXBlLmVvcyA9IGZ1bmN0aW9uIGVvcyAoKSB7XG4gICAgcmV0dXJuIHRoaXMudGFpbCA9PT0gJyc7XG4gIH07XG5cbiAgLyoqXG4gICAqIFRyaWVzIHRvIG1hdGNoIHRoZSBnaXZlbiByZWd1bGFyIGV4cHJlc3Npb24gYXQgdGhlIGN1cnJlbnQgcG9zaXRpb24uXG4gICAqIFJldHVybnMgdGhlIG1hdGNoZWQgdGV4dCBpZiBpdCBjYW4gbWF0Y2gsIHRoZSBlbXB0eSBzdHJpbmcgb3RoZXJ3aXNlLlxuICAgKi9cbiAgU2Nhbm5lci5wcm90b3R5cGUuc2NhbiA9IGZ1bmN0aW9uIHNjYW4gKHJlKSB7XG4gICAgdmFyIG1hdGNoID0gdGhpcy50YWlsLm1hdGNoKHJlKTtcblxuICAgIGlmICghbWF0Y2ggfHwgbWF0Y2guaW5kZXggIT09IDApXG4gICAgICByZXR1cm4gJyc7XG5cbiAgICB2YXIgc3RyaW5nID0gbWF0Y2hbMF07XG5cbiAgICB0aGlzLnRhaWwgPSB0aGlzLnRhaWwuc3Vic3RyaW5nKHN0cmluZy5sZW5ndGgpO1xuICAgIHRoaXMucG9zICs9IHN0cmluZy5sZW5ndGg7XG5cbiAgICByZXR1cm4gc3RyaW5nO1xuICB9O1xuXG4gIC8qKlxuICAgKiBTa2lwcyBhbGwgdGV4dCB1bnRpbCB0aGUgZ2l2ZW4gcmVndWxhciBleHByZXNzaW9uIGNhbiBiZSBtYXRjaGVkLiBSZXR1cm5zXG4gICAqIHRoZSBza2lwcGVkIHN0cmluZywgd2hpY2ggaXMgdGhlIGVudGlyZSB0YWlsIGlmIG5vIG1hdGNoIGNhbiBiZSBtYWRlLlxuICAgKi9cbiAgU2Nhbm5lci5wcm90b3R5cGUuc2NhblVudGlsID0gZnVuY3Rpb24gc2NhblVudGlsIChyZSkge1xuICAgIHZhciBpbmRleCA9IHRoaXMudGFpbC5zZWFyY2gocmUpLCBtYXRjaDtcblxuICAgIHN3aXRjaCAoaW5kZXgpIHtcbiAgICAgIGNhc2UgLTE6XG4gICAgICAgIG1hdGNoID0gdGhpcy50YWlsO1xuICAgICAgICB0aGlzLnRhaWwgPSAnJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDA6XG4gICAgICAgIG1hdGNoID0gJyc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgbWF0Y2ggPSB0aGlzLnRhaWwuc3Vic3RyaW5nKDAsIGluZGV4KTtcbiAgICAgICAgdGhpcy50YWlsID0gdGhpcy50YWlsLnN1YnN0cmluZyhpbmRleCk7XG4gICAgfVxuXG4gICAgdGhpcy5wb3MgKz0gbWF0Y2gubGVuZ3RoO1xuXG4gICAgcmV0dXJuIG1hdGNoO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZXByZXNlbnRzIGEgcmVuZGVyaW5nIGNvbnRleHQgYnkgd3JhcHBpbmcgYSB2aWV3IG9iamVjdCBhbmRcbiAgICogbWFpbnRhaW5pbmcgYSByZWZlcmVuY2UgdG8gdGhlIHBhcmVudCBjb250ZXh0LlxuICAgKi9cbiAgZnVuY3Rpb24gQ29udGV4dCAodmlldywgcGFyZW50Q29udGV4dCkge1xuICAgIHRoaXMudmlldyA9IHZpZXc7XG4gICAgdGhpcy5jYWNoZSA9IHsgJy4nOiB0aGlzLnZpZXcgfTtcbiAgICB0aGlzLnBhcmVudCA9IHBhcmVudENvbnRleHQ7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBjb250ZXh0IHVzaW5nIHRoZSBnaXZlbiB2aWV3IHdpdGggdGhpcyBjb250ZXh0XG4gICAqIGFzIHRoZSBwYXJlbnQuXG4gICAqL1xuICBDb250ZXh0LnByb3RvdHlwZS5wdXNoID0gZnVuY3Rpb24gcHVzaCAodmlldykge1xuICAgIHJldHVybiBuZXcgQ29udGV4dCh2aWV3LCB0aGlzKTtcbiAgfTtcblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgdmFsdWUgb2YgdGhlIGdpdmVuIG5hbWUgaW4gdGhpcyBjb250ZXh0LCB0cmF2ZXJzaW5nXG4gICAqIHVwIHRoZSBjb250ZXh0IGhpZXJhcmNoeSBpZiB0aGUgdmFsdWUgaXMgYWJzZW50IGluIHRoaXMgY29udGV4dCdzIHZpZXcuXG4gICAqL1xuICBDb250ZXh0LnByb3RvdHlwZS5sb29rdXAgPSBmdW5jdGlvbiBsb29rdXAgKG5hbWUpIHtcbiAgICB2YXIgY2FjaGUgPSB0aGlzLmNhY2hlO1xuXG4gICAgdmFyIHZhbHVlO1xuICAgIGlmIChjYWNoZS5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xuICAgICAgdmFsdWUgPSBjYWNoZVtuYW1lXTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGNvbnRleHQgPSB0aGlzLCBuYW1lcywgaW5kZXgsIGxvb2t1cEhpdCA9IGZhbHNlO1xuXG4gICAgICB3aGlsZSAoY29udGV4dCkge1xuICAgICAgICBpZiAobmFtZS5pbmRleE9mKCcuJykgPiAwKSB7XG4gICAgICAgICAgdmFsdWUgPSBjb250ZXh0LnZpZXc7XG4gICAgICAgICAgbmFtZXMgPSBuYW1lLnNwbGl0KCcuJyk7XG4gICAgICAgICAgaW5kZXggPSAwO1xuXG4gICAgICAgICAgLyoqXG4gICAgICAgICAgICogVXNpbmcgdGhlIGRvdCBub3Rpb24gcGF0aCBpbiBgbmFtZWAsIHdlIGRlc2NlbmQgdGhyb3VnaCB0aGVcbiAgICAgICAgICAgKiBuZXN0ZWQgb2JqZWN0cy5cbiAgICAgICAgICAgKlxuICAgICAgICAgICAqIFRvIGJlIGNlcnRhaW4gdGhhdCB0aGUgbG9va3VwIGhhcyBiZWVuIHN1Y2Nlc3NmdWwsIHdlIGhhdmUgdG9cbiAgICAgICAgICAgKiBjaGVjayBpZiB0aGUgbGFzdCBvYmplY3QgaW4gdGhlIHBhdGggYWN0dWFsbHkgaGFzIHRoZSBwcm9wZXJ0eVxuICAgICAgICAgICAqIHdlIGFyZSBsb29raW5nIGZvci4gV2Ugc3RvcmUgdGhlIHJlc3VsdCBpbiBgbG9va3VwSGl0YC5cbiAgICAgICAgICAgKlxuICAgICAgICAgICAqIFRoaXMgaXMgc3BlY2lhbGx5IG5lY2Vzc2FyeSBmb3Igd2hlbiB0aGUgdmFsdWUgaGFzIGJlZW4gc2V0IHRvXG4gICAgICAgICAgICogYHVuZGVmaW5lZGAgYW5kIHdlIHdhbnQgdG8gYXZvaWQgbG9va2luZyB1cCBwYXJlbnQgY29udGV4dHMuXG4gICAgICAgICAgICoqL1xuICAgICAgICAgIHdoaWxlICh2YWx1ZSAhPSBudWxsICYmIGluZGV4IDwgbmFtZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAoaW5kZXggPT09IG5hbWVzLmxlbmd0aCAtIDEpXG4gICAgICAgICAgICAgIGxvb2t1cEhpdCA9IGhhc1Byb3BlcnR5KHZhbHVlLCBuYW1lc1tpbmRleF0pO1xuXG4gICAgICAgICAgICB2YWx1ZSA9IHZhbHVlW25hbWVzW2luZGV4KytdXTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFsdWUgPSBjb250ZXh0LnZpZXdbbmFtZV07XG4gICAgICAgICAgbG9va3VwSGl0ID0gaGFzUHJvcGVydHkoY29udGV4dC52aWV3LCBuYW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChsb29rdXBIaXQpXG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY29udGV4dCA9IGNvbnRleHQucGFyZW50O1xuICAgICAgfVxuXG4gICAgICBjYWNoZVtuYW1lXSA9IHZhbHVlO1xuICAgIH1cblxuICAgIGlmIChpc0Z1bmN0aW9uKHZhbHVlKSlcbiAgICAgIHZhbHVlID0gdmFsdWUuY2FsbCh0aGlzLnZpZXcpO1xuXG4gICAgcmV0dXJuIHZhbHVlO1xuICB9O1xuXG4gIC8qKlxuICAgKiBBIFdyaXRlciBrbm93cyBob3cgdG8gdGFrZSBhIHN0cmVhbSBvZiB0b2tlbnMgYW5kIHJlbmRlciB0aGVtIHRvIGFcbiAgICogc3RyaW5nLCBnaXZlbiBhIGNvbnRleHQuIEl0IGFsc28gbWFpbnRhaW5zIGEgY2FjaGUgb2YgdGVtcGxhdGVzIHRvXG4gICAqIGF2b2lkIHRoZSBuZWVkIHRvIHBhcnNlIHRoZSBzYW1lIHRlbXBsYXRlIHR3aWNlLlxuICAgKi9cbiAgZnVuY3Rpb24gV3JpdGVyICgpIHtcbiAgICB0aGlzLmNhY2hlID0ge307XG4gIH1cblxuICAvKipcbiAgICogQ2xlYXJzIGFsbCBjYWNoZWQgdGVtcGxhdGVzIGluIHRoaXMgd3JpdGVyLlxuICAgKi9cbiAgV3JpdGVyLnByb3RvdHlwZS5jbGVhckNhY2hlID0gZnVuY3Rpb24gY2xlYXJDYWNoZSAoKSB7XG4gICAgdGhpcy5jYWNoZSA9IHt9O1xuICB9O1xuXG4gIC8qKlxuICAgKiBQYXJzZXMgYW5kIGNhY2hlcyB0aGUgZ2l2ZW4gYHRlbXBsYXRlYCBhbmQgcmV0dXJucyB0aGUgYXJyYXkgb2YgdG9rZW5zXG4gICAqIHRoYXQgaXMgZ2VuZXJhdGVkIGZyb20gdGhlIHBhcnNlLlxuICAgKi9cbiAgV3JpdGVyLnByb3RvdHlwZS5wYXJzZSA9IGZ1bmN0aW9uIHBhcnNlICh0ZW1wbGF0ZSwgdGFncykge1xuICAgIHZhciBjYWNoZSA9IHRoaXMuY2FjaGU7XG4gICAgdmFyIHRva2VucyA9IGNhY2hlW3RlbXBsYXRlXTtcblxuICAgIGlmICh0b2tlbnMgPT0gbnVsbClcbiAgICAgIHRva2VucyA9IGNhY2hlW3RlbXBsYXRlXSA9IHBhcnNlVGVtcGxhdGUodGVtcGxhdGUsIHRhZ3MpO1xuXG4gICAgcmV0dXJuIHRva2VucztcbiAgfTtcblxuICAvKipcbiAgICogSGlnaC1sZXZlbCBtZXRob2QgdGhhdCBpcyB1c2VkIHRvIHJlbmRlciB0aGUgZ2l2ZW4gYHRlbXBsYXRlYCB3aXRoXG4gICAqIHRoZSBnaXZlbiBgdmlld2AuXG4gICAqXG4gICAqIFRoZSBvcHRpb25hbCBgcGFydGlhbHNgIGFyZ3VtZW50IG1heSBiZSBhbiBvYmplY3QgdGhhdCBjb250YWlucyB0aGVcbiAgICogbmFtZXMgYW5kIHRlbXBsYXRlcyBvZiBwYXJ0aWFscyB0aGF0IGFyZSB1c2VkIGluIHRoZSB0ZW1wbGF0ZS4gSXQgbWF5XG4gICAqIGFsc28gYmUgYSBmdW5jdGlvbiB0aGF0IGlzIHVzZWQgdG8gbG9hZCBwYXJ0aWFsIHRlbXBsYXRlcyBvbiB0aGUgZmx5XG4gICAqIHRoYXQgdGFrZXMgYSBzaW5nbGUgYXJndW1lbnQ6IHRoZSBuYW1lIG9mIHRoZSBwYXJ0aWFsLlxuICAgKi9cbiAgV3JpdGVyLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbiByZW5kZXIgKHRlbXBsYXRlLCB2aWV3LCBwYXJ0aWFscykge1xuICAgIHZhciB0b2tlbnMgPSB0aGlzLnBhcnNlKHRlbXBsYXRlKTtcbiAgICB2YXIgY29udGV4dCA9ICh2aWV3IGluc3RhbmNlb2YgQ29udGV4dCkgPyB2aWV3IDogbmV3IENvbnRleHQodmlldyk7XG4gICAgcmV0dXJuIHRoaXMucmVuZGVyVG9rZW5zKHRva2VucywgY29udGV4dCwgcGFydGlhbHMsIHRlbXBsYXRlKTtcbiAgfTtcblxuICAvKipcbiAgICogTG93LWxldmVsIG1ldGhvZCB0aGF0IHJlbmRlcnMgdGhlIGdpdmVuIGFycmF5IG9mIGB0b2tlbnNgIHVzaW5nXG4gICAqIHRoZSBnaXZlbiBgY29udGV4dGAgYW5kIGBwYXJ0aWFsc2AuXG4gICAqXG4gICAqIE5vdGU6IFRoZSBgb3JpZ2luYWxUZW1wbGF0ZWAgaXMgb25seSBldmVyIHVzZWQgdG8gZXh0cmFjdCB0aGUgcG9ydGlvblxuICAgKiBvZiB0aGUgb3JpZ2luYWwgdGVtcGxhdGUgdGhhdCB3YXMgY29udGFpbmVkIGluIGEgaGlnaGVyLW9yZGVyIHNlY3Rpb24uXG4gICAqIElmIHRoZSB0ZW1wbGF0ZSBkb2Vzbid0IHVzZSBoaWdoZXItb3JkZXIgc2VjdGlvbnMsIHRoaXMgYXJndW1lbnQgbWF5XG4gICAqIGJlIG9taXR0ZWQuXG4gICAqL1xuICBXcml0ZXIucHJvdG90eXBlLnJlbmRlclRva2VucyA9IGZ1bmN0aW9uIHJlbmRlclRva2VucyAodG9rZW5zLCBjb250ZXh0LCBwYXJ0aWFscywgb3JpZ2luYWxUZW1wbGF0ZSkge1xuICAgIHZhciBidWZmZXIgPSAnJztcblxuICAgIHZhciB0b2tlbiwgc3ltYm9sLCB2YWx1ZTtcbiAgICBmb3IgKHZhciBpID0gMCwgbnVtVG9rZW5zID0gdG9rZW5zLmxlbmd0aDsgaSA8IG51bVRva2VuczsgKytpKSB7XG4gICAgICB2YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICAgIHRva2VuID0gdG9rZW5zW2ldO1xuICAgICAgc3ltYm9sID0gdG9rZW5bMF07XG5cbiAgICAgIGlmIChzeW1ib2wgPT09ICcjJykgdmFsdWUgPSB0aGlzLnJlbmRlclNlY3Rpb24odG9rZW4sIGNvbnRleHQsIHBhcnRpYWxzLCBvcmlnaW5hbFRlbXBsYXRlKTtcbiAgICAgIGVsc2UgaWYgKHN5bWJvbCA9PT0gJ14nKSB2YWx1ZSA9IHRoaXMucmVuZGVySW52ZXJ0ZWQodG9rZW4sIGNvbnRleHQsIHBhcnRpYWxzLCBvcmlnaW5hbFRlbXBsYXRlKTtcbiAgICAgIGVsc2UgaWYgKHN5bWJvbCA9PT0gJz4nKSB2YWx1ZSA9IHRoaXMucmVuZGVyUGFydGlhbCh0b2tlbiwgY29udGV4dCwgcGFydGlhbHMsIG9yaWdpbmFsVGVtcGxhdGUpO1xuICAgICAgZWxzZSBpZiAoc3ltYm9sID09PSAnJicpIHZhbHVlID0gdGhpcy51bmVzY2FwZWRWYWx1ZSh0b2tlbiwgY29udGV4dCk7XG4gICAgICBlbHNlIGlmIChzeW1ib2wgPT09ICduYW1lJykgdmFsdWUgPSB0aGlzLmVzY2FwZWRWYWx1ZSh0b2tlbiwgY29udGV4dCk7XG4gICAgICBlbHNlIGlmIChzeW1ib2wgPT09ICd0ZXh0JykgdmFsdWUgPSB0aGlzLnJhd1ZhbHVlKHRva2VuKTtcblxuICAgICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpXG4gICAgICAgIGJ1ZmZlciArPSB2YWx1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gYnVmZmVyO1xuICB9O1xuXG4gIFdyaXRlci5wcm90b3R5cGUucmVuZGVyU2VjdGlvbiA9IGZ1bmN0aW9uIHJlbmRlclNlY3Rpb24gKHRva2VuLCBjb250ZXh0LCBwYXJ0aWFscywgb3JpZ2luYWxUZW1wbGF0ZSkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgYnVmZmVyID0gJyc7XG4gICAgdmFyIHZhbHVlID0gY29udGV4dC5sb29rdXAodG9rZW5bMV0pO1xuXG4gICAgLy8gVGhpcyBmdW5jdGlvbiBpcyB1c2VkIHRvIHJlbmRlciBhbiBhcmJpdHJhcnkgdGVtcGxhdGVcbiAgICAvLyBpbiB0aGUgY3VycmVudCBjb250ZXh0IGJ5IGhpZ2hlci1vcmRlciBzZWN0aW9ucy5cbiAgICBmdW5jdGlvbiBzdWJSZW5kZXIgKHRlbXBsYXRlKSB7XG4gICAgICByZXR1cm4gc2VsZi5yZW5kZXIodGVtcGxhdGUsIGNvbnRleHQsIHBhcnRpYWxzKTtcbiAgICB9XG5cbiAgICBpZiAoIXZhbHVlKSByZXR1cm47XG5cbiAgICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgIGZvciAodmFyIGogPSAwLCB2YWx1ZUxlbmd0aCA9IHZhbHVlLmxlbmd0aDsgaiA8IHZhbHVlTGVuZ3RoOyArK2opIHtcbiAgICAgICAgYnVmZmVyICs9IHRoaXMucmVuZGVyVG9rZW5zKHRva2VuWzRdLCBjb250ZXh0LnB1c2godmFsdWVbal0pLCBwYXJ0aWFscywgb3JpZ2luYWxUZW1wbGF0ZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnIHx8IHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJykge1xuICAgICAgYnVmZmVyICs9IHRoaXMucmVuZGVyVG9rZW5zKHRva2VuWzRdLCBjb250ZXh0LnB1c2godmFsdWUpLCBwYXJ0aWFscywgb3JpZ2luYWxUZW1wbGF0ZSk7XG4gICAgfSBlbHNlIGlmIChpc0Z1bmN0aW9uKHZhbHVlKSkge1xuICAgICAgaWYgKHR5cGVvZiBvcmlnaW5hbFRlbXBsYXRlICE9PSAnc3RyaW5nJylcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgdXNlIGhpZ2hlci1vcmRlciBzZWN0aW9ucyB3aXRob3V0IHRoZSBvcmlnaW5hbCB0ZW1wbGF0ZScpO1xuXG4gICAgICAvLyBFeHRyYWN0IHRoZSBwb3J0aW9uIG9mIHRoZSBvcmlnaW5hbCB0ZW1wbGF0ZSB0aGF0IHRoZSBzZWN0aW9uIGNvbnRhaW5zLlxuICAgICAgdmFsdWUgPSB2YWx1ZS5jYWxsKGNvbnRleHQudmlldywgb3JpZ2luYWxUZW1wbGF0ZS5zbGljZSh0b2tlblszXSwgdG9rZW5bNV0pLCBzdWJSZW5kZXIpO1xuXG4gICAgICBpZiAodmFsdWUgIT0gbnVsbClcbiAgICAgICAgYnVmZmVyICs9IHZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBidWZmZXIgKz0gdGhpcy5yZW5kZXJUb2tlbnModG9rZW5bNF0sIGNvbnRleHQsIHBhcnRpYWxzLCBvcmlnaW5hbFRlbXBsYXRlKTtcbiAgICB9XG4gICAgcmV0dXJuIGJ1ZmZlcjtcbiAgfTtcblxuICBXcml0ZXIucHJvdG90eXBlLnJlbmRlckludmVydGVkID0gZnVuY3Rpb24gcmVuZGVySW52ZXJ0ZWQgKHRva2VuLCBjb250ZXh0LCBwYXJ0aWFscywgb3JpZ2luYWxUZW1wbGF0ZSkge1xuICAgIHZhciB2YWx1ZSA9IGNvbnRleHQubG9va3VwKHRva2VuWzFdKTtcblxuICAgIC8vIFVzZSBKYXZhU2NyaXB0J3MgZGVmaW5pdGlvbiBvZiBmYWxzeS4gSW5jbHVkZSBlbXB0eSBhcnJheXMuXG4gICAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9qYW5sL211c3RhY2hlLmpzL2lzc3Vlcy8xODZcbiAgICBpZiAoIXZhbHVlIHx8IChpc0FycmF5KHZhbHVlKSAmJiB2YWx1ZS5sZW5ndGggPT09IDApKVxuICAgICAgcmV0dXJuIHRoaXMucmVuZGVyVG9rZW5zKHRva2VuWzRdLCBjb250ZXh0LCBwYXJ0aWFscywgb3JpZ2luYWxUZW1wbGF0ZSk7XG4gIH07XG5cbiAgV3JpdGVyLnByb3RvdHlwZS5yZW5kZXJQYXJ0aWFsID0gZnVuY3Rpb24gcmVuZGVyUGFydGlhbCAodG9rZW4sIGNvbnRleHQsIHBhcnRpYWxzKSB7XG4gICAgaWYgKCFwYXJ0aWFscykgcmV0dXJuO1xuXG4gICAgdmFyIHZhbHVlID0gaXNGdW5jdGlvbihwYXJ0aWFscykgPyBwYXJ0aWFscyh0b2tlblsxXSkgOiBwYXJ0aWFsc1t0b2tlblsxXV07XG4gICAgaWYgKHZhbHVlICE9IG51bGwpXG4gICAgICByZXR1cm4gdGhpcy5yZW5kZXJUb2tlbnModGhpcy5wYXJzZSh2YWx1ZSksIGNvbnRleHQsIHBhcnRpYWxzLCB2YWx1ZSk7XG4gIH07XG5cbiAgV3JpdGVyLnByb3RvdHlwZS51bmVzY2FwZWRWYWx1ZSA9IGZ1bmN0aW9uIHVuZXNjYXBlZFZhbHVlICh0b2tlbiwgY29udGV4dCkge1xuICAgIHZhciB2YWx1ZSA9IGNvbnRleHQubG9va3VwKHRva2VuWzFdKTtcbiAgICBpZiAodmFsdWUgIT0gbnVsbClcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgfTtcblxuICBXcml0ZXIucHJvdG90eXBlLmVzY2FwZWRWYWx1ZSA9IGZ1bmN0aW9uIGVzY2FwZWRWYWx1ZSAodG9rZW4sIGNvbnRleHQpIHtcbiAgICB2YXIgdmFsdWUgPSBjb250ZXh0Lmxvb2t1cCh0b2tlblsxXSk7XG4gICAgaWYgKHZhbHVlICE9IG51bGwpXG4gICAgICByZXR1cm4gbXVzdGFjaGUuZXNjYXBlKHZhbHVlKTtcbiAgfTtcblxuICBXcml0ZXIucHJvdG90eXBlLnJhd1ZhbHVlID0gZnVuY3Rpb24gcmF3VmFsdWUgKHRva2VuKSB7XG4gICAgcmV0dXJuIHRva2VuWzFdO1xuICB9O1xuXG4gIG11c3RhY2hlLm5hbWUgPSAnbXVzdGFjaGUuanMnO1xuICBtdXN0YWNoZS52ZXJzaW9uID0gJzIuMi4xJztcbiAgbXVzdGFjaGUudGFncyA9IFsgJ3t7JywgJ319JyBdO1xuXG4gIC8vIEFsbCBoaWdoLWxldmVsIG11c3RhY2hlLiogZnVuY3Rpb25zIHVzZSB0aGlzIHdyaXRlci5cbiAgdmFyIGRlZmF1bHRXcml0ZXIgPSBuZXcgV3JpdGVyKCk7XG5cbiAgLyoqXG4gICAqIENsZWFycyBhbGwgY2FjaGVkIHRlbXBsYXRlcyBpbiB0aGUgZGVmYXVsdCB3cml0ZXIuXG4gICAqL1xuICBtdXN0YWNoZS5jbGVhckNhY2hlID0gZnVuY3Rpb24gY2xlYXJDYWNoZSAoKSB7XG4gICAgcmV0dXJuIGRlZmF1bHRXcml0ZXIuY2xlYXJDYWNoZSgpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBQYXJzZXMgYW5kIGNhY2hlcyB0aGUgZ2l2ZW4gdGVtcGxhdGUgaW4gdGhlIGRlZmF1bHQgd3JpdGVyIGFuZCByZXR1cm5zIHRoZVxuICAgKiBhcnJheSBvZiB0b2tlbnMgaXQgY29udGFpbnMuIERvaW5nIHRoaXMgYWhlYWQgb2YgdGltZSBhdm9pZHMgdGhlIG5lZWQgdG9cbiAgICogcGFyc2UgdGVtcGxhdGVzIG9uIHRoZSBmbHkgYXMgdGhleSBhcmUgcmVuZGVyZWQuXG4gICAqL1xuICBtdXN0YWNoZS5wYXJzZSA9IGZ1bmN0aW9uIHBhcnNlICh0ZW1wbGF0ZSwgdGFncykge1xuICAgIHJldHVybiBkZWZhdWx0V3JpdGVyLnBhcnNlKHRlbXBsYXRlLCB0YWdzKTtcbiAgfTtcblxuICAvKipcbiAgICogUmVuZGVycyB0aGUgYHRlbXBsYXRlYCB3aXRoIHRoZSBnaXZlbiBgdmlld2AgYW5kIGBwYXJ0aWFsc2AgdXNpbmcgdGhlXG4gICAqIGRlZmF1bHQgd3JpdGVyLlxuICAgKi9cbiAgbXVzdGFjaGUucmVuZGVyID0gZnVuY3Rpb24gcmVuZGVyICh0ZW1wbGF0ZSwgdmlldywgcGFydGlhbHMpIHtcbiAgICBpZiAodHlwZW9mIHRlbXBsYXRlICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCB0ZW1wbGF0ZSEgVGVtcGxhdGUgc2hvdWxkIGJlIGEgXCJzdHJpbmdcIiAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ2J1dCBcIicgKyB0eXBlU3RyKHRlbXBsYXRlKSArICdcIiB3YXMgZ2l2ZW4gYXMgdGhlIGZpcnN0ICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAnYXJndW1lbnQgZm9yIG11c3RhY2hlI3JlbmRlcih0ZW1wbGF0ZSwgdmlldywgcGFydGlhbHMpJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRlZmF1bHRXcml0ZXIucmVuZGVyKHRlbXBsYXRlLCB2aWV3LCBwYXJ0aWFscyk7XG4gIH07XG5cbiAgLy8gVGhpcyBpcyBoZXJlIGZvciBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eSB3aXRoIDAuNC54LixcbiAgLyplc2xpbnQtZGlzYWJsZSAqLyAvLyBlc2xpbnQgd2FudHMgY2FtZWwgY2FzZWQgZnVuY3Rpb24gbmFtZVxuICBtdXN0YWNoZS50b19odG1sID0gZnVuY3Rpb24gdG9faHRtbCAodGVtcGxhdGUsIHZpZXcsIHBhcnRpYWxzLCBzZW5kKSB7XG4gICAgLyplc2xpbnQtZW5hYmxlKi9cblxuICAgIHZhciByZXN1bHQgPSBtdXN0YWNoZS5yZW5kZXIodGVtcGxhdGUsIHZpZXcsIHBhcnRpYWxzKTtcblxuICAgIGlmIChpc0Z1bmN0aW9uKHNlbmQpKSB7XG4gICAgICBzZW5kKHJlc3VsdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICB9O1xuXG4gIC8vIEV4cG9ydCB0aGUgZXNjYXBpbmcgZnVuY3Rpb24gc28gdGhhdCB0aGUgdXNlciBtYXkgb3ZlcnJpZGUgaXQuXG4gIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vamFubC9tdXN0YWNoZS5qcy9pc3N1ZXMvMjQ0XG4gIG11c3RhY2hlLmVzY2FwZSA9IGVzY2FwZUh0bWw7XG5cbiAgLy8gRXhwb3J0IHRoZXNlIG1haW5seSBmb3IgdGVzdGluZywgYnV0IGFsc28gZm9yIGFkdmFuY2VkIHVzYWdlLlxuICBtdXN0YWNoZS5TY2FubmVyID0gU2Nhbm5lcjtcbiAgbXVzdGFjaGUuQ29udGV4dCA9IENvbnRleHQ7XG4gIG11c3RhY2hlLldyaXRlciA9IFdyaXRlcjtcblxufSkpOyJdfQ==
