const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    // entry: './src/main.js', // 只有一个入口文件，单入口
    entry: {
        // 有多个入口文件，多入口
        // 同时从这两个入口开始 打包整个项目
        app: "./src/app.js",
        main: "./src/main.js"
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        // webpack的命名方式，[name]以`entry`中的名子（"app","main"），命名打包输出的文件名
        filename: "[name].js",
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "public/index.html"),
        }),
    ],
    mode: "production",
}
