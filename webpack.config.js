/** webpack配置文件*/
const path = require('path') // nodejs 的 path模块
module.exports = {
    // 入口, 要求使用相对路径
    entry: "./src/main.js",
    // 输出
    output: {
        // 文件的输出路径，要求使用绝对的路径
        // path.resolve()方法返回一个绝对路径
        // __dirname：模块化函数的参数，表示当前文件的文件夹目录
        path: path.resolve(__dirname, "dist"),
        // 文件名
        filename: "main.js"
    },
    // 加载器
    module: {
        rules: [
            // loader的配置
            {
                test: /\.css$/, // 用来匹配 .css 结尾的文件，只检测.css文件
                use: [
                    // 执行顺序：从右到左（从下到上）
                    // 顺序很重要，不可改变
                    "style-loader", // 将js中css通过创建style标签添加html文件中生效
                    "css-loader", // 将css资源编译成commonjs的模块到js中
                ],
            },
            {
                test: /\.less$/,
                // loader: 'xxx', // 只能使用1个loader
                use: [
                    // use 可使用多个loader
                    "style-loader",
                    "css-loader",
                    "less-loader", // 将less编译成css文件
                ],
            },
            {
                test: /\.s[ac]ss$/,
                use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader", // 将sass编译成css文件
                ],
            },
            {
                test: /\.styl$/,
                use: [
                    "style-loader",
                    "css-loader",
                    "stylus-loader", // 将stylus编译成css文件
                ],
            },
        ]
    },
    // 插件
    plugins: [],
    // 模式 开发模式
    mode: "development"
}
