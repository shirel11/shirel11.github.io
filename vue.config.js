const Dotenv = require('dotenv-webpack');

module.exports = {
  devServer: {
    port: 8081,
  },
  configureWebpack: {
    devtool: 'source-map',
    plugins: [
      new Dotenv()
    ]
  }
}
