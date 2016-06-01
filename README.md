# my-autocomplete

Create and custom your own autocomplete !

## Setup
Install with npm : `npm i my-autocomplete --save`
You can require the module and use Browserify.

## Example with XHR

```js
var Autocomplete = require('my-autocomplete');

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
```

Each instance of **Autocomplete** needs to be bound to an input. In this exemple, I'm using json-server with some fake data so you have to pass an xhr object who contain :

- the method
- the key

Both depends of the back-end so when you set the method to **GET** it will send a request like this : **http://localhost:3000/results?[key]={input_value}**
If not and you prefer use POST, it will be send with the same idea **[key]=input_value**.

Next you can add a callback who will be trigger at the end of the request (if  status is 200 actually). The __this__ reference is bind directly to your current instance context so you can use the several methods available like :

- clearResults : remove the innerHTML of the results container
- resultsContainer : HTMLElement of the results container


```html
<div>
  <label for="search">Search :</label>
  <input type="text" id="search" name="search">
</div>

<script src="autocomplete.js"></script>
```

## Example with dummy data
```js
var Autocomplete = require('my-autocomplete');

document.addEventListener('DOMContentLoaded', function() {
  var search = new Autocomplete({
    input: '#search',
    data: ['France', 'Test', 'London']
  });


}, false);
```

## Try and hack
If you want to try this plugin quickly this plugin, follow these steps :

- clone the repo
- `npm i`
- run `npm start`
- if you want to try ajax system don't forget to run the fake-server with `npm run fakedata` in another terminal
