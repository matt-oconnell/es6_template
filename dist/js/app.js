(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Service = function () {
	function Service() {
		_classCallCheck(this, Service);

		this.cache = {};
	}

	_createClass(Service, null, [{
		key: 'get',
		value: function get() {
			return $.getJSON('src/js/data/service-shim.json');
			// return $.getJSON('http://itunes.apple.com/lookup?id=400274934');
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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Mustache = require('./libs/mustache');

var Template = function () {
	function Template() {
		_classCallCheck(this, Template);

		this.cache = {};
	}

	_createClass(Template, [{
		key: 'get',
		value: function get(file) {
			if (!this.cache[file]) {
				this.cache[file] = $.get('templates/' + file);
			}
			return this.cache[file];
		}
	}], [{
		key: 'populate',
		value: function populate(template, data) {
			var da = { d: data.results[0].trackName };
			return Mustache.render(template, da);
		}
	}]);

	return Template;
}();

exports.default = Template;

},{"./libs/mustache":6}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _Template = require('./Template');

var _Template2 = _interopRequireDefault(_Template);

var _Service = require('./Service');

var _Service2 = _interopRequireDefault(_Service);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RecipeWidget = function () {
	function RecipeWidget(el, options) {
		var _this = this;

		_classCallCheck(this, RecipeWidget);

		this.el = el;
		this.options = $.extend(_config2.default.options, options);
		this.template = new _Template2.default();

		// Run multiple promises. Wait to for both responses
		Promise.all([this.template.get('template.hbs'), _Service2.default.get()]).then(function (responses) {
			var template = void 0,
			    data = void 0;

			responses.forEach(function (resp, i) {
				if (typeof resp == 'string') {
					template = resp;
				} else {
					data = resp;
				}

				if (i == responses.length - 1) {
					var tmpl = _Template2.default.populate(template, data);
					_this.construct(tmpl);
				}
			});
		});
	}

	_createClass(RecipeWidget, [{
		key: 'construct',
		value: function construct(template) {
			var $template = $(template);
			$(this.el).append($template);
		}
	}]);

	return RecipeWidget;
}();

exports.default = RecipeWidget;

},{"./Service":1,"./Template":2,"./config":5}],4:[function(require,module,exports){
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

},{"./Widget":3}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var config = {
	options: {
		search: 'healthy',
		key: null,
		serverSideScript: '../curl.php',
		imgProxy: null
	}
};

exports.default = config;

},{}],6:[function(require,module,exports){
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

},{}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvU2VydmljZS5qcyIsInNyYy9qcy9UZW1wbGF0ZS5qcyIsInNyYy9qcy9XaWRnZXQuanMiLCJzcmMvanMvYXBwLmpzIiwic3JjL2pzL2NvbmZpZy5qcyIsInNyYy9qcy9saWJzL211c3RhY2hlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7OztJQ0FNO0FBRUwsVUFGSyxPQUVMLEdBQWM7d0JBRlQsU0FFUzs7QUFDYixPQUFLLEtBQUwsR0FBYSxFQUFiLENBRGE7RUFBZDs7Y0FGSzs7d0JBTVE7QUFDWixVQUFPLEVBQUUsT0FBRixDQUFVLCtCQUFWLENBQVA7O0FBRFk7OztRQU5SOzs7a0JBYVM7Ozs7Ozs7Ozs7Ozs7QUNiZixJQUFNLFdBQVcsUUFBUSxpQkFBUixDQUFYOztJQUVBO0FBRUwsVUFGSyxRQUVMLEdBQWM7d0JBRlQsVUFFUzs7QUFDYixPQUFLLEtBQUwsR0FBYSxFQUFiLENBRGE7RUFBZDs7Y0FGSzs7c0JBTUQsTUFBTTtBQUNULE9BQUcsQ0FBQyxLQUFLLEtBQUwsQ0FBVyxJQUFYLENBQUQsRUFBbUI7QUFDckIsU0FBSyxLQUFMLENBQVcsSUFBWCxJQUFtQixFQUFFLEdBQUYsQ0FBTSxlQUFlLElBQWYsQ0FBekIsQ0FEcUI7SUFBdEI7QUFHQSxVQUFPLEtBQUssS0FBTCxDQUFXLElBQVgsQ0FBUCxDQUpTOzs7OzJCQU9NLFVBQVUsTUFBTTtBQUMvQixPQUFJLEtBQUssRUFBQyxHQUFHLEtBQUssT0FBTCxDQUFhLENBQWIsRUFBZ0IsU0FBaEIsRUFBVCxDQUQyQjtBQUUvQixVQUFPLFNBQVMsTUFBVCxDQUFnQixRQUFoQixFQUEwQixFQUExQixDQUFQLENBRitCOzs7O1FBYjNCOzs7a0JBb0JTOzs7Ozs7Ozs7OztBQ3RCZjs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7O0lBRU07QUFFTCxVQUZLLFlBRUwsQ0FBWSxFQUFaLEVBQWdCLE9B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LEVBQWtEOzs7QUFHbkUsUUFBSSxTQUFTLFNBQVMsTUFBVCxDQUFnQixRQUFoQixFQUEwQixJQUExQixFQUFnQyxRQUFoQyxDQUFULENBSCtEOztBQUtuRSxRQUFJLFdBQVcsSUFBWCxDQUFKLEVBQXNCO0FBQ3BCLFdBQUssTUFBTCxFQURvQjtLQUF0QixNQUVPO0FBQ0wsYUFBTyxNQUFQLENBREs7S0FGUDtHQUxpQjs7OztBQS9rQnVCLFVBNmxCMUMsQ0FBUyxNQUFULEdBQWtCLFVBQWxCOzs7QUE3bEIwQyxVQWdtQjFDLENBQVMsT0FBVCxHQUFtQixPQUFuQixDQWhtQjBDO0FBaW1CMUMsV0FBUyxPQUFULEdBQW1CLE9BQW5CLENBam1CMEM7QUFrbUIxQyxXQUFTLE1BQVQsR0FBa0IsTUFBbEIsQ0FsbUIwQztDQUFwQyxDQVRSIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImNsYXNzIFNlcnZpY2Uge1xuXG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHRoaXMuY2FjaGUgPSB7fTtcblx0fVxuXG5cdHN0YXRpYyBnZXQoKSB7XG5cdFx0cmV0dXJuICQuZ2V0SlNPTignc3JjL2pzL2RhdGEvc2VydmljZS1zaGltLmpzb24nKTtcblx0XHQvLyByZXR1cm4gJC5nZXRKU09OKCdodHRwOi8vaXR1bmVzLmFwcGxlLmNvbS9sb29rdXA/aWQ9NDAwMjc0OTM0Jyk7XG5cdH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBTZXJ2aWNlOyIsImNvbnN0IE11c3RhY2hlID0gcmVxdWlyZSgnLi9saWJzL211c3RhY2hlJyk7XG5cbmNsYXNzIFRlbXBsYXRlIHtcblxuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHR0aGlzLmNhY2hlID0ge307XG5cdH1cblxuXHRnZXQoZmlsZSkge1xuXHRcdGlmKCF0aGlzLmNhY2hlW2ZpbGVdKSB7XG5cdFx0XHR0aGlzLmNhY2hlW2ZpbGVdID0gJC5nZXQoJ3RlbXBsYXRlcy8nICsgZmlsZSk7XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLmNhY2hlW2ZpbGVdO1xuXHR9XG5cblx0c3RhdGljIHBvcHVsYXRlKHRlbXBsYXRlLCBkYXRhKSB7XG5cdFx0bGV0IGRhID0ge2Q6IGRhdGEucmVzdWx0c1swXS50cmFja05hbWV9O1xuXHRcdHJldHVybiBNdXN0YWNoZS5yZW5kZXIodGVtcGxhdGUsIGRhKTtcblx0fVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IFRlbXBsYXRlOyIsImltcG9ydCBjb25maWcgZnJvbSAnLi9jb25maWcnO1xuaW1wb3J0IFRlbXBsYXRlIGZyb20gJy4vVGVtcGxhdGUnO1xuaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi9TZXJ2aWNlJztcblxuY2xhc3MgUmVjaXBlV2lkZ2V0IHtcblxuXHRjb25zdHJ1Y3RvcihlbCwgb3B0aW9ucykge1xuXG5cdFx0dGhpcy5lbCA9IGVsO1xuXHRcdHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKGNvbmZpZy5vcHRpb25zLCBvcHRpb25zKTtcblx0XHR0aGlzLnRlbXBsYXRlID0gbmV3IFRlbXBsYXRlO1xuXG5cdFx0Ly8gUnVuIG11bHRpcGxlIHByb21pc2VzLiBXYWl0IHRvIGZvciBib3RoIHJlc3BvbnNlc1xuXHRcdFByb21pc2UuYWxsKFtcblx0XHRcdHRoaXMudGVtcGxhdGUuZ2V0KCd0ZW1wbGF0ZS5oYnMnKSxcblx0XHRcdFNlcnZpY2UuZ2V0KClcblx0XHRdKS50aGVuKChyZXNwb25zZXMpID0+IHtcblx0XHRcdGxldCB0ZW1wbGF0ZSwgZGF0YTtcblxuXHRcdFx0cmVzcG9uc2VzLmZvckVhY2goKHJlc3AsIGkpID0+IHtcblx0XHRcdFx0aWYodHlwZW9mIHJlc3AgPT0gJ3N0cmluZycpIHtcblx0XHRcdFx0XHR0ZW1wbGF0ZSA9IHJlc3A7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0ZGF0YSA9IHJlc3A7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZihpID09IHJlc3BvbnNlcy5sZW5ndGggLSAxKSB7XG5cdFx0XHRcdFx0bGV0IHRtcGwgPSBUZW1wbGF0ZS5wb3B1bGF0ZSh0ZW1wbGF0ZSwgZGF0YSk7XG5cdFx0XHRcdFx0dGhpcy5jb25zdHJ1Y3QodG1wbCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9XG5cblx0Y29uc3RydWN0KHRlbXBsYXRlKSB7XG5cdFx0Y29uc3QgJHRlbXBsYXRlID0gJCh0ZW1wbGF0ZSk7XG5cdFx0JCh0aGlzLmVsKS5hcHBlbmQoJHRlbXBsYXRlKTtcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBSZWNpcGVXaWRnZXQ7IiwiaWYodHlwZW9mICQgPT0gJ3VuZGVmaW5lZCcpIHtcblx0Y29uc29sZS5sb2coJ2pRdWVyeSByZXF1aXJlZCEnKTtcbn1cblxuaW1wb3J0IFJlY2lwZVdpZGdldCBmcm9tICcuL1dpZGdldCc7XG5cbi8vIEV4dGVuZCBKUXVlcnkgZm4gZm9yICQoJy5jbGFzcycpLnJlY2lwZVdpZGdldCgpXG4kLmZuLnJlY2lwZVdpZGdldCA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcblx0cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpIHtcblx0XHQobmV3IFJlY2lwZVdpZGdldCh0aGlzLCBvcHRpb25zKSk7XG5cdH0pO1xufTsiLCJjb25zdCBjb25maWcgPSB7XG5cdG9wdGlvbnM6IHtcblx0XHRzZWFyY2g6ICdoZWFsdGh5Jyxcblx0XHRrZXk6IG51bGwsXG5cdFx0c2VydmVyU2lkZVNjcmlwdDogJy4uL2N1cmwucGhwJyxcblx0XHRpbWdQcm94eTogbnVsbFxuXHR9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjb25maWc7IiwiLyohXG4gKiBtdXN0YWNoZS5qcyAtIExvZ2ljLWxlc3Mge3ttdXN0YWNoZX19IHRlbXBsYXRlcyB3aXRoIEphdmFTY3JpcHRcbiAqIGh0dHA6Ly9naXRodWIuY29tL2phbmwvbXVzdGFjaGUuanNcbiAqL1xuXG4vKmdsb2JhbCBkZWZpbmU6IGZhbHNlIE11c3RhY2hlOiB0cnVlKi9cblxuKGZ1bmN0aW9uIGRlZmluZU11c3RhY2hlIChnbG9iYWwsIGZhY3RvcnkpIHtcbiAgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiBleHBvcnRzICYmIHR5cGVvZiBleHBvcnRzLm5vZGVOYW1lICE9PSAnc3RyaW5nJykge1xuICAgIGZhY3RvcnkoZXhwb3J0cyk7IC8vIENvbW1vbkpTXG4gIH0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgZGVmaW5lKFsnZXhwb3J0cyddLCBmYWN0b3J5KTsgLy8gQU1EXG4gIH0gZWxzZSB7XG4gICAgZ2xvYmFsLk11c3RhY2hlID0ge307XG4gICAgZmFjdG9yeShnbG9iYWwuTXVzdGFjaGUpOyAvLyBzY3JpcHQsIHdzaCwgYXNwXG4gIH1cbn0odGhpcywgZnVuY3Rpb24gbXVzdGFjaGVGYWN0b3J5IChtdXN0YWNoZSkge1xuXG4gIHZhciBvYmplY3RUb1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG4gIHZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiBpc0FycmF5UG9seWZpbGwgKG9iamVjdCkge1xuICAgIHJldHVybiBvYmplY3RUb1N0cmluZy5jYWxsKG9iamVjdCkgPT09ICdbb2JqZWN0IEFycmF5XSc7XG4gIH07XG5cbiAgZnVuY3Rpb24gaXNGdW5jdGlvbiAob2JqZWN0KSB7XG4gICAgcmV0dXJuIHR5cGVvZiBvYmplY3QgPT09ICdmdW5jdGlvbic7XG4gIH1cblxuICAvKipcbiAgICogTW9yZSBjb3JyZWN0IHR5cGVvZiBzdHJpbmcgaGFuZGxpbmcgYXJyYXlcbiAgICogd2hpY2ggbm9ybWFsbHkgcmV0dXJucyB0eXBlb2YgJ29iamVjdCdcbiAgICovXG4gIGZ1bmN0aW9uIHR5cGVTdHIgKG9iaikge1xuICAgIHJldHVybiBpc0FycmF5KG9iaikgPyAnYXJyYXknIDogdHlwZW9mIG9iajtcbiAgfVxuXG4gIGZ1bmN0aW9uIGVzY2FwZVJlZ0V4cCAoc3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKC9bXFwtXFxbXFxde30oKSorPy4sXFxcXFxcXiR8I1xcc10vZywgJ1xcXFwkJicpO1xuICB9XG5cbiAgLyoqXG4gICAqIE51bGwgc2FmZSB3YXkgb2YgY2hlY2tpbmcgd2hldGhlciBvciBub3QgYW4gb2JqZWN0LFxuICAgKiBpbmNsdWRpbmcgaXRzIHByb3RvdHlwZSwgaGFzIGEgZ2l2ZW4gcHJvcGVydHlcbiAgICovXG4gIGZ1bmN0aW9uIGhhc1Byb3BlcnR5IChvYmosIHByb3BOYW1lKSB7XG4gICAgcmV0dXJuIG9iaiAhPSBudWxsICYmIHR5cGVvZiBvYmogPT09ICdvYmplY3QnICYmIChwcm9wTmFtZSBpbiBvYmopO1xuICB9XG5cbiAgLy8gV29ya2Fyb3VuZCBmb3IgaHR0cHM6Ly9pc3N1ZXMuYXBhY2hlLm9yZy9qaXJhL2Jyb3dzZS9DT1VDSERCLTU3N1xuICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2phbmwvbXVzdGFjaGUuanMvaXNzdWVzLzE4OVxuICB2YXIgcmVnRXhwVGVzdCA9IFJlZ0V4cC5wcm90b3R5cGUudGVzdDtcbiAgZnVuY3Rpb24gdGVzdFJlZ0V4cCAocmUsIHN0cmluZykge1xuICAgIHJldHVybiByZWdFeHBUZXN0LmNhbGwocmUsIHN0cmluZyk7XG4gIH1cblxuICB2YXIgbm9uU3BhY2VSZSA9IC9cXFMvO1xuICBmdW5jdGlvbiBpc1doaXRlc3BhY2UgKHN0cmluZykge1xuICAgIHJldHVybiAhdGVzdFJlZ0V4cChub25TcGFjZVJlLCBzdHJpbmcpO1xuICB9XG5cbiAgdmFyIGVudGl0eU1hcCA9IHtcbiAgICAnJic6ICcmYW1wOycsXG4gICAgJzwnOiAnJmx0OycsXG4gICAgJz4nOiAnJmd0OycsXG4gICAgJ1wiJzogJyZxdW90OycsXG4gICAgXCInXCI6ICcmIzM5OycsXG4gICAgJy8nOiAnJiN4MkY7JyxcbiAgICAnYCc6ICcmI3g2MDsnLFxuICAgICc9JzogJyYjeDNEOydcbiAgfTtcblxuICBmdW5jdGlvbiBlc2NhcGVIdG1sIChzdHJpbmcpIHtcbiAgICByZXR1cm4gU3RyaW5nKHN0cmluZykucmVwbGFjZSgvWyY8PlwiJ2A9XFwvXS9nLCBmdW5jdGlvbiBmcm9tRW50aXR5TWFwIChzKSB7XG4gICAgICByZXR1cm4gZW50aXR5TWFwW3NdO1xuICAgIH0pO1xuICB9XG5cbiAgdmFyIHdoaXRlUmUgPSAvXFxzKi87XG4gIHZhciBzcGFjZVJlID0gL1xccysvO1xuICB2YXIgZXF1YWxzUmUgPSAvXFxzKj0vO1xuICB2YXIgY3VybHlSZSA9IC9cXHMqXFx9LztcbiAgdmFyIHRhZ1JlID0gLyN8XFxefFxcL3w+fFxce3wmfD18IS87XG5cbiAgLyoqXG4gICAqIEJyZWFrcyB1cCB0aGUgZ2l2ZW4gYHRlbXBsYXRlYCBzdHJpbmcgaW50byBhIHRyZWUgb2YgdG9rZW5zLiBJZiB0aGUgYHRhZ3NgXG4gICAqIGFyZ3VtZW50IGlzIGdpdmVuIGhlcmUgaXQgbXVzdCBiZSBhbiBhcnJheSB3aXRoIHR3byBzdHJpbmcgdmFsdWVzOiB0aGVcbiAgICogb3BlbmluZyBhbmQgY2xvc2luZyB0YWdzIHVzZWQgaW4gdGhlIHRlbXBsYXRlIChlLmcuIFsgXCI8JVwiLCBcIiU+XCIgXSkuIE9mXG4gICAqIGNvdXJzZSwgdGhlIGRlZmF1bHQgaXMgdG8gdXNlIG11c3RhY2hlcyAoaS5lLiBtdXN0YWNoZS50YWdzKS5cbiAgICpcbiAgICogQSB0b2tlbiBpcyBhbiBhcnJheSB3aXRoIGF0IGxlYXN0IDQgZWxlbWVudHMuIFRoZSBmaXJzdCBlbGVtZW50IGlzIHRoZVxuICAgKiBtdXN0YWNoZSBzeW1ib2wgdGhhdCB3YXMgdXNlZCBpbnNpZGUgdGhlIHRhZywgZS5nLiBcIiNcIiBvciBcIiZcIi4gSWYgdGhlIHRhZ1xuICAgKiBkaWQgbm90IGNvbnRhaW4gYSBzeW1ib2wgKGkuZS4ge3tteVZhbHVlfX0pIHRoaXMgZWxlbWVudCBpcyBcIm5hbWVcIi4gRm9yXG4gICAqIGFsbCB0ZXh0IHRoYXQgYXBwZWFycyBvdXRzaWRlIGEgc3ltYm9sIHRoaXMgZWxlbWVudCBpcyBcInRleHRcIi5cbiAgICpcbiAgICogVGhlIHNlY29uZCBlbGVtZW50IG9mIGEgdG9rZW4gaXMgaXRzIFwidmFsdWVcIi4gRm9yIG11c3RhY2hlIHRhZ3MgdGhpcyBpc1xuICAgKiB3aGF0ZXZlciBlbHNlIHdhcyBpbnNpZGUgdGhlIHRhZyBiZXNpZGVzIHRoZSBvcGVuaW5nIHN5bWJvbC4gRm9yIHRleHQgdG9rZW5zXG4gICAqIHRoaXMgaXMgdGhlIHRleHQgaXRzZWxmLlxuICAgKlxuICAgKiBUaGUgdGhpcmQgYW5kIGZvdXJ0aCBlbGVtZW50cyBvZiB0aGUgdG9rZW4gYXJlIHRoZSBzdGFydCBhbmQgZW5kIGluZGljZXMsXG4gICAqIHJlc3BlY3RpdmVseSwgb2YgdGhlIHRva2VuIGluIHRoZSBvcmlnaW5hbCB0ZW1wbGF0ZS5cbiAgICpcbiAgICogVG9rZW5zIHRoYXQgYXJlIHRoZSByb290IG5vZGUgb2YgYSBzdWJ0cmVlIGNvbnRhaW4gdHdvIG1vcmUgZWxlbWVudHM6IDEpIGFuXG4gICAqIGFycmF5IG9mIHRva2VucyBpbiB0aGUgc3VidHJlZSBhbmQgMikgdGhlIGluZGV4IGluIHRoZSBvcmlnaW5hbCB0ZW1wbGF0ZSBhdFxuICAgKiB3aGljaCB0aGUgY2xvc2luZyB0YWcgZm9yIHRoYXQgc2VjdGlvbiBiZWdpbnMuXG4gICAqL1xuICBmdW5jdGlvbiBwYXJzZVRlbXBsYXRlICh0ZW1wbGF0ZSwgdGFncykge1xuICAgIGlmICghdGVtcGxhdGUpXG4gICAgICByZXR1cm4gW107XG5cbiAgICB2YXIgc2VjdGlvbnMgPSBbXTsgICAgIC8vIFN0YWNrIHRvIGhvbGQgc2VjdGlvbiB0b2tlbnNcbiAgICB2YXIgdG9rZW5zID0gW107ICAgICAgIC8vIEJ1ZmZlciB0byBob2xkIHRoZSB0b2tlbnNcbiAgICB2YXIgc3BhY2VzID0gW107ICAgICAgIC8vIEluZGljZXMgb2Ygd2hpdGVzcGFjZSB0b2tlbnMgb24gdGhlIGN1cnJlbnQgbGluZVxuICAgIHZhciBoYXNUYWcgPSBmYWxzZTsgICAgLy8gSXMgdGhlcmUgYSB7e3RhZ319IG9uIHRoZSBjdXJyZW50IGxpbmU/XG4gICAgdmFyIG5vblNwYWNlID0gZmFsc2U7ICAvLyBJcyB0aGVyZSBhIG5vbi1zcGFjZSBjaGFyIG9uIHRoZSBjdXJyZW50IGxpbmU/XG5cbiAgICAvLyBTdHJpcHMgYWxsIHdoaXRlc3BhY2UgdG9rZW5zIGFycmF5IGZvciB0aGUgY3VycmVudCBsaW5lXG4gICAgLy8gaWYgdGhlcmUgd2FzIGEge3sjdGFnfX0gb24gaXQgYW5kIG90aGVyd2lzZSBvbmx5IHNwYWNlLlxuICAgIGZ1bmN0aW9uIHN0cmlwU3BhY2UgKCkge1xuICAgICAgaWYgKGhhc1RhZyAmJiAhbm9uU3BhY2UpIHtcbiAgICAgICAgd2hpbGUgKHNwYWNlcy5sZW5ndGgpXG4gICAgICAgICAgZGVsZXRlIHRva2Vuc1tzcGFjZXMucG9wKCldO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3BhY2VzID0gW107XG4gICAgICB9XG5cbiAgICAgIGhhc1RhZyA9IGZhbHNlO1xuICAgICAgbm9uU3BhY2UgPSBmYWxzZTtcbiAgICB9XG5cbiAgICB2YXIgb3BlbmluZ1RhZ1JlLCBjbG9zaW5nVGFnUmUsIGNsb3NpbmdDdXJseVJlO1xuICAgIGZ1bmN0aW9uIGNvbXBpbGVUYWdzICh0YWdzVG9Db21waWxlKSB7XG4gICAgICBpZiAodHlwZW9mIHRhZ3NUb0NvbXBpbGUgPT09ICdzdHJpbmcnKVxuICAgICAgICB0YWdzVG9Db21waWxlID0gdGFnc1RvQ29tcGlsZS5zcGxpdChzcGFjZVJlLCAyKTtcblxuICAgICAgaWYgKCFpc0FycmF5KHRhZ3NUb0NvbXBpbGUpIHx8IHRhZ3NUb0NvbXBpbGUubGVuZ3RoICE9PSAyKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgdGFnczogJyArIHRhZ3NUb0NvbXBpbGUpO1xuXG4gICAgICBvcGVuaW5nVGFnUmUgPSBuZXcgUmVnRXhwKGVzY2FwZVJlZ0V4cCh0YWdzVG9Db21waWxlWzBdKSArICdcXFxccyonKTtcbiAgICAgIGNsb3NpbmdUYWdSZSA9IG5ldyBSZWdFeHAoJ1xcXFxzKicgKyBlc2NhcGVSZWdFeHAodGFnc1RvQ29tcGlsZVsxXSkpO1xuICAgICAgY2xvc2luZ0N1cmx5UmUgPSBuZXcgUmVnRXhwKCdcXFxccyonICsgZXNjYXBlUmVnRXhwKCd9JyArIHRhZ3NUb0NvbXBpbGVbMV0pKTtcbiAgICB9XG5cbiAgICBjb21waWxlVGFncyh0YWdzIHx8IG11c3RhY2hlLnRhZ3MpO1xuXG4gICAgdmFyIHNjYW5uZXIgPSBuZXcgU2Nhbm5lcih0ZW1wbGF0ZSk7XG5cbiAgICB2YXIgc3RhcnQsIHR5cGUsIHZhbHVlLCBjaHIsIHRva2VuLCBvcGVuU2VjdGlvbjtcbiAgICB3aGlsZSAoIXNjYW5uZXIuZW9zKCkpIHtcbiAgICAgIHN0YXJ0ID0gc2Nhbm5lci5wb3M7XG5cbiAgICAgIC8vIE1hdGNoIGFueSB0ZXh0IGJldHdlZW4gdGFncy5cbiAgICAgIHZhbHVlID0gc2Nhbm5lci5zY2FuVW50aWwob3BlbmluZ1RhZ1JlKTtcblxuICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCB2YWx1ZUxlbmd0aCA9IHZhbHVlLmxlbmd0aDsgaSA8IHZhbHVlTGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICBjaHIgPSB2YWx1ZS5jaGFyQXQoaSk7XG5cbiAgICAgICAgICBpZiAoaXNXaGl0ZXNwYWNlKGNocikpIHtcbiAgICAgICAgICAgIHNwYWNlcy5wdXNoKHRva2Vucy5sZW5ndGgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBub25TcGFjZSA9IHRydWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdG9rZW5zLnB1c2goWyAndGV4dCcsIGNociwgc3RhcnQsIHN0YXJ0ICsgMSBdKTtcbiAgICAgICAgICBzdGFydCArPSAxO1xuXG4gICAgICAgICAgLy8gQ2hlY2sgZm9yIHdoaXRlc3BhY2Ugb24gdGhlIGN1cnJlbnQgbGluZS5cbiAgICAgICAgICBpZiAoY2hyID09PSAnXFxuJylcbiAgICAgICAgICAgIHN0cmlwU3BhY2UoKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBNYXRjaCB0aGUgb3BlbmluZyB0YWcuXG4gICAgICBpZiAoIXNjYW5uZXIuc2NhbihvcGVuaW5nVGFnUmUpKVxuICAgICAgICBicmVhaztcblxuICAgICAgaGFzVGFnID0gdHJ1ZTtcblxuICAgICAgLy8gR2V0IHRoZSB0YWcgdHlwZS5cbiAgICAgIHR5cGUgPSBzY2FubmVyLnNjYW4odGFnUmUpIHx8ICduYW1lJztcbiAgICAgIHNjYW5uZXIuc2Nhbih3aGl0ZVJlKTtcblxuICAgICAgLy8gR2V0IHRoZSB0YWcgdmFsdWUuXG4gICAgICBpZiAodHlwZSA9PT0gJz0nKSB7XG4gICAgICAgIHZhbHVlID0gc2Nhbm5lci5zY2FuVW50aWwoZXF1YWxzUmUpO1xuICAgICAgICBzY2FubmVyLnNjYW4oZXF1YWxzUmUpO1xuICAgICAgICBzY2FubmVyLnNjYW5VbnRpbChjbG9zaW5nVGFnUmUpO1xuICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAneycpIHtcbiAgICAgICAgdmFsdWUgPSBzY2FubmVyLnNjYW5VbnRpbChjbG9zaW5nQ3VybHlSZSk7XG4gICAgICAgIHNjYW5uZXIuc2NhbihjdXJseVJlKTtcbiAgICAgICAgc2Nhbm5lci5zY2FuVW50aWwoY2xvc2luZ1RhZ1JlKTtcbiAgICAgICAgdHlwZSA9ICcmJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbHVlID0gc2Nhbm5lci5zY2FuVW50aWwoY2xvc2luZ1RhZ1JlKTtcbiAgICAgIH1cblxuICAgICAgLy8gTWF0Y2ggdGhlIGNsb3NpbmcgdGFnLlxuICAgICAgaWYgKCFzY2FubmVyLnNjYW4oY2xvc2luZ1RhZ1JlKSlcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmNsb3NlZCB0YWcgYXQgJyArIHNjYW5uZXIucG9zKTtcblxuICAgICAgdG9rZW4gPSBbIHR5cGUsIHZhbHVlLCBzdGFydCwgc2Nhbm5lci5wb3MgXTtcbiAgICAgIHRva2Vucy5wdXNoKHRva2VuKTtcblxuICAgICAgaWYgKHR5cGUgPT09ICcjJyB8fCB0eXBlID09PSAnXicpIHtcbiAgICAgICAgc2VjdGlvbnMucHVzaCh0b2tlbik7XG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICcvJykge1xuICAgICAgICAvLyBDaGVjayBzZWN0aW9uIG5lc3RpbmcuXG4gICAgICAgIG9wZW5TZWN0aW9uID0gc2VjdGlvbnMucG9wKCk7XG5cbiAgICAgICAgaWYgKCFvcGVuU2VjdGlvbilcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vub3BlbmVkIHNlY3Rpb24gXCInICsgdmFsdWUgKyAnXCIgYXQgJyArIHN0YXJ0KTtcblxuICAgICAgICBpZiAob3BlblNlY3Rpb25bMV0gIT09IHZhbHVlKVxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVW5jbG9zZWQgc2VjdGlvbiBcIicgKyBvcGVuU2VjdGlvblsxXSArICdcIiBhdCAnICsgc3RhcnQpO1xuICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAnbmFtZScgfHwgdHlwZSA9PT0gJ3snIHx8IHR5cGUgPT09ICcmJykge1xuICAgICAgICBub25TcGFjZSA9IHRydWU7XG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICc9Jykge1xuICAgICAgICAvLyBTZXQgdGhlIHRhZ3MgZm9yIHRoZSBuZXh0IHRpbWUgYXJvdW5kLlxuICAgICAgICBjb21waWxlVGFncyh2YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gTWFrZSBzdXJlIHRoZXJlIGFyZSBubyBvcGVuIHNlY3Rpb25zIHdoZW4gd2UncmUgZG9uZS5cbiAgICBvcGVuU2VjdGlvbiA9IHNlY3Rpb25zLnBvcCgpO1xuXG4gICAgaWYgKG9wZW5TZWN0aW9uKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmNsb3NlZCBzZWN0aW9uIFwiJyArIG9wZW5TZWN0aW9uWzFdICsgJ1wiIGF0ICcgKyBzY2FubmVyLnBvcyk7XG5cbiAgICByZXR1cm4gbmVzdFRva2VucyhzcXVhc2hUb2tlbnModG9rZW5zKSk7XG4gIH1cblxuICAvKipcbiAgICogQ29tYmluZXMgdGhlIHZhbHVlcyBvZiBjb25zZWN1dGl2ZSB0ZXh0IHRva2VucyBpbiB0aGUgZ2l2ZW4gYHRva2Vuc2AgYXJyYXlcbiAgICogdG8gYSBzaW5nbGUgdG9rZW4uXG4gICAqL1xuICBmdW5jdGlvbiBzcXVhc2hUb2tlbnMgKHRva2Vucykge1xuICAgIHZhciBzcXVhc2hlZFRva2VucyA9IFtdO1xuXG4gICAgdmFyIHRva2VuLCBsYXN0VG9rZW47XG4gICAgZm9yICh2YXIgaSA9IDAsIG51bVRva2VucyA9IHRva2Vucy5sZW5ndGg7IGkgPCBudW1Ub2tlbnM7ICsraSkge1xuICAgICAgdG9rZW4gPSB0b2tlbnNbaV07XG5cbiAgICAgIGlmICh0b2tlbikge1xuICAgICAgICBpZiAodG9rZW5bMF0gPT09ICd0ZXh0JyAmJiBsYXN0VG9rZW4gJiYgbGFzdFRva2VuWzBdID09PSAndGV4dCcpIHtcbiAgICAgICAgICBsYXN0VG9rZW5bMV0gKz0gdG9rZW5bMV07XG4gICAgICAgICAgbGFzdFRva2VuWzNdID0gdG9rZW5bM107XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3F1YXNoZWRUb2tlbnMucHVzaCh0b2tlbik7XG4gICAgICAgICAgbGFzdFRva2VuID0gdG9rZW47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gc3F1YXNoZWRUb2tlbnM7XG4gIH1cblxuICAvKipcbiAgICogRm9ybXMgdGhlIGdpdmVuIGFycmF5IG9mIGB0b2tlbnNgIGludG8gYSBuZXN0ZWQgdHJlZSBzdHJ1Y3R1cmUgd2hlcmVcbiAgICogdG9rZW5zIHRoYXQgcmVwcmVzZW50IGEgc2VjdGlvbiBoYXZlIHR3byBhZGRpdGlvbmFsIGl0ZW1zOiAxKSBhbiBhcnJheSBvZlxuICAgKiBhbGwgdG9rZW5zIHRoYXQgYXBwZWFyIGluIHRoYXQgc2VjdGlvbiBhbmQgMikgdGhlIGluZGV4IGluIHRoZSBvcmlnaW5hbFxuICAgKiB0ZW1wbGF0ZSB0aGF0IHJlcHJlc2VudHMgdGhlIGVuZCBvZiB0aGF0IHNlY3Rpb24uXG4gICAqL1xuICBmdW5jdGlvbiBuZXN0VG9rZW5zICh0b2tlbnMpIHtcbiAgICB2YXIgbmVzdGVkVG9rZW5zID0gW107XG4gICAgdmFyIGNvbGxlY3RvciA9IG5lc3RlZFRva2VucztcbiAgICB2YXIgc2VjdGlvbnMgPSBbXTtcblxuICAgIHZhciB0b2tlbiwgc2VjdGlvbjtcbiAgICBmb3IgKHZhciBpID0gMCwgbnVtVG9rZW5zID0gdG9rZW5zLmxlbmd0aDsgaSA8IG51bVRva2VuczsgKytpKSB7XG4gICAgICB0b2tlbiA9IHRva2Vuc1tpXTtcblxuICAgICAgc3dpdGNoICh0b2tlblswXSkge1xuICAgICAgICBjYXNlICcjJzpcbiAgICAgICAgY2FzZSAnXic6XG4gICAgICAgICAgY29sbGVjdG9yLnB1c2godG9rZW4pO1xuICAgICAgICAgIHNlY3Rpb25zLnB1c2godG9rZW4pO1xuICAgICAgICAgIGNvbGxlY3RvciA9IHRva2VuWzRdID0gW107XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJy8nOlxuICAgICAgICAgIHNlY3Rpb24gPSBzZWN0aW9ucy5wb3AoKTtcbiAgICAgICAgICBzZWN0aW9uWzVdID0gdG9rZW5bMl07XG4gICAgICAgICAgY29sbGVjdG9yID0gc2VjdGlvbnMubGVuZ3RoID4gMCA/IHNlY3Rpb25zW3NlY3Rpb25zLmxlbmd0aCAtIDFdWzRdIDogbmVzdGVkVG9rZW5zO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGNvbGxlY3Rvci5wdXNoKHRva2VuKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbmVzdGVkVG9rZW5zO1xuICB9XG5cbiAgLyoqXG4gICAqIEEgc2ltcGxlIHN0cmluZyBzY2FubmVyIHRoYXQgaXMgdXNlZCBieSB0aGUgdGVtcGxhdGUgcGFyc2VyIHRvIGZpbmRcbiAgICogdG9rZW5zIGluIHRlbXBsYXRlIHN0cmluZ3MuXG4gICAqL1xuICBmdW5jdGlvbiBTY2FubmVyIChzdHJpbmcpIHtcbiAgICB0aGlzLnN0cmluZyA9IHN0cmluZztcbiAgICB0aGlzLnRhaWwgPSBzdHJpbmc7XG4gICAgdGhpcy5wb3MgPSAwO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYHRydWVgIGlmIHRoZSB0YWlsIGlzIGVtcHR5IChlbmQgb2Ygc3RyaW5nKS5cbiAgICovXG4gIFNjYW5uZXIucHJvdG90eXBlLmVvcyA9IGZ1bmN0aW9uIGVvcyAoKSB7XG4gICAgcmV0dXJuIHRoaXMudGFpbCA9PT0gJyc7XG4gIH07XG5cbiAgLyoqXG4gICAqIFRyaWVzIHRvIG1hdGNoIHRoZSBnaXZlbiByZWd1bGFyIGV4cHJlc3Npb24gYXQgdGhlIGN1cnJlbnQgcG9zaXRpb24uXG4gICAqIFJldHVybnMgdGhlIG1hdGNoZWQgdGV4dCBpZiBpdCBjYW4gbWF0Y2gsIHRoZSBlbXB0eSBzdHJpbmcgb3RoZXJ3aXNlLlxuICAgKi9cbiAgU2Nhbm5lci5wcm90b3R5cGUuc2NhbiA9IGZ1bmN0aW9uIHNjYW4gKHJlKSB7XG4gICAgdmFyIG1hdGNoID0gdGhpcy50YWlsLm1hdGNoKHJlKTtcblxuICAgIGlmICghbWF0Y2ggfHwgbWF0Y2guaW5kZXggIT09IDApXG4gICAgICByZXR1cm4gJyc7XG5cbiAgICB2YXIgc3RyaW5nID0gbWF0Y2hbMF07XG5cbiAgICB0aGlzLnRhaWwgPSB0aGlzLnRhaWwuc3Vic3RyaW5nKHN0cmluZy5sZW5ndGgpO1xuICAgIHRoaXMucG9zICs9IHN0cmluZy5sZW5ndGg7XG5cbiAgICByZXR1cm4gc3RyaW5nO1xuICB9O1xuXG4gIC8qKlxuICAgKiBTa2lwcyBhbGwgdGV4dCB1bnRpbCB0aGUgZ2l2ZW4gcmVndWxhciBleHByZXNzaW9uIGNhbiBiZSBtYXRjaGVkLiBSZXR1cm5zXG4gICAqIHRoZSBza2lwcGVkIHN0cmluZywgd2hpY2ggaXMgdGhlIGVudGlyZSB0YWlsIGlmIG5vIG1hdGNoIGNhbiBiZSBtYWRlLlxuICAgKi9cbiAgU2Nhbm5lci5wcm90b3R5cGUuc2NhblVudGlsID0gZnVuY3Rpb24gc2NhblVudGlsIChyZSkge1xuICAgIHZhciBpbmRleCA9IHRoaXMudGFpbC5zZWFyY2gocmUpLCBtYXRjaDtcblxuICAgIHN3aXRjaCAoaW5kZXgpIHtcbiAgICAgIGNhc2UgLTE6XG4gICAgICAgIG1hdGNoID0gdGhpcy50YWlsO1xuICAgICAgICB0aGlzLnRhaWwgPSAnJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDA6XG4gICAgICAgIG1hdGNoID0gJyc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgbWF0Y2ggPSB0aGlzLnRhaWwuc3Vic3RyaW5nKDAsIGluZGV4KTtcbiAgICAgICAgdGhpcy50YWlsID0gdGhpcy50YWlsLnN1YnN0cmluZyhpbmRleCk7XG4gICAgfVxuXG4gICAgdGhpcy5wb3MgKz0gbWF0Y2gubGVuZ3RoO1xuXG4gICAgcmV0dXJuIG1hdGNoO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZXByZXNlbnRzIGEgcmVuZGVyaW5nIGNvbnRleHQgYnkgd3JhcHBpbmcgYSB2aWV3IG9iamVjdCBhbmRcbiAgICogbWFpbnRhaW5pbmcgYSByZWZlcmVuY2UgdG8gdGhlIHBhcmVudCBjb250ZXh0LlxuICAgKi9cbiAgZnVuY3Rpb24gQ29udGV4dCAodmlldywgcGFyZW50Q29udGV4dCkge1xuICAgIHRoaXMudmlldyA9IHZpZXc7XG4gICAgdGhpcy5jYWNoZSA9IHsgJy4nOiB0aGlzLnZpZXcgfTtcbiAgICB0aGlzLnBhcmVudCA9IHBhcmVudENvbnRleHQ7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBjb250ZXh0IHVzaW5nIHRoZSBnaXZlbiB2aWV3IHdpdGggdGhpcyBjb250ZXh0XG4gICAqIGFzIHRoZSBwYXJlbnQuXG4gICAqL1xuICBDb250ZXh0LnByb3RvdHlwZS5wdXNoID0gZnVuY3Rpb24gcHVzaCAodmlldykge1xuICAgIHJldHVybiBuZXcgQ29udGV4dCh2aWV3LCB0aGlzKTtcbiAgfTtcblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgdmFsdWUgb2YgdGhlIGdpdmVuIG5hbWUgaW4gdGhpcyBjb250ZXh0LCB0cmF2ZXJzaW5nXG4gICAqIHVwIHRoZSBjb250ZXh0IGhpZXJhcmNoeSBpZiB0aGUgdmFsdWUgaXMgYWJzZW50IGluIHRoaXMgY29udGV4dCdzIHZpZXcuXG4gICAqL1xuICBDb250ZXh0LnByb3RvdHlwZS5sb29rdXAgPSBmdW5jdGlvbiBsb29rdXAgKG5hbWUpIHtcbiAgICB2YXIgY2FjaGUgPSB0aGlzLmNhY2hlO1xuXG4gICAgdmFyIHZhbHVlO1xuICAgIGlmIChjYWNoZS5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xuICAgICAgdmFsdWUgPSBjYWNoZVtuYW1lXTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGNvbnRleHQgPSB0aGlzLCBuYW1lcywgaW5kZXgsIGxvb2t1cEhpdCA9IGZhbHNlO1xuXG4gICAgICB3aGlsZSAoY29udGV4dCkge1xuICAgICAgICBpZiAobmFtZS5pbmRleE9mKCcuJykgPiAwKSB7XG4gICAgICAgICAgdmFsdWUgPSBjb250ZXh0LnZpZXc7XG4gICAgICAgICAgbmFtZXMgPSBuYW1lLnNwbGl0KCcuJyk7XG4gICAgICAgICAgaW5kZXggPSAwO1xuXG4gICAgICAgICAgLyoqXG4gICAgICAgICAgICogVXNpbmcgdGhlIGRvdCBub3Rpb24gcGF0aCBpbiBgbmFtZWAsIHdlIGRlc2NlbmQgdGhyb3VnaCB0aGVcbiAgICAgICAgICAgKiBuZXN0ZWQgb2JqZWN0cy5cbiAgICAgICAgICAgKlxuICAgICAgICAgICAqIFRvIGJlIGNlcnRhaW4gdGhhdCB0aGUgbG9va3VwIGhhcyBiZWVuIHN1Y2Nlc3NmdWwsIHdlIGhhdmUgdG9cbiAgICAgICAgICAgKiBjaGVjayBpZiB0aGUgbGFzdCBvYmplY3QgaW4gdGhlIHBhdGggYWN0dWFsbHkgaGFzIHRoZSBwcm9wZXJ0eVxuICAgICAgICAgICAqIHdlIGFyZSBsb29raW5nIGZvci4gV2Ugc3RvcmUgdGhlIHJlc3VsdCBpbiBgbG9va3VwSGl0YC5cbiAgICAgICAgICAgKlxuICAgICAgICAgICAqIFRoaXMgaXMgc3BlY2lhbGx5IG5lY2Vzc2FyeSBmb3Igd2hlbiB0aGUgdmFsdWUgaGFzIGJlZW4gc2V0IHRvXG4gICAgICAgICAgICogYHVuZGVmaW5lZGAgYW5kIHdlIHdhbnQgdG8gYXZvaWQgbG9va2luZyB1cCBwYXJlbnQgY29udGV4dHMuXG4gICAgICAgICAgICoqL1xuICAgICAgICAgIHdoaWxlICh2YWx1ZSAhPSBudWxsICYmIGluZGV4IDwgbmFtZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAoaW5kZXggPT09IG5hbWVzLmxlbmd0aCAtIDEpXG4gICAgICAgICAgICAgIGxvb2t1cEhpdCA9IGhhc1Byb3BlcnR5KHZhbHVlLCBuYW1lc1tpbmRleF0pO1xuXG4gICAgICAgICAgICB2YWx1ZSA9IHZhbHVlW25hbWVzW2luZGV4KytdXTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFsdWUgPSBjb250ZXh0LnZpZXdbbmFtZV07XG4gICAgICAgICAgbG9va3VwSGl0ID0gaGFzUHJvcGVydHkoY29udGV4dC52aWV3LCBuYW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChsb29rdXBIaXQpXG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY29udGV4dCA9IGNvbnRleHQucGFyZW50O1xuICAgICAgfVxuXG4gICAgICBjYWNoZVtuYW1lXSA9IHZhbHVlO1xuICAgIH1cblxuICAgIGlmIChpc0Z1bmN0aW9uKHZhbHVlKSlcbiAgICAgIHZhbHVlID0gdmFsdWUuY2FsbCh0aGlzLnZpZXcpO1xuXG4gICAgcmV0dXJuIHZhbHVlO1xuICB9O1xuXG4gIC8qKlxuICAgKiBBIFdyaXRlciBrbm93cyBob3cgdG8gdGFrZSBhIHN0cmVhbSBvZiB0b2tlbnMgYW5kIHJlbmRlciB0aGVtIHRvIGFcbiAgICogc3RyaW5nLCBnaXZlbiBhIGNvbnRleHQuIEl0IGFsc28gbWFpbnRhaW5zIGEgY2FjaGUgb2YgdGVtcGxhdGVzIHRvXG4gICAqIGF2b2lkIHRoZSBuZWVkIHRvIHBhcnNlIHRoZSBzYW1lIHRlbXBsYXRlIHR3aWNlLlxuICAgKi9cbiAgZnVuY3Rpb24gV3JpdGVyICgpIHtcbiAgICB0aGlzLmNhY2hlID0ge307XG4gIH1cblxuICAvKipcbiAgICogQ2xlYXJzIGFsbCBjYWNoZWQgdGVtcGxhdGVzIGluIHRoaXMgd3JpdGVyLlxuICAgKi9cbiAgV3JpdGVyLnByb3RvdHlwZS5jbGVhckNhY2hlID0gZnVuY3Rpb24gY2xlYXJDYWNoZSAoKSB7XG4gICAgdGhpcy5jYWNoZSA9IHt9O1xuICB9O1xuXG4gIC8qKlxuICAgKiBQYXJzZXMgYW5kIGNhY2hlcyB0aGUgZ2l2ZW4gYHRlbXBsYXRlYCBhbmQgcmV0dXJucyB0aGUgYXJyYXkgb2YgdG9rZW5zXG4gICAqIHRoYXQgaXMgZ2VuZXJhdGVkIGZyb20gdGhlIHBhcnNlLlxuICAgKi9cbiAgV3JpdGVyLnByb3RvdHlwZS5wYXJzZSA9IGZ1bmN0aW9uIHBhcnNlICh0ZW1wbGF0ZSwgdGFncykge1xuICAgIHZhciBjYWNoZSA9IHRoaXMuY2FjaGU7XG4gICAgdmFyIHRva2VucyA9IGNhY2hlW3RlbXBsYXRlXTtcblxuICAgIGlmICh0b2tlbnMgPT0gbnVsbClcbiAgICAgIHRva2VucyA9IGNhY2hlW3RlbXBsYXRlXSA9IHBhcnNlVGVtcGxhdGUodGVtcGxhdGUsIHRhZ3MpO1xuXG4gICAgcmV0dXJuIHRva2VucztcbiAgfTtcblxuICAvKipcbiAgICogSGlnaC1sZXZlbCBtZXRob2QgdGhhdCBpcyB1c2VkIHRvIHJlbmRlciB0aGUgZ2l2ZW4gYHRlbXBsYXRlYCB3aXRoXG4gICAqIHRoZSBnaXZlbiBgdmlld2AuXG4gICAqXG4gICAqIFRoZSBvcHRpb25hbCBgcGFydGlhbHNgIGFyZ3VtZW50IG1heSBiZSBhbiBvYmplY3QgdGhhdCBjb250YWlucyB0aGVcbiAgICogbmFtZXMgYW5kIHRlbXBsYXRlcyBvZiBwYXJ0aWFscyB0aGF0IGFyZSB1c2VkIGluIHRoZSB0ZW1wbGF0ZS4gSXQgbWF5XG4gICAqIGFsc28gYmUgYSBmdW5jdGlvbiB0aGF0IGlzIHVzZWQgdG8gbG9hZCBwYXJ0aWFsIHRlbXBsYXRlcyBvbiB0aGUgZmx5XG4gICAqIHRoYXQgdGFrZXMgYSBzaW5nbGUgYXJndW1lbnQ6IHRoZSBuYW1lIG9mIHRoZSBwYXJ0aWFsLlxuICAgKi9cbiAgV3JpdGVyLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbiByZW5kZXIgKHRlbXBsYXRlLCB2aWV3LCBwYXJ0aWFscykge1xuICAgIHZhciB0b2tlbnMgPSB0aGlzLnBhcnNlKHRlbXBsYXRlKTtcbiAgICB2YXIgY29udGV4dCA9ICh2aWV3IGluc3RhbmNlb2YgQ29udGV4dCkgPyB2aWV3IDogbmV3IENvbnRleHQodmlldyk7XG4gICAgcmV0dXJuIHRoaXMucmVuZGVyVG9rZW5zKHRva2VucywgY29udGV4dCwgcGFydGlhbHMsIHRlbXBsYXRlKTtcbiAgfTtcblxuICAvKipcbiAgICogTG93LWxldmVsIG1ldGhvZCB0aGF0IHJlbmRlcnMgdGhlIGdpdmVuIGFycmF5IG9mIGB0b2tlbnNgIHVzaW5nXG4gICAqIHRoZSBnaXZlbiBgY29udGV4dGAgYW5kIGBwYXJ0aWFsc2AuXG4gICAqXG4gICAqIE5vdGU6IFRoZSBgb3JpZ2luYWxUZW1wbGF0ZWAgaXMgb25seSBldmVyIHVzZWQgdG8gZXh0cmFjdCB0aGUgcG9ydGlvblxuICAgKiBvZiB0aGUgb3JpZ2luYWwgdGVtcGxhdGUgdGhhdCB3YXMgY29udGFpbmVkIGluIGEgaGlnaGVyLW9yZGVyIHNlY3Rpb24uXG4gICAqIElmIHRoZSB0ZW1wbGF0ZSBkb2Vzbid0IHVzZSBoaWdoZXItb3JkZXIgc2VjdGlvbnMsIHRoaXMgYXJndW1lbnQgbWF5XG4gICAqIGJlIG9taXR0ZWQuXG4gICAqL1xuICBXcml0ZXIucHJvdG90eXBlLnJlbmRlclRva2VucyA9IGZ1bmN0aW9uIHJlbmRlclRva2VucyAodG9rZW5zLCBjb250ZXh0LCBwYXJ0aWFscywgb3JpZ2luYWxUZW1wbGF0ZSkge1xuICAgIHZhciBidWZmZXIgPSAnJztcblxuICAgIHZhciB0b2tlbiwgc3ltYm9sLCB2YWx1ZTtcbiAgICBmb3IgKHZhciBpID0gMCwgbnVtVG9rZW5zID0gdG9rZW5zLmxlbmd0aDsgaSA8IG51bVRva2VuczsgKytpKSB7XG4gICAgICB2YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICAgIHRva2VuID0gdG9rZW5zW2ldO1xuICAgICAgc3ltYm9sID0gdG9rZW5bMF07XG5cbiAgICAgIGlmIChzeW1ib2wgPT09ICcjJykgdmFsdWUgPSB0aGlzLnJlbmRlclNlY3Rpb24odG9rZW4sIGNvbnRleHQsIHBhcnRpYWxzLCBvcmlnaW5hbFRlbXBsYXRlKTtcbiAgICAgIGVsc2UgaWYgKHN5bWJvbCA9PT0gJ14nKSB2YWx1ZSA9IHRoaXMucmVuZGVySW52ZXJ0ZWQodG9rZW4sIGNvbnRleHQsIHBhcnRpYWxzLCBvcmlnaW5hbFRlbXBsYXRlKTtcbiAgICAgIGVsc2UgaWYgKHN5bWJvbCA9PT0gJz4nKSB2YWx1ZSA9IHRoaXMucmVuZGVyUGFydGlhbCh0b2tlbiwgY29udGV4dCwgcGFydGlhbHMsIG9yaWdpbmFsVGVtcGxhdGUpO1xuICAgICAgZWxzZSBpZiAoc3ltYm9sID09PSAnJicpIHZhbHVlID0gdGhpcy51bmVzY2FwZWRWYWx1ZSh0b2tlbiwgY29udGV4dCk7XG4gICAgICBlbHNlIGlmIChzeW1ib2wgPT09ICduYW1lJykgdmFsdWUgPSB0aGlzLmVzY2FwZWRWYWx1ZSh0b2tlbiwgY29udGV4dCk7XG4gICAgICBlbHNlIGlmIChzeW1ib2wgPT09ICd0ZXh0JykgdmFsdWUgPSB0aGlzLnJhd1ZhbHVlKHRva2VuKTtcblxuICAgICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpXG4gICAgICAgIGJ1ZmZlciArPSB2YWx1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gYnVmZmVyO1xuICB9O1xuXG4gIFdyaXRlci5wcm90b3R5cGUucmVuZGVyU2VjdGlvbiA9IGZ1bmN0aW9uIHJlbmRlclNlY3Rpb24gKHRva2VuLCBjb250ZXh0LCBwYXJ0aWFscywgb3JpZ2luYWxUZW1wbGF0ZSkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgYnVmZmVyID0gJyc7XG4gICAgdmFyIHZhbHVlID0gY29udGV4dC5sb29rdXAodG9rZW5bMV0pO1xuXG4gICAgLy8gVGhpcyBmdW5jdGlvbiBpcyB1c2VkIHRvIHJlbmRlciBhbiBhcmJpdHJhcnkgdGVtcGxhdGVcbiAgICAvLyBpbiB0aGUgY3VycmVudCBjb250ZXh0IGJ5IGhpZ2hlci1vcmRlciBzZWN0aW9ucy5cbiAgICBmdW5jdGlvbiBzdWJSZW5kZXIgKHRlbXBsYXRlKSB7XG4gICAgICByZXR1cm4gc2VsZi5yZW5kZXIodGVtcGxhdGUsIGNvbnRleHQsIHBhcnRpYWxzKTtcbiAgICB9XG5cbiAgICBpZiAoIXZhbHVlKSByZXR1cm47XG5cbiAgICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgIGZvciAodmFyIGogPSAwLCB2YWx1ZUxlbmd0aCA9IHZhbHVlLmxlbmd0aDsgaiA8IHZhbHVlTGVuZ3RoOyArK2opIHtcbiAgICAgICAgYnVmZmVyICs9IHRoaXMucmVuZGVyVG9rZW5zKHRva2VuWzRdLCBjb250ZXh0LnB1c2godmFsdWVbal0pLCBwYXJ0aWFscywgb3JpZ2luYWxUZW1wbGF0ZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnIHx8IHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJykge1xuICAgICAgYnVmZmVyICs9IHRoaXMucmVuZGVyVG9rZW5zKHRva2VuWzRdLCBjb250ZXh0LnB1c2godmFsdWUpLCBwYXJ0aWFscywgb3JpZ2luYWxUZW1wbGF0ZSk7XG4gICAgfSBlbHNlIGlmIChpc0Z1bmN0aW9uKHZhbHVlKSkge1xuICAgICAgaWYgKHR5cGVvZiBvcmlnaW5hbFRlbXBsYXRlICE9PSAnc3RyaW5nJylcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgdXNlIGhpZ2hlci1vcmRlciBzZWN0aW9ucyB3aXRob3V0IHRoZSBvcmlnaW5hbCB0ZW1wbGF0ZScpO1xuXG4gICAgICAvLyBFeHRyYWN0IHRoZSBwb3J0aW9uIG9mIHRoZSBvcmlnaW5hbCB0ZW1wbGF0ZSB0aGF0IHRoZSBzZWN0aW9uIGNvbnRhaW5zLlxuICAgICAgdmFsdWUgPSB2YWx1ZS5jYWxsKGNvbnRleHQudmlldywgb3JpZ2luYWxUZW1wbGF0ZS5zbGljZSh0b2tlblszXSwgdG9rZW5bNV0pLCBzdWJSZW5kZXIpO1xuXG4gICAgICBpZiAodmFsdWUgIT0gbnVsbClcbiAgICAgICAgYnVmZmVyICs9IHZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBidWZmZXIgKz0gdGhpcy5yZW5kZXJUb2tlbnModG9rZW5bNF0sIGNvbnRleHQsIHBhcnRpYWxzLCBvcmlnaW5hbFRlbXBsYXRlKTtcbiAgICB9XG4gICAgcmV0dXJuIGJ1ZmZlcjtcbiAgfTtcblxuICBXcml0ZXIucHJvdG90eXBlLnJlbmRlckludmVydGVkID0gZnVuY3Rpb24gcmVuZGVySW52ZXJ0ZWQgKHRva2VuLCBjb250ZXh0LCBwYXJ0aWFscywgb3JpZ2luYWxUZW1wbGF0ZSkge1xuICAgIHZhciB2YWx1ZSA9IGNvbnRleHQubG9va3VwKHRva2VuWzFdKTtcblxuICAgIC8vIFVzZSBKYXZhU2NyaXB0J3MgZGVmaW5pdGlvbiBvZiBmYWxzeS4gSW5jbHVkZSBlbXB0eSBhcnJheXMuXG4gICAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9qYW5sL211c3RhY2hlLmpzL2lzc3Vlcy8xODZcbiAgICBpZiAoIXZhbHVlIHx8IChpc0FycmF5KHZhbHVlKSAmJiB2YWx1ZS5sZW5ndGggPT09IDApKVxuICAgICAgcmV0dXJuIHRoaXMucmVuZGVyVG9rZW5zKHRva2VuWzRdLCBjb250ZXh0LCBwYXJ0aWFscywgb3JpZ2luYWxUZW1wbGF0ZSk7XG4gIH07XG5cbiAgV3JpdGVyLnByb3RvdHlwZS5yZW5kZXJQYXJ0aWFsID0gZnVuY3Rpb24gcmVuZGVyUGFydGlhbCAodG9rZW4sIGNvbnRleHQsIHBhcnRpYWxzKSB7XG4gICAgaWYgKCFwYXJ0aWFscykgcmV0dXJuO1xuXG4gICAgdmFyIHZhbHVlID0gaXNGdW5jdGlvbihwYXJ0aWFscykgPyBwYXJ0aWFscyh0b2tlblsxXSkgOiBwYXJ0aWFsc1t0b2tlblsxXV07XG4gICAgaWYgKHZhbHVlICE9IG51bGwpXG4gICAgICByZXR1cm4gdGhpcy5yZW5kZXJUb2tlbnModGhpcy5wYXJzZSh2YWx1ZSksIGNvbnRleHQsIHBhcnRpYWxzLCB2YWx1ZSk7XG4gIH07XG5cbiAgV3JpdGVyLnByb3RvdHlwZS51bmVzY2FwZWRWYWx1ZSA9IGZ1bmN0aW9uIHVuZXNjYXBlZFZhbHVlICh0b2tlbiwgY29udGV4dCkge1xuICAgIHZhciB2YWx1ZSA9IGNvbnRleHQubG9va3VwKHRva2VuWzFdKTtcbiAgICBpZiAodmFsdWUgIT0gbnVsbClcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgfTtcblxuICBXcml0ZXIucHJvdG90eXBlLmVzY2FwZWRWYWx1ZSA9IGZ1bmN0aW9uIGVzY2FwZWRWYWx1ZSAodG9rZW4sIGNvbnRleHQpIHtcbiAgICB2YXIgdmFsdWUgPSBjb250ZXh0Lmxvb2t1cCh0b2tlblsxXSk7XG4gICAgaWYgKHZhbHVlICE9IG51bGwpXG4gICAgICByZXR1cm4gbXVzdGFjaGUuZXNjYXBlKHZhbHVlKTtcbiAgfTtcblxuICBXcml0ZXIucHJvdG90eXBlLnJhd1ZhbHVlID0gZnVuY3Rpb24gcmF3VmFsdWUgKHRva2VuKSB7XG4gICAgcmV0dXJuIHRva2VuWzFdO1xuICB9O1xuXG4gIG11c3RhY2hlLm5hbWUgPSAnbXVzdGFjaGUuanMnO1xuICBtdXN0YWNoZS52ZXJzaW9uID0gJzIuMi4xJztcbiAgbXVzdGFjaGUudGFncyA9IFsgJ3t7JywgJ319JyBdO1xuXG4gIC8vIEFsbCBoaWdoLWxldmVsIG11c3RhY2hlLiogZnVuY3Rpb25zIHVzZSB0aGlzIHdyaXRlci5cbiAgdmFyIGRlZmF1bHRXcml0ZXIgPSBuZXcgV3JpdGVyKCk7XG5cbiAgLyoqXG4gICAqIENsZWFycyBhbGwgY2FjaGVkIHRlbXBsYXRlcyBpbiB0aGUgZGVmYXVsdCB3cml0ZXIuXG4gICAqL1xuICBtdXN0YWNoZS5jbGVhckNhY2hlID0gZnVuY3Rpb24gY2xlYXJDYWNoZSAoKSB7XG4gICAgcmV0dXJuIGRlZmF1bHRXcml0ZXIuY2xlYXJDYWNoZSgpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBQYXJzZXMgYW5kIGNhY2hlcyB0aGUgZ2l2ZW4gdGVtcGxhdGUgaW4gdGhlIGRlZmF1bHQgd3JpdGVyIGFuZCByZXR1cm5zIHRoZVxuICAgKiBhcnJheSBvZiB0b2tlbnMgaXQgY29udGFpbnMuIERvaW5nIHRoaXMgYWhlYWQgb2YgdGltZSBhdm9pZHMgdGhlIG5lZWQgdG9cbiAgICogcGFyc2UgdGVtcGxhdGVzIG9uIHRoZSBmbHkgYXMgdGhleSBhcmUgcmVuZGVyZWQuXG4gICAqL1xuICBtdXN0YWNoZS5wYXJzZSA9IGZ1bmN0aW9uIHBhcnNlICh0ZW1wbGF0ZSwgdGFncykge1xuICAgIHJldHVybiBkZWZhdWx0V3JpdGVyLnBhcnNlKHRlbXBsYXRlLCB0YWdzKTtcbiAgfTtcblxuICAvKipcbiAgICogUmVuZGVycyB0aGUgYHRlbXBsYXRlYCB3aXRoIHRoZSBnaXZlbiBgdmlld2AgYW5kIGBwYXJ0aWFsc2AgdXNpbmcgdGhlXG4gICAqIGRlZmF1bHQgd3JpdGVyLlxuICAgKi9cbiAgbXVzdGFjaGUucmVuZGVyID0gZnVuY3Rpb24gcmVuZGVyICh0ZW1wbGF0ZSwgdmlldywgcGFydGlhbHMpIHtcbiAgICBpZiAodHlwZW9mIHRlbXBsYXRlICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCB0ZW1wbGF0ZSEgVGVtcGxhdGUgc2hvdWxkIGJlIGEgXCJzdHJpbmdcIiAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ2J1dCBcIicgKyB0eXBlU3RyKHRlbXBsYXRlKSArICdcIiB3YXMgZ2l2ZW4gYXMgdGhlIGZpcnN0ICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAnYXJndW1lbnQgZm9yIG11c3RhY2hlI3JlbmRlcih0ZW1wbGF0ZSwgdmlldywgcGFydGlhbHMpJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRlZmF1bHRXcml0ZXIucmVuZGVyKHRlbXBsYXRlLCB2aWV3LCBwYXJ0aWFscyk7XG4gIH07XG5cbiAgLy8gVGhpcyBpcyBoZXJlIGZvciBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eSB3aXRoIDAuNC54LixcbiAgLyplc2xpbnQtZGlzYWJsZSAqLyAvLyBlc2xpbnQgd2FudHMgY2FtZWwgY2FzZWQgZnVuY3Rpb24gbmFtZVxuICBtdXN0YWNoZS50b19odG1sID0gZnVuY3Rpb24gdG9faHRtbCAodGVtcGxhdGUsIHZpZXcsIHBhcnRpYWxzLCBzZW5kKSB7XG4gICAgLyplc2xpbnQtZW5hYmxlKi9cblxuICAgIHZhciByZXN1bHQgPSBtdXN0YWNoZS5yZW5kZXIodGVtcGxhdGUsIHZpZXcsIHBhcnRpYWxzKTtcblxuICAgIGlmIChpc0Z1bmN0aW9uKHNlbmQpKSB7XG4gICAgICBzZW5kKHJlc3VsdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICB9O1xuXG4gIC8vIEV4cG9ydCB0aGUgZXNjYXBpbmcgZnVuY3Rpb24gc28gdGhhdCB0aGUgdXNlciBtYXkgb3ZlcnJpZGUgaXQuXG4gIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vamFubC9tdXN0YWNoZS5qcy9pc3N1ZXMvMjQ0XG4gIG11c3RhY2hlLmVzY2FwZSA9IGVzY2FwZUh0bWw7XG5cbiAgLy8gRXhwb3J0IHRoZXNlIG1haW5seSBmb3IgdGVzdGluZywgYnV0IGFsc28gZm9yIGFkdmFuY2VkIHVzYWdlLlxuICBtdXN0YWNoZS5TY2FubmVyID0gU2Nhbm5lcjtcbiAgbXVzdGFjaGUuQ29udGV4dCA9IENvbnRleHQ7XG4gIG11c3RhY2hlLldyaXRlciA9IFdyaXRlcjtcblxufSkpOyJdfQ==
