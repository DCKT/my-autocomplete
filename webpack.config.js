module.exports = {
  entry: {
    lib: ['./lib/autocomplete.es6.js'],
    demo: './demo/app.js',
  },
  output: {
    path: __dirname,
    filename: '[name]/autocomplete.bundle.js',
  },
  module: {
    loaders: [
      { test: /\.js$/,  exclude: /(node_modules|bower_components)/, loader: 'babel' },
    ],
  },
};
