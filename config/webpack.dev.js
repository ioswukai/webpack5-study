/** 开发模式 webpack配置文件*/
const path = require('path') // nodejs 的 path模块
// 引入 ESLintPlugin插件构造函数
const ESLintPlugin = require("eslint-webpack-plugin");
// 引入 HtmlWebpackPlugin件构造函数
const HtmlWebpackPlugin = require("html-webpack-plugin");


module.exports = {
    // 入口, 要求使用相对路径
    entry: "./src/main.js",
    // 输出
    output: {
        // 文件的输出路径，要求使用绝对的路径
        // path.resolve()方法返回一个绝对路径
        // __dirname：模块化函数的参数，表示当前文件的文件夹目录
        // path: path.resolve(__dirname, "dist"),

        // 入口文件打包输出文件名
        filename: "static/js/main.js",

        // 自动清空上次打包的内容
        // 原理：在打包前，将整个path目录清空，再进行打包
        // clean: true

        // !!!:注意  当前启用devServer开发服务器后，webpack便会在内存中打包
        // 不会再在path下输出了，所以在devServer下，
        // path  clean 这些属性也就都不需要了
        // 但是filename是需要的，因为即使在内存中打包，最终打包文件也是需要有名字的
    },
    // 加载器
    module: {
        rules: [
            // loader的配置
            {
                // 每个文件只能被其中一个loader配置处理
                oneOf: [
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
                        // exclude: /node_modules/, // 排除node_modules下的文件，其他文件都处理
                        include: path.resolve(__dirname, "../src"), // 只处理src下的文件，其他文件不处理
                        loader: "babel-loader",
                        options: {
                            cacheDirectory: true, // 开启babel编译缓存
                            cacheCompression: false, // 缓存文件不要压缩，做压缩编译速度会慢，不压缩仅占用电脑磁盘空间，无所谓
                        },
                    },
                ]
            }
        ]
    },
    // 插件
    plugins: [
        // plugin的配置 通过new创建插件的实例
        new ESLintPlugin({
            // 检测哪些文件 检测./src目录下的文件
            context: path.resolve(__dirname, "../src"),
            exclude: "node_modules", // 默认值，不写也行
            cache: true, // 开启缓存
            // 缓存目录
            cacheLocation: path.resolve(
                __dirname,
                "../node_modules/.cache/.eslintcache"
            ),
        }),
        new HtmlWebpackPlugin({
            // 以 public/index.html 为模板创建文件
            // 新的html文件有两个特点：1. 内容和源文件一致 2. 自动引入打包生成的js等资源
            template: path.resolve(__dirname, "../public/index.html"),
        }),
    ],
    // 开发服务器: 不会输出资源，在内存中编译打包的
    devServer: {
        host: "localhost", // 启动服务器域名
        port: "3000", // 启动服务器端口号
        // 是否自动打开谷歌浏览器 open: boolean string object [string, object]
        open: {
            app: {
                // Linux
                // name: 'google-chrome',
                // window
                // name: 'chrome',
                // Mac
                name: 'Google Chrome'
            },
        },
        hot: true, // 开启HMR功能（只能用于开发环境，生产环境不需要了）
    },
    // 模式 开发模式
    mode: "development",
    // 启用SourceMap 仅映射行
    devtool: "cheap-module-source-map"

}
