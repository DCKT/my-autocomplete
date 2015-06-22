var Autocomplete = require('../lib/autocomplete.es6.js');

var test = [
  "France",
  "Alaska",
  "Alabama",
  "New York"
];
document.addEventListener('DOMContentLoaded', function() {
  var search = new Autocomplete({
    input: '#search',
    xhr: {
      url: 'http://localhost:3000/results',
      method: 'GET',
      key: 'q'
    },
    callback: function(results) {
      this.clearResults();

      results.forEach((result) => {
        var resultDiv = document.createElement('div');
        resultDiv.innerHTML = `
          <div class="autocomplete-item">
            <strong>${result.title}</strong>
          </div>
        `;
        this.resultsContainer.appendChild(resultDiv);
      });

      this.showResults();
    }
  });


}, false);