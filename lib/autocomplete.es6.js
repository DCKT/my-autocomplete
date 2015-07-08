/**
 * Autocomplete class.
 * @class Autocomplete
 */
class Autocomplete {

 /**
 * Represents an Autocomplete instance.
 * @constructs Autocomplete
 * @param {Object} options - Options to configure the plugin
 * @param {string} options.input - Selector of the input to bind
 * @param {Array} [options.data] - Data to use
 */
  constructor(options) {
    this.input     = document.querySelector(options.input);
    this.data      = options.data;
    this.xhr       = options.xhr;
    this.maxResult = options.maxResult ? options.maxResult : 5;
    this.callback  = options.callback;
    this.bindEvents();
  }

  /**
   * @type {function}
   */
  bindEvents() {
    var _this = this;

    this.input.addEventListener('keyup', function(e) {
      _this.value = this.value;

      _this.parse();
    });

    this.input.parentNode.insertBefore(this.createResultsDiv(), this.input.nextSibling);
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
        this.parseURL();
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

    this.results = data.filter(el => el.toLowerCase().indexOf(value) != -1).slice(0, this.maxResult);
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

    this.results.forEach(result => {
      var div = document.createElement('div');
      div.className = 'autocomplete-item';
      div.innerHTML = result;

      this.resultsContainer.appendChild(div);
    });

    this.showResults();
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
}


module.exports = Autocomplete;