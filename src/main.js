import count from "./js/count";
import sum from "./js/sum"

// 引入 Css 资源，Webpack才会对其打包
import "./css/iconfont.css"
import "./css/index.css"
import "./less/index.less"
import "./sass/index.sass"
import "./sass/index.scss"
import "./stylus/index.styl"
// import { mul } from "./js/math"

const result = count(2, 1)
console.log(result);
console.log(sum(1, 2, 3, 4, 5));
document.getElementById("btn").onclick = function () {
    // eslint会对动态导入语法报错，需要修改eslint配置文件
    // webpackChunkName: "math"：这是webpack动态导入模块命名的方式，也叫魔法命名
    // "math"将来就会作为[name]的值显示。
    import(/* webpackChunkName: "math" */ "./js/math").then(({mul}) => {
        console.log(mul(3, 3));
    })
}

// 判断是否支持热模块替换功能，因为低版本的浏览器可能不支持
if (module.hot) {
    // 支持，则重新对文件进行accept接收
    // 一旦接收文件发生变化，webpack就会只编译打包发生变化的文件
    module.hot.accept("./js/count");
    module.hot.accept("./js/sum");
}
