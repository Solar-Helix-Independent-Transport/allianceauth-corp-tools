const path = require("path");
const webpack = require("webpack");
console.log(process.env.NODE_ENV);
console.log(process.env);
module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "./static/corptools"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.js|.jsx$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  optimization: {
    minimize: true,
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("development"),
      },
    }),
  ],
};