export default class Autocomplete {
  constructor(options) {
    this.input     = document.querySelector(options.input);
    this.data      = options.data;
    this.url       = options.url;
    this.maxResult = options.maxResult ? options.maxResult : 5;
    this.bind();
  }

  bind() {
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
      if (this.url) {
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
    var xhr = new XMLHttpRequest();

    xhr.open('GET', this.url, true);

    xhr.onreadystatechange = function(event) {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          var data = JSON.parse(xhr.response);
          console.log(data);
        }
        else {
          console.error('Error from the server');
        }
      }
    };

    xhr.send(null);


  }

  updateResults() {
    this.resultsContainer.innerHTML = "";

    this.results.forEach(result => {
      var div = document.createElement('div');
      div.className = 'autocomplete-item';
      div.innerHTML = result;

      this.resultsContainer.appendChild(div);
    });

    this.showResults();
  }

  hideResults() {
    this.resultsContainer.classList.remove('autocomplete--visible');
  }

  showResults() {
    this.resultsContainer.classList.add('autocomplete--visible');
  }
}
