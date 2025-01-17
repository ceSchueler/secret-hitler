const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractSass = new ExtractTextPlugin({
	filename: '../styles/style-main.css',
	disable: process.env.NODE_ENV === 'development'
});
const Dotenv = require('dotenv-webpack');

process.env.NODE_ENV = 'production';

module.exports = {
	entry: './src/frontend-scripts/game-app.js',
	output: {
		filename: `bundle.js`,
		path: path.resolve(__dirname, '../public/scripts')
	},
	plugins: [
		extractSass,
		new Dotenv({
			path: path.resolve(__dirname, '..', '.env')
		})
	],
	optimization: {
		minimizer: [
			new UglifyJSPlugin({
				parallel: true,
				uglifyOptions: {
					mangle: false,
					keep_classnames: true,
					keep_fnames: true
				}
			})
		]
	},
	devtool: 'cheap-module-source-map',
	module: {
		rules: [
			{
				test: /\.(html)$/,
				use: {
					loader: 'html-loader',
					options: {
						attrs: [':data-src']
					}
				}
			},
			{
				test: /\.(png|svg|jpg|gif)$/,
				use: {
					loader: 'file-loader',
					options: {
						useRelativePath: true
					}
				}
			},
			{
				test: /\.(js|jsx)$/,
				use: ['babel-loader'],
				exclude: /node_modules/
			},
			{
				test: /\.s?css$/,
				use: extractSass.extract({
					use: [
						{
							loader: 'css-loader',
							options: { minimize: true }
						},
						{
							loader: 'sass-loader'
						}
					],
					fallback: 'style-loader'
				})
			}
		]
	},
	resolve: {
		alias: {
			'react-dom$': 'react-dom/profiling',
			'scheduler/tracing': 'scheduler/tracing-profiling'
		}
	}
};
