var path = require('path');
var glob = require("glob");
var JavaScriptObfuscator = require('webpack-obfuscator');

module.exports = {
entry: glob.sync("./src/*.js"),
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
	new JavaScriptObfuscator ({
      rotateUnicodeArray: true
  })
]
};