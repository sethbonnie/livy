module.exports = {
  target: 'node',
  entry: './history.js',
  output: {
    path: __dirname,
    filename: 'index.js',
    libraryTarget: 'commonjs2',
  }, 
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        },
      },
    ],
  },
}