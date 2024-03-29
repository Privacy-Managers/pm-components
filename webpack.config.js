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
    new CopyPlugin({patterns: [{ from: './src/img', to: "img" }]})
  ]
};

if (process.env.SMOKE)
{
  module.exports.plugins.push(new CopyPlugin({patterns: [{from: './tests/smoke', to: "smoke"}]}));
}
if (process.env.PPTR)
{
  module.exports.plugins.push(new CopyPlugin({patterns: [{from: './tests/puppeteer/**/*.html', to: 'puppeteer/[name][ext]'}]}));
}
if (components.includes("pm-tab-panel"))
{
  module.exports.plugins.push(new CopyPlugin({patterns: [{from: './src/components/pm-tab-panel/pm-tab-panel.css', to: "css"}]}));
}
if (process.env.WATCH)
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
  module.exports.output.filename = "js/pm-components.js";
}
else
{
  module.exports.entry = components.reduce((acc, component) =>
  {
    acc[component] = `./src/components/${component}/${component}.js`;
    return acc;
  }, {});
  module.exports.output.filename = "js/[name]/[name].js";
}
if (argv.prod)
{
  module.exports.mode = "production";
  module.exports.optimization.minimize = true;
}
