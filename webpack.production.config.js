const path = require('path');

module.exports = {
  mode: "production",
  entry: "./project/frontend/src",
  output: {
    path: path.resolve(__dirname, "project/frontend/static/frontend"), 
    filename: "main.js"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  }
};
