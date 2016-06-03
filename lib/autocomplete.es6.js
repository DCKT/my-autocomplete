/**
 * Autocomplete class.
 * @class Autocomplete
 */
const KEY_DOWN  = 40;
const KEY_UP    = 38;
const KEY_ENTER = 13;
const KEY_DEL   = 8;

class Autocomplete {

 /**
 * Represents an Autocomplete instance.
 * @constructs Autocomplete
 * @param {Object} options - Options to configure the plugin
 * @param {string} options.input - Selector of the input to bind
 * @param {Array} [options.data] - Data to use
 */
  constructor(options) {
    this.input      = document.querySelector(options.input);
    this.data       = options.data;
    this.xhr        = options.xhr;
    this.delay      = options.delay || 500;
    this.maxResult  = options.maxResult || 5;
    this.callback   = options.callback;
    this.hasResults = false;
    this.bindEvents();
    this.createResultsContainer();
  }

  /**
   * @type {function}
   */
  bindEvents() {
    var _this = this;

    this.input.addEventListener('keyup', function(e) {
      if (e.keyCode !== KEY_DOWN && e.keyCode !== KEY_UP) {
        _this.value = this.value;
        _this.parse();
      }
    });

    // Hide when click out
    document.addEventListener('click', e => {
      var target = e.target;

      if (!target.classList.contains('autocomplete-results-container') ||
        !target.classList.contains('autocomplete-item')) {
        this.hideResults();
      }
    })

    document.addEventListener('keydown', e => {
      if (e.keyCode === KEY_DEL && this.input != document.activeElement) {
        e.preventDefault();
      }
    });

    // Focus list element
    document.addEventListener('keyup', e => {
      e.preventDefault();
      if (this.hasResults) {
        switch (e.keyCode) {
          case KEY_DOWN:
            this.focusNextResult();
            break;
          case KEY_UP:
            this.focusPreviousResult();
            break;
          case KEY_ENTER:
            this.updateValue(document.querySelector('.autocomplete-item--focus').innerText);
            this.hideResults();
            break;
          case KEY_DEL:
            // this.input.value = this.input.value.slice(0, this.input.value.length - 1);
            this.input.focus();
            this.hideResults();
            break;
        }
      }
    });
  }

  createResultsContainer() {
    this.input.parentNode.insertBefore(this.createResultsDiv(), this.input.nextSibling);
    var containers = document.querySelectorAll('.autocomplete-results-container');

    [].forEach.call(containers, container => {
      container.addEventListener('click', e => {
        var item = e.target;
        this.updateValue(item.innerText);
        this.hideResults();
      });
    });
  }

  createResultsDiv() {
    var div = document.createElement('div');
    div.className = 'autocomplete-results-container';

    this.resultsContainer = div;
    return div;
  }

  parse() {

    if (this.value) {
      if (this.xhr) {
        if (this.xhrTimeout) {
          clearTimeout(this.xhrTimeout);
        }
        this.xhrTimeout = setTimeout(() => {
          this.parseURL();
          this.xhrTimeout = null;
        }, this.delay);
      }
      else {
        this.parseArray();
      }
    }
    else {
      this.hideResults();
    }
  }

  parseArray() {
    var data  = this.data;
    var value = this.value.toLowerCase();

    this.results = data.filter(el => el.toLowerCase().includes(value)).slice(0, this.maxResult);
    this.hasResults = this.results.length > 0;
    this.updateResults();
  }

  parseURL() {
    var xhr    = new XMLHttpRequest();
    var url    = "";
    var method = this.xhr.method;

    if (method === 'GET') {
      url = `${this.xhr.url}?${this.xhr.key}=${this.value}`;
    }
    else {
      url = this.xhr.url;
    }

    xhr.open(method, url, true);

    xhr.onreadystatechange = (event) => {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          var data = JSON.parse(xhr.response);
          this.hasResults = data.length > 0;
          this.callback.call(this, data);
        }
        else {
          console.error('Error from the server');
        }
      }
    };

    xhr.send(method === "POST" ? `${this.xhr.key}=${this.value}` : null);
  }

  updateResults() {
    this.clearResults();

    if (this.results.length) {
      this.results.forEach(result => {
        var div = document.createElement('div');
        div.className = 'autocomplete-item';
        div.innerHTML = result;

        this.resultsContainer.appendChild(div);
      });

      this.showResults();
    }
    else {
      this.hideResults();
    }
  }

  updateValue(value) {
    this.input.value = value;
    this.input.focus();
  }

  clearResults() {
    this.resultsContainer.innerHTML = "";
  }

  hideResults() {
    this.resultsContainer.classList.remove('autocomplete--visible');
  }

  showResults() {
    this.resultsContainer.classList.add('autocomplete--visible');
  }

  focusPreviousResult() {
    var focusItem = document.querySelector('.autocomplete--visible .autocomplete-item--focus');
    var items     = document.querySelectorAll('.autocomplete--visible .autocomplete-item');
    var nextItem  = null;

    if (focusItem) {
      nextItem = focusItem.previousSibling ? focusItem.previousSibling : items[items.length - 1];
    }
    else {
      nextItem = items[items.length - 1];
    }


    [].forEach.call(items, item => {
      item.classList.remove('autocomplete-item--focus');
    });

    nextItem.classList.add('autocomplete-item--focus');
  }

  focusNextResult() {
    this.input.blur();
    var focusItem = document.querySelector('.autocomplete--visible .autocomplete-item--focus');
    var items     = document.querySelectorAll('.autocomplete--visible .autocomplete-item');
    var nextItem  = null;

    if (focusItem) {
      nextItem = focusItem.nextSibling ? focusItem.nextSibling : items[0];
    }
    else {
      nextItem = items[0];
    }


    [].forEach.call(items, item => {
      item.classList.remove('autocomplete-item--focus');
    });

    nextItem.classList.add('autocomplete-item--focus');
  }
}


module.exports = Autocomplete;
