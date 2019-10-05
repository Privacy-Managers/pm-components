const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const argv = require("minimist")(process.argv.slice(2));
const components = argv.comp ? argv.comp : ["pm-table", "pm-dialog", "pm-tab-panel", "pm-button", "pm-toggle"];

module.exports =
{
  context: path.resolve(__dirname),
  output: {
    path: path.resolve('dist')
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
    new CopyPlugin([{ from: './components/img', to: "img" }])
  ]
};

if (argv.smoke)
{
  module.exports.plugins.push(new CopyPlugin([{from: './components/tests/smoke'}]));
}
if (argv.puppeteer)
{
  module.exports.plugins.push(new CopyPlugin([{flatten: true, from: './components/tests/puppeteer/**/*.html', to: 'puppeteer'}]));
}
if (components.includes("pm-tab-panel"))
{
  module.exports.plugins.push(new CopyPlugin([{from: './components/src/pm-tab-panel/pm-tab-panel.css', to: "pm-tab-panel"}]));
}
if (argv.watch)
{
  module.exports.watch = true;
}
if (argv.output)
{
  module.exports.output.path = path.resolve(argv.output);
}
// Entry and output
if (argv["single-bundle"])
{
  module.exports.entry = components.map((component) =>
                         `./components/src/${component}/${component}.js`);
  module.exports.output.filename = "components/components.js";
}
else
{
  module.exports.entry = components.reduce((acc, component) =>
  {
    acc[component] = `./components/src/${component}/${component}.js`;
    return acc;
  }, {});
  module.exports.output.filename = "[name]/[name].js";
}
