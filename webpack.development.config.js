const production = require('./webpack.production.config')

module.exports = Object.assign({}, production, {
  mode: "development",
  watch: true,
});
