const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const argv = require("minimist")(process.argv.slice(2));

module.exports =
{
  entry: {
    "pm-table": "./components/src/pm-table/pm-table.js",
    "pm-dialog": "./components/src/pm-dialog/pm-dialog.js",
    "pm-tab-panel": "./components/src/pm-tab-panel/pm-tab-panel.js",
    "pm-button": "./components/src/pm-button/pm-button.js",
    "pm-toggle": "./components/src/pm-toggle/pm-toggle.js"
  },
  output: {
    filename: '[name]/[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  optimization: {
    minimize: false
  },

  module: {
    rules: [
      // Regular css files
      {
        test: /\.css$/,
        use: 'raw-loader'
      },
      {
        test: /\.html$/,
        use: 'raw-loader'
      }
    ]
  },
  plugins: [
    new CopyPlugin([{ from: './components/img', to: "img" },
                    {from: './components/src/pm-tab-panel/pm-tab-panel.css', to: "pm-tab-panel"},
                    {flatten: true, from: './components/tests/puppeteer/**/*.html', to: 'puppeteer'}])
  ],
  devServer: {
    contentBase: path.join(__dirname, 'dist/'),
    compress: true,
    port: 9000
  }
};

if (argv.smoke)
{
  module.exports.plugins.push(new CopyPlugin([{from: './components/tests/smoke'}]));
}
