
module.exports = {
    entry: './src/main.js',
    output: {
        filename: "static/js/[name].js",
        chunkFilename: "static/js/[name].chunk.js",
        assetModuleFilename: "static/media/[hash:10][ext][query].js"
    },
    module: {
        rules: [
            // 处理css
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader', {
                    loader: "postcss-loader",
                    options: {
                        postcssOptions: {
                            plugins: ['postcss-preset-env']
                        }
                    }
                }]
            },
            // 处理图片
            // 处理js
        ]
    }
    // 处理html
}
