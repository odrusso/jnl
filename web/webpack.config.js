// eslint-disable-next-line no-undef
const path = require('path');
// eslint-disable-next-line no-undef
const HtmlWebPackPlugin = require('html-webpack-plugin');

// eslint-disable-next-line no-undef
module.exports = {
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js',
    },
    resolve: {
        extensions: [".jsx", ".js"],
        modules: [path.join(__dirname, 'src'), 'node_modules'],
        alias: {
            react: path.join(__dirname, 'node_modules', 'react'),
        },
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader',
                    },
                ],
            },
            {
                test: /\.ttf$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'fonts/'
                }
            }
        ],
    },
    devServer: {
        contentBase: './build',
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: './src/index.html',
            favicon: './src/favicon.svg'
        })
    ],
};