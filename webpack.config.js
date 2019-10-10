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
    new CopyPlugin([{ from: './src/img', to: "img" }])
  ]
};

if (argv.smoke)
{
  module.exports.plugins.push(new CopyPlugin([{from: './tests/smoke'}]));
}
if (argv.puppeteer)
{
  module.exports.plugins.push(new CopyPlugin([{flatten: true, from: './tests/puppeteer/**/*.html', to: 'puppeteer'}]));
}
if (components.includes("pm-tab-panel"))
{
  module.exports.plugins.push(new CopyPlugin([{from: './src/components/pm-tab-panel/pm-tab-panel.css', to: "css"}]));
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
                         `./src/components/${component}/${component}.js`);
  module.exports.output.filename = "src/components.js";
}
else
{
  module.exports.entry = components.reduce((acc, component) =>
  {
    acc[component] = `./src/components/${component}/${component}.js`;
    return acc;
  }, {});
  module.exports.output.filename = "[name]/[name].js";
}
