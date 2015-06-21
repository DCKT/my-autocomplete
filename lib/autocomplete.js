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

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var Autocomplete = (function () {
	  function Autocomplete(options) {
	    _classCallCheck(this, Autocomplete);

	    this.input = document.querySelector(options.input);
	    this.data = options.data;
	    this.url = options.url;
	    this.maxResult = options.maxResult ? options.maxResult : 5;
	    this.bind();
	  }

	  _createClass(Autocomplete, [{
	    key: 'bind',
	    value: function bind() {
	      var _this = this;

	      this.input.addEventListener('keyup', function (e) {
	        _this.value = this.value;

	        _this.parse();
	      });

	      this.input.parentNode.insertBefore(this.createResultsDiv(), this.input.nextSibling);
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

	      if (this.value) {
	        if (this.url) {
	          this.parseURL();
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
	        return el.toLowerCase().indexOf(value) != -1;
	      }).slice(0, this.maxResult);
	      this.updateResults();
	    }
	  }, {
	    key: 'parseURL',
	    value: function parseURL() {
	      var xhr = new XMLHttpRequest();

	      xhr.open('GET', this.url, true);

	      xhr.onreadystatechange = function (event) {
	        if (xhr.readyState == 4) {
	          if (xhr.status == 200) {
	            var data = JSON.parse(xhr.response);
	            console.log(data);
	          } else {
	            console.error('Error from the server');
	          }
	        }
	      };

	      xhr.send(null);
	    }
	  }, {
	    key: 'updateResults',
	    value: function updateResults() {
	      var _this2 = this;

	      this.resultsContainer.innerHTML = '';

	      this.results.forEach(function (result) {
	        var div = document.createElement('div');
	        div.className = 'autocomplete-item';
	        div.innerHTML = result;

	        _this2.resultsContainer.appendChild(div);
	      });

	      this.showResults();
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
	  }]);

	  return Autocomplete;
	})();

	exports['default'] = Autocomplete;
	module.exports = exports['default'];

/***/ }
/******/ ]);