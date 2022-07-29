/** 生产模式 webpack配置文件*/
const path = require('path') // nodejs 的 path模块
// 引入 ESLintPlugin插件构造函数
const ESLintPlugin = require("eslint-webpack-plugin");
// 引入 HtmlWebpackPlugin件构造函数
const HtmlWebpackPlugin = require("html-webpack-plugin");
// 引入 MiniCssExtractPlugin插件构造函数
const MiniCssExtractPlugin = require("mini-css-extract-plugin");


// 用来获取处理样式的loader
function getStyleLoader(pre) {
    return [
        MiniCssExtractPlugin.loader, // 提取css成单独文件
        "css-loader", // 将css资源编译成commonjs的模块到js中
        {
            loader: "postcss-loader",
            options: {
                postcssOptions: {
                    plugins: [
                        "postcss-preset-env", // 能解决大多数样式兼容性问题
                    ],
                },
            },
        },
        pre, // 如果pre未设置，则其为undefined，通过filter(Boolean)，可以过滤掉它
    ].filter(Boolean);
}


module.exports = {
    // 入口, 要求使用相对路径
    entry: "./src/main.js",
    // 输出
    output: {
        // 文件的输出路径，要求使用绝对的路径
        // path.resolve()方法返回一个绝对路径
        // __dirname：模块化函数的参数，表示当前文件的文件夹目录
        path: path.resolve(__dirname, "../dist"),
        // 入口文件打包输出文件名
        filename: "static/js/main.js",
        // 自动清空上次打包的内容
        // 原理：在打包前，将整个path目录清空，再进行打包
        clean: true
    },
    // 加载器
    module: {
        rules: [
            // loader的配置
            {
                test: /\.css$/, // 用来匹配 .css 结尾的文件，只检测.css文件
                // use: [
                //     // 执行顺序：从右到左（从下到上）
                //     // 顺序很重要，不可改变
                //     // "style-loader", // 将js中css通过创建style标签添加html文件中生效
                //     MiniCssExtractPlugin.loader, // 将Css提前为单独的文件，并使用link加载样式
                //     "css-loader", // 将css资源编译成commonjs的模块到js中
                //     {
                //         loader: "postcss-loader",
                //         options: {
                //             postcssOptions: {
                //                 plugins: [
                //                     "postcss-preset-env", // 能解决大多数样式兼容性问题
                //                 ]
                //             }
                //         }
                //     }
                // ],
                use: getStyleLoader(),

            },
            {
                test: /\.less$/,
                // loader: 'xxx', // 只能使用1个loader
                // use: [
                //     // use 可使用多个loader
                //     // "style-loader",
                //     MiniCssExtractPlugin.loader,
                //     "css-loader",
                //     "less-loader", // 将less编译成css文件
                // ],
                use: getStyleLoader("less-loader"),
            },
            {
                test: /\.s[ac]ss$/,
                // use: [
                //     // "style-loader",
                //     MiniCssExtractPlugin.loader,
                //     "css-loader",
                //     "sass-loader", // 将sass编译成css文件
                // ],
                use: getStyleLoader("sass-loader"),
            },
            {
                test: /\.styl$/,
                // use: [
                //     // "style-loader",
                //     MiniCssExtractPlugin.loader,
                //     "css-loader",
                //     "stylus-loader", // 将stylus编译成css文件
                // ],
                use: getStyleLoader("stylus-loader"),
            },
            {
                test: /\.(png|jpe?g|gif|webp|svg)$/,
                type: "asset",
                parser: {
                    dataUrlCondition: {
                        // 小于10kb的图片转base64
                        // 优点：减少请求数量  缺点：体积会更大
                        maxSize: 10 * 1024, // 10kb
                    },
                },
                generator: { // 修改打包输出资源的路径
                    // 输出图片名称
                    // 图片会有一个id，它会根据文件内容生成一个唯一的hash值, 目的是保证图片的名字不会冲突
                    // [hash:10] hash值取前10位，减小文件名长度，打包后可减小 几个字节
                    // [ext] 是文件扩展名，如果之前是.png，那么打包生成的文件就也是.png
                    // [query] 携带的参数，如果url地址写了想?xx=xxx的查询参数，那么该参数也会显示在文件名里
                    filename: "static/images/[hash:10][ext][query]",
                },
            },
            {
                test: /\.(ttf|woff2?|map3|map4|avi)$/,
                type: "asset/resource",
                generator: {
                    // 输出名称
                    filename: "static/media/[hash:10][ext][query]",
                },
            },
            {
                test: /\.js$/,
                exclude: /node_modules/, // 排除node_modules下的文件，其他文件都处理
                loader: "babel-loader",
            },
        ]
    },
    // 插件
    plugins: [
        // plugin的配置 通过new创建插件的实例
        new ESLintPlugin({
            // 检测哪些文件 检测./src目录下的文件
            context: path.resolve(__dirname, "../src"),
        }),
        new HtmlWebpackPlugin({
            // 以 public/index.html 为模板创建文件
            // 新的html文件有两个特点：1. 内容和源文件一致 2. 自动引入打包生成的js等资源
            template: path.resolve(__dirname, "../public/index.html"),
        }),
        new MiniCssExtractPlugin({
            // 输出文件的名称，默认把所有`css样式`打包成一个main.css文件输出
            filename: "static/css/main.css",
        }),
    ],
    // 模式 开发模式
    mode: "production"
}
