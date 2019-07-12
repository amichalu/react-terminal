var path = require('path');

module.exports = {
    mode: 'production',
    //entry: './index.js', // ./src/index.js is default entry
    output: { path: path.join(__dirname, 'public'), filename: 'index.js' },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    }
            }
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, 'public'),
        compress: true,
        port: 9000
    }
};