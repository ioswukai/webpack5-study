/** 生产模式 webpack配置文件*/
// nodejs 的 path模块
const path = require('path')
// nodejs核心模块，直接使用
const os = require("os");

// 引入 ESLintPlugin插件构造函数
const ESLintPlugin = require("eslint-webpack-plugin");
// 引入 HtmlWebpackPlugin件构造函数
const HtmlWebpackPlugin = require("html-webpack-plugin");
// 引入 MiniCssExtractPlugin插件构造函数
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// 引入 CssMinimizerPlugin插件构造函数
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
// 引入 内置的TerserWebpackPlugin插件构造函数
const TerserWebpackPlugin = require("terser-webpack-plugin");
// 引入 ImageMinimizerPlugin插件构造函数
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
// 引入 PreloadWebpackPlugin插件构造函数
const PreloadWebpackPlugin = require("@vue/preload-webpack-plugin");

// cpu核数
const threads = os.cpus().length;

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
        // filename: "static/js/main.js",
        // [name]不写死为main，这样将来改成多入口也是没问题的
        // filename: "static/js/[name].js",
        // 增加[contenthash:8]后缀，使用contenthash，取8位长度
        filename: "static/js/[name].[contenthash:8].js",
        // 其他文件打包输出文件名
        // chunkFilename: "static/js/[name].js",
        // 增加一个chunk后缀，便于区分谁是主文件，谁是其他的chunk文件
        // chunkFilename: "static/js/[name].chunk.js",
        // 增加[contenthash:8]后缀，使用contenthash，取8位长度
        chunkFilename: "static/js/[name].[contenthash:8].chunk.js",
        // 图片、字体等通过type:asset处理资源命名方式（注意用hash）
        assetModuleFilename: "static/media/[hash:10][ext][query]",
        // 自动清空上次打包的内容
        // 原理：在打包前，将整个path目录清空，再进行打包
        clean: true
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
                        // 通过output.assetModuleFilename做统一的处理
                        // generator: { // 修改打包输出资源的路径
                        //     // 输出图片名称
                        //     // 图片会有一个id，它会根据文件内容生成一个唯一的hash值, 目的是保证图片的名字不会冲突
                        //     // [hash:10] hash值取前10位，减小文件名长度，打包后可减小 几个字节
                        //     // [ext] 是文件扩展名，如果之前是.png，那么打包生成的文件就也是.png
                        //     // [query] 携带的参数，如果url地址写了想?xx=xxx的查询参数，那么该参数也会显示在文件名里
                        //     filename: "static/images/[hash:10][ext][query]",
                        // },
                    },
                    {
                        test: /\.(ttf|woff2?|map3|map4|avi)$/,
                        type: "asset/resource",
                        // 通过output.assetModuleFilename做统一的处理
                        // generator: {
                        //     // 输出名称
                        //     filename: "static/media/[hash:10][ext][query]",
                        // },
                    },
                    {
                        test: /\.js$/,
                        // exclude: /node_modules/, // 排除node_modules下的文件，其他文件都处理
                        include: path.resolve(__dirname, "../src"), // 只处理src下的文件，其他文件不处理
                        // loader: "babel-loader",
                        // options: {
                        //     cacheDirectory: true, // 开启babel编译缓存
                        //     cacheCompression: false, // 缓存文件不要压缩，做压缩编译速度会慢，不压缩仅占用电脑磁盘空间，无所谓
                        // },
                        use: [
                            {
                                loader: "thread-loader", // 开启多进程
                                options: {
                                    works: threads, // 进程数量
                                }
                            },
                            {
                                loader: "babel-loader",
                                options: {
                                    cacheDirectory: true, // 开启babel编译缓存
                                    cacheCompression: false, // 缓存文件不要压缩，做压缩编译速度会慢，不压缩仅占用电脑磁盘空间，无所谓
                                    plugins: ["@babel/plugin-transform-runtime"], // 减少代码体积
                                },
                            }
                        ],
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
            threads, // 开启多进程及进程数量
        }),
        new HtmlWebpackPlugin({
            // 以 public/index.html 为模板创建文件
            // 新的html文件有两个特点：1. 内容和源文件一致 2. 自动引入打包生成的js等资源
            template: path.resolve(__dirname, "../public/index.html"),
        }),
        new MiniCssExtractPlugin({
            // 输出文件的名称，默认把所有`css样式`打包成一个main.css文件输出
            // filename: "static/css/main.css",
            // 多入口打包，可能会存在多个css文件，所以使用[name]
            // filename: "static/css/[name].css",
            // 增加[contenthash:8]后缀，使用contenthash，取8位长度
            filename: "static/css/[name].[contenthash:8].css",
            // 如果动态导入的文件中有css，则也会生成css的chunk文件，所以需要配置chunkFilename
            // chunkFilename: "static/css/[name].chunk.css",
            // 增加[contenthash:8]后缀，使用contenthash，取8位长度
            chunkFilename: "static/css/[name].[contenthash:8].chunk.css",
        }),
        // css压缩 和 Terser的JS压缩，以及ImageMinimizerPlugin的图片压缩 可以放在optimization优化设置中也是一样的
        // new CssMinimizerPlugin(),
        // new TerserWebpackPlugin({
        //         parallel: threads, // 开启多进程和设置进程数量
        // }),
        // new ImageMinimizerPlugin({
        //     minimizer: {
        //         implementation: ImageMinimizerPlugin.imageminGenerate,
        //         options: {
        //             plugins: [
        //                 ["gifsicle", { interlaced: true }],
        //                 ["jpegtran", { progressive: true }],
        //                 ["optipng", { optimizationLevel: 5 }],
        //                 [
        //                     "svgo",
        //                     {
        //                         plugins: [
        //                             "preset-default",
        //                             "prefixIds",
        //                             {
        //                                 name: "sortAttrs",
        //                                 params: {
        //                                     xmlnsOrder: "alphabetical",
        //                                 },
        //                             },
        //                         ],
        //                     },
        //                 ],
        //             ],
        //         },
        //     },
        // }),
        new PreloadWebpackPlugin({
            // js采用preload的方式去加载
            // rel: "preload",
            /**
             * 在preload方式下，作为`script`标签的优先级去做
             * 如果希望优先级最高，可以作为`style`标签的优先级去做，
             * 如果是最高优先级，文件的解析可能会有问题
             * prefetch无此as属性
             * */
            // as: "script",
            rel: "prefetch",
        }),
    ],
    // 优化
    optimization: {
        // 压缩的操作
        minimizer: [
            // 压缩css
            new CssMinimizerPlugin(),
            // 压缩js
            new TerserWebpackPlugin({
                parallel: threads, // 开启多进程和设置进程数量
            }),
            // 压缩图片  下载压缩方式下不下来，要翻墙，因此注释掉插件的引入
            // new ImageMinimizerPlugin({
            //     minimizer: {
            //         implementation: ImageMinimizerPlugin.imageminGenerate,
            //         options: {
            //             plugins: [
            //                 ["gifsicle", { interlaced: true }],
            //                 ["jpegtran", { progressive: true }],
            //                 ["optipng", { optimizationLevel: 5 }],
            //                 [
            //                     "svgo",
            //                     {
            //                         plugins: [
            //                             "preset-default",
            //                             "prefixIds",
            //                             {
            //                                 name: "sortAttrs",
            //                                 params: {
            //                                     xmlnsOrder: "alphabetical",
            //                                 },
            //                             },
            //                         ],
            //                     },
            //                 ],
            //             ],
            //         },
            //     },
            // }),
        ],
        // 代码分割配置
        // splitChunks: {
        //     chunks: "all", // 对所有模块都进行分割
            // 以下是默认值
            // minSize: 20000, // 分割代码最小的大小 20kb
            // minRemainingSize: 0, // 类似于minSize，最后确保提取的文件大小不能为0
            // minChunks: 1, // 至少被引用的次数，满足条件（至少被引用1次以上）才会代码分割
            /** 按需加载时并行加载的文件的最大数量（页面同一时刻最多能请求加载30个文件），
             * 若超过30个则会被合并到其中的某些文件中，一旦分割到文件数达30个，便不会再
             * 抽取新的文件了，确保最大数量只能是30个*/
            // maxAsyncRequests: 30,
            // maxInitialRequests: 30, // 入口js文件最大并行请求数量
            /**超过50kb一定会单独打包, 因为体积太大了
             * （此时会忽略minRemainingSize、maxAsyncRequests、maxInitialRequests）*/
            // enforceSizeThreshold: 50000,
            /**以上配置属于所有组中的公共配置，下面组中未明确重写的配置，将沿用上面书写的配置*/
            // cacheGroups: { // 组，哪些模块要打包到一个组
            //   defaultVendors: { // 组名
            //     test: /[\\/]node_modules[\\/]/, // 需要打包到一起的模块
            //     priority: -10, // 权重（越大越高）
            //     reuseExistingChunk: true, // 如果当前 chunk 包含已从主 bundle 中拆分出的模块，则它将被重用，而不是生成新的模块
            //   },
            /** 其他没有写的配置会使用上面的公共默认值 */
            //   default: {
            /**这里的minChunks权重更大，会覆盖上面的公共配置（至少要引用两次，才会被打包进default组中）*/
            //     minChunks: 2,
            //     priority: -20,
            //     reuseExistingChunk: true,
            //   },
            // },
            // 修改配置
            // cacheGroups: {
                // 组，哪些模块要打包到一个组
                // defaultVendors: { // 组名
                //   test: /[\\/]node_modules[\\/]/, // 需要打包到一起的模块
                //   priority: -10, // 权重（越大越高）
                //   reuseExistingChunk: true, // 如果当前 chunk 包含已从主 bundle 中拆分出的模块，则它将被重用，而不是生成新的模块
                // },
        //         /** 其他没有写的配置会使用上面的公共默认值 */
        //         default: {
        //             /** 实际开发中无需设置，采用默认即可
        //              *  我们定义的math文件体积太小了，所以要改打包的最小文件体积*/
        //             minSize: 0,
        //             minChunks: 2,
        //             priority: -20,
        //             reuseExistingChunk: true,
        //         },
        //     },
        // },
        splitChunks: {
            chunks: "all", // 对所有模块都进行分割
            /** 其他的都有用默认值即可*/
        },
        // 提取runtime文件
        runtimeChunk: {
            // runtime文件命名规则  entrypoint入口文件， entrypoint.name入口文件的名称
            name: (entrypoint) => `runtime~${entrypoint.name}.js`,
        },
    },
    // 模式 开发模式
    mode: "production",
    // 启用SourceMap 映射 行和列，速度更慢
    devtool: "source-map"

}
