/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports) {

	/**
	 * Autocomplete class.
	 * @class Autocomplete
	 */
	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var KEY_DOWN = 40;
	var KEY_UP = 38;
	var KEY_ENTER = 13;
	var KEY_DEL = 8;

	var Autocomplete = (function () {

	  /**
	  * Represents an Autocomplete instance.
	  * @constructs Autocomplete
	  * @param {Object} options - Options to configure the plugin
	  * @param {string} options.input - Selector of the input to bind
	  * @param {Array} [options.data] - Data to use
	  */

	  function Autocomplete(options) {
	    _classCallCheck(this, Autocomplete);

	    this.input = document.querySelector(options.input);
	    this.data = options.data;
	    this.xhr = options.xhr;
	    this.delay = options.delay || 500;
	    this.maxResult = options.maxResult || 5;
	    this.callback = options.callback;
	    this.render = options.render || {};
	    this.hasResults = false;
	    this.bindEvents();
	    this.createResultsContainer();
	  }

	  /**
	   * @type {function}
	   */

	  _createClass(Autocomplete, [{
	    key: 'bindEvents',
	    value: function bindEvents() {
	      var _this2 = this;

	      var _this = this;

	      this.input.addEventListener('keyup', function (e) {
	        if (e.keyCode !== KEY_DOWN && e.keyCode !== KEY_UP) {
	          _this.value = this.value;
	          _this.parse();
	        }
	      });

	      // Hide when click out
	      document.addEventListener('click', function (e) {
	        var target = e.target;

	        if (!target.classList.contains('autocomplete-results-container') || !target.classList.contains('autocomplete-item')) {
	          _this2.hideResults();
	          _this2.hasResults = false;
	        }
	      });

	      document.addEventListener('keydown', function (e) {
	        if (e.keyCode === KEY_DEL && _this2.input != document.activeElement) {
	          e.preventDefault();
	        }
	      });

	      // Focus list element
	      document.addEventListener('keyup', function (e) {
	        e.preventDefault();
	        if (_this2.hasResults) {
	          switch (e.keyCode) {
	            case KEY_DOWN:
	              _this2.focusNextResult();
	              break;
	            case KEY_UP:
	              _this2.focusPreviousResult();
	              break;
	            case KEY_ENTER:
	              _this2.updateValue(document.querySelector('.autocomplete-item--focus').innerText);
	              _this2.hideResults();
	              break;
	            case KEY_DEL:
	              // this.input.value = this.input.value.slice(0, this.input.value.length - 1);
	              _this2.input.focus();
	              _this2.hideResults();
	              break;
	          }
	        }
	      });
	    }
	  }, {
	    key: 'createResultsContainer',
	    value: function createResultsContainer() {
	      var _this3 = this;

	      this.input.parentNode.insertBefore(this.createResultsDiv(), this.input.nextSibling);
	      var containers = document.querySelectorAll('.autocomplete-results-container');

	      [].forEach.call(containers, function (container) {
	        container.addEventListener('click', function (e) {
	          var item = e.target;

	          if (!item.classList.contains('autocomplete-item--no-result')) {
	            _this3.updateValue(item.getAttribute('data-autocomplete-value'));
	            _this3.hideResults();
	          }
	        });
	      });
	    }
	  }, {
	    key: 'createResultsDiv',
	    value: function createResultsDiv() {
	      var div = document.createElement('div');
	      div.className = 'autocomplete-results-container';

	      this.resultsContainer = div;
	      return div;
	    }
	  }, {
	    key: 'parse',
	    value: function parse() {
	      var _this4 = this;

	      if (this.value) {
	        if (this.xhr) {
	          if (this.xhrTimeout) {
	            clearTimeout(this.xhrTimeout);
	          }
	          this.xhrTimeout = setTimeout(function () {
	            _this4.parseURL();
	            _this4.xhrTimeout = null;
	          }, this.delay);
	        } else {
	          this.parseArray();
	        }
	      } else {
	        this.hideResults();
	      }
	    }
	  }, {
	    key: 'parseArray',
	    value: function parseArray() {
	      var data = this.data;
	      var value = this.value.toLowerCase();

	      this.results = data.filter(function (el) {
	        return el.toLowerCase().includes(value);
	      }).slice(0, this.maxResult);
	      this.hasResults = this.results.length > 0;
	      this.updateResults();
	    }
	  }, {
	    key: 'parseURL',
	    value: function parseURL() {
	      var _this5 = this;

	      var xhr = new XMLHttpRequest();
	      var method = this.xhr.method;
	      var url = "";

	      if (method === 'GET') {
	        url = this.xhr.url + '?' + this.xhr.key + '=' + this.value;
	      } else {
	        url = this.xhr.url;
	      }

	      xhr.open(method, url, true);

	      xhr.onreadystatechange = function (event) {
	        if (xhr.readyState == 4) {
	          if (xhr.status == 200) {
	            var data = JSON.parse(xhr.response);
	            _this5.hasResults = data.length > 0;
	            // this.callback.call(this, data);
	            _this5.results = data;
	            _this5.updateResults();
	          } else {
	            console.error('Error from the server');
	          }
	        }
	      };

	      xhr.send(method === "POST" ? this.xhr.key + '=' + this.value : null);
	    }
	  }, {
	    key: 'updateResults',
	    value: function updateResults() {
	      var _this6 = this;

	      this.clearResults();

	      if (this.results.length) {
	        this.results.forEach(function (result) {
	          if (_this6.render.renderItem) {
	            _this6.resultsContainer.insertAdjacentHTML('beforeend', _this6.render.renderItem(result));
	          } else {
	            var div = document.createElement('div');
	            div.className = 'autocomplete-item';
	            div.innerHTML = result;
	            div.setAttribute('data-autocomplete-value', result);

	            _this6.resultsContainer.appendChild(div);
	          }
	        });
	      } else {
	        var div = document.createElement('div');
	        div.className = 'autocomplete-item autocomplete-item--no-result';
	        div.innerHTML = 'No results';

	        this.resultsContainer.appendChild(div);
	      }

	      this.showResults();
	    }
	  }, {
	    key: 'updateValue',
	    value: function updateValue(value) {
	      this.input.value = value;
	      this.input.focus();
	    }
	  }, {
	    key: 'clearResults',
	    value: function clearResults() {
	      this.resultsContainer.innerHTML = "";
	    }
	  }, {
	    key: 'hideResults',
	    value: function hideResults() {
	      this.resultsContainer.classList.remove('autocomplete--visible');
	    }
	  }, {
	    key: 'showResults',
	    value: function showResults() {
	      this.resultsContainer.classList.add('autocomplete--visible');
	    }
	  }, {
	    key: 'focusPreviousResult',
	    value: function focusPreviousResult() {
	      var focusItem = document.querySelector('.autocomplete--visible .autocomplete-item--focus');
	      var items = document.querySelectorAll('.autocomplete--visible .autocomplete-item');
	      var nextItem = null;

	      if (focusItem) {
	        nextItem = focusItem.previousElementSibling ? focusItem.previousElementSibling : items[items.length - 1];
	      } else {
	        nextItem = items[items.length - 1];
	      }

	      [].forEach.call(items, function (item) {
	        item.classList.remove('autocomplete-item--focus');
	      });

	      nextItem.classList.add('autocomplete-item--focus');
	    }
	  }, {
	    key: 'focusNextResult',
	    value: function focusNextResult() {
	      this.input.blur();
	      var focusItem = document.querySelector('.autocomplete--visible .autocomplete-item--focus');
	      var items = document.querySelectorAll('.autocomplete--visible .autocomplete-item');
	      var nextItem = null;

	      if (focusItem) {
	        nextItem = focusItem.nextElementSibling ? focusItem.nextElementSibling : items[0];
	      } else {
	        nextItem = items[0];
	      }

	      [].forEach.call(items, function (item) {
	        item.classList.remove('autocomplete-item--focus');
	      });

	      nextItem.classList.add('autocomplete-item--focus');
	    }
	  }]);

	  return Autocomplete;
	})();

	module.exports = Autocomplete;

/***/ }
/******/ ]);