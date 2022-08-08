import count from "./js/count";
import sum from "./js/sum"

// 引入 Css 资源，Webpack才会对其打包
import "./css/iconfont.css"
import "./css/index.css"
import "./less/index.less"
import "./sass/index.sass"
import "./sass/index.scss"
import "./stylus/index.styl"
// 后面使用import()进行动态导入
// import { mul } from "./js/math"
// 手动全部引入core-js
// import "core-js";
// 手动按需引入 使用配置babel.config.js 自动按需引入
// import "core-js/es/promise";


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

new Promise((resolve) => {
    setTimeout(() => {
        resolve();
    }, 1000);
});

const arr = [1, 2, 3, 4];
console.log(arr.includes(1));

// 有兼容性问题，需判断是否支持
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            // 加载service-worker.js文件
            .register("/service-worker.js")
            .then((registration) => {
                // 加载成功输出
                console.log("SW registered: ", registration);
            })
            .catch((registrationError) => {
                // 加载失败回调
                console.log("SW registration failed: ", registrationError);
            });
    });
}
