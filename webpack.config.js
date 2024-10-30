module.exports = {
	mode: 'production',
	entry: './assets/js/index.js',
	output: {
		filename: 'index.js'
	},
	module: {
		rules: [{
			test: /\.js$/,
			use: [{
				loader: 'babel-loader',
				options: {presets:['@babel/preset-env','@babel/react']}
			}]
		}]
	}
};
