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
    this.maxResult = options.maxResult ? options.maxResult : 5;
    this.callback = options.callback;
    this.hasResults = false;
    this.bindEvents();
    this.createResultsContainer();
  }

  _createClass(Autocomplete, [{
    key: 'bindEvents',

    /**
     * @type {function}
     */
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
        }
      });

      // Focus list element
      document.addEventListener('keyup', function (e) {
        if (_this2.hasResults) {
          if (e.keyCode === KEY_DOWN) {
            _this2.focusNextResult();
          } else if (e.keyCode === KEY_UP) {
            _this2.focusPreviousResult();
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
          _this3.updateValue(item.innerText);
          _this3.hideResults();
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
      if (this.value) {
        if (this.xhr) {
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
      this.hasResults = this.results.length > 0;
      this.updateResults();
    }
  }, {
    key: 'parseURL',
    value: function parseURL() {
      var _this4 = this;

      var xhr = new XMLHttpRequest();
      var url = '';
      var method = this.xhr.method;

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
            _this4.hasResults = data.length > 0;
            _this4.callback.call(_this4, data);
          } else {
            console.error('Error from the server');
          }
        }
      };

      xhr.send(method === 'POST' ? this.xhr.key + '=' + this.value : null);
    }
  }, {
    key: 'updateResults',
    value: function updateResults() {
      var _this5 = this;

      this.clearResults();

      this.results.forEach(function (result) {
        var div = document.createElement('div');
        div.className = 'autocomplete-item';
        div.innerHTML = result;

        _this5.resultsContainer.appendChild(div);
      });

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
      this.resultsContainer.innerHTML = '';
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
        nextItem = focusItem.previousSibling ? focusItem.previousSibling : items[items.length - 1];
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
        nextItem = focusItem.nextSibling ? focusItem.nextSibling : items[0];
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

