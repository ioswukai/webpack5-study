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
        // [name]是webpack命名规则，使用chunk的name作为输出的文件名。
        // 什么是chunk？打包的资源就是chunk，输出出去叫bundle。
        // chunk的name是啥呢？ 比如： entry中xxx: "./src/xxx.js", name就是xxx。注意是前面的xxx，和文件名无关。
        // 为什么需要这样命名呢？如果还是之前写法main.js，那么打包生成两个js文件都会叫做main.js会发生覆盖。(实际上会直接报错的)
        filename: "[name].js",
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "public/index.html"),
        }),
    ],
    mode: "production",
}
