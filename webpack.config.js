module.exports = {
  devtool: 'source-map',
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.js$/,
        loader: 'babel-loader',
                query: {
          plugins:[ 'transform-object-rest-spread' ]
        }
      }
    ]
  }
};
