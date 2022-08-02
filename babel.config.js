module.exports = {
  // 智能预设：能够编译ES6语法
  presets: [
    // 数组中的第二个元素，是对第一个元素的option选项配置
    [
      "@babel/preset-env",
      // 智能预设的选项配置，
      {
        useBuiltIns: "usage", // 按需加载，自动引入 core-js的polyfill
        // corejs: { // 指定corejs的信息
        //   version: "3", // 版本号是3，默认是2.0
        //   /**默认情况下，只注入ECMAScript稳定版功能的polyfill
        //    * 如果需要获得提案版功能的polyfill 可以设置proposals为true
        //    * */
        //   // proposals: true
        // }
        corejs: 3
      },
    ],
  ],
};
