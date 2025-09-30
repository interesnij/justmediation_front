const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    module: {
        rules: [
            {
                test: /\.mp3$/,
                exclude: /node_modules/,
                type: 'asset/resource',
                generator: {
                  filename: 'sounds/[name][ext][query]'
                }
              },
        ]
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "./static" }
            ],
        }),
    ]
}