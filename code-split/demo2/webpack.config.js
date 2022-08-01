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
    // 优化
    optimization: {
        // 代码分割配置
        splitChunks: {
            chunks: "all", // 对所有模块都进行分割
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
            cacheGroups: {
                // 组，哪些模块要打包到一个组
                // defaultVendors: { // 组名
                //   test: /[\\/]node_modules[\\/]/, // 需要打包到一起的模块
                //   priority: -10, // 权重（越大越高）
                //   reuseExistingChunk: true, // 如果当前 chunk 包含已从主 bundle 中拆分出的模块，则它将被重用，而不是生成新的模块
                // },
                /** 其他没有写的配置会使用上面的公共默认值 */
                default: {
                    /** 实际开发中无需设置，采用默认即可
                     *  我们定义的math文件体积太小了，所以要改打包的最小文件体积*/
                    minSize: 0,
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true,
                },
            },
        },
    },
    mode: "production",
}
