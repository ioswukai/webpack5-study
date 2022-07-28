module.exports = {
  // 继承 Eslint 官方的规则
  extends: ["eslint:recommended"],
  // 在eslint检测时，哪些环境变量可以被使用，
  // 比如启用 node，console，window等全局变量
  env: {
    node: true, // 启用node中全局变量
    browser: true, // 启用浏览器中全局变量
  },
  parserOptions: {
    ecmaVersion: 6, // es6
    sourceType: "module", // es module
  },
  rules: {
    "no-var": 2, // 增加规则，不能使用 var 定义变量
  },
};
