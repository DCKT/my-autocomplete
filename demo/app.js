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
    data: test
  });


}, false);