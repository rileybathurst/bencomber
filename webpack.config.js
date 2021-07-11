const autoprefixer = require("autoprefixer");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = [
  {
    entry: ["./src/app.scss", "./src/app.js"],
    output: {
      filename: "[name]bundle.js",
      path: path.resolve(__dirname, "dist"),
      clean: true,
    },
    devtool: "inline-source-map",
    devServer: {
      contentBase: "./dist",
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: "Ben Comber",
      }),
    ],
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "bundle.css",
              },
            },
            { loader: "extract-loader" },
            { loader: "css-loader" },
            {
              loader: "postcss-loader",
              options: {
                plugins: () => [autoprefixer()],
              },
            },
            {
              loader: "sass-loader",
              options: {
                includePaths: ["./node_modules"],
              },
            },
          ],
        },
        {
          test: /\.js$/,
          loader: "babel-loader",
          query: {
            presets: ["env"],
          },
        },
      ],
    },
  },
];
