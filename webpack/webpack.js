const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const babel = require("@babel/core");

// console.log(bodyAst);
/** 
 * 分析文件最后应该得到一个文件的 
 * 1. 位置
 * 2. 依赖
 * 3. 源码
 * 即 { file, deps, code }
*/
function getMouleInfo(file) {
  // 读取文件
  const body = fs.readFileSync(file, 'utf-8');
  // 转换AST语法树
  const bodyAst = parser.parse(body, {
    sourceType: "module", //表示我们要解析的是ES模块
  })
  // 依赖收集
  const deps = {};

  traverse(bodyAst, {
    // 遍历ast中所有的imprt节点
    ImportDeclaration({ node }) {
      // 获取文件的目录路径
      const dirname = path.dirname(file);
      // 获取依赖文件的相对路径， 即webpack加载文件的路径
      const abspath = "./" + path.join(dirname, node.source.value);
      deps[node.source.value] = abspath;
    },
  })
  // console.log(deps);
  // ES6转成ES5
  const { code } = babel.transformFromAst(bodyAst, null, {
    presets: ["@babel/preset-env"],
  });
  return {
    file, deps, code
  }
}
// const info = getMouleInfo('./src/index.js');
// console.log(info);

/** 
 * 得到入口文件的依赖后，就要递归得到所有的依赖的模块
 * file => 相当于entry 
*/

function parseModules(file) {
  const entry = getMouleInfo(file);
  const temp = [entry];
  getDeps(temp, entry);
  // 这个时候就会发现循环引用，比如./src/minus.js
  // console.log(temp);
  // 去除循环引用
  const depsGraph = {};
  temp.forEach(mouleInfo => {
    depsGraph[mouleInfo.file] = {
      deps: mouleInfo.deps,
      code: mouleInfo.code
    }
  })
  // console.log('depsGraph======',depsGraph)
  return depsGraph;
}
/**
 * 递归获取依赖
 *
 * @param {*} temp 保存所有依赖
 * @param {*} {deps} 每个moudle的 依赖项
 */
function getDeps(temp, {deps}) {
  Object.keys(deps).forEach( key => {
    // 得到依赖模块的 code 和 deps 等信息
    const childInfo = getMouleInfo(deps[key]);
    temp.push(childInfo);
    // 比如入口依赖a ，得到a 依赖 b 继续递归 得到所有依赖
    getDeps(temp, childInfo);
  })
}

const allMouleInfo = parseModules('./src/index.js');
// console.log(allMouleInfo);



function bundle(file) {
  const depsGraph = JSON.stringify(parseModules(file));
  console.log(depsGraph);
  return `(function (graph) {
        function require(file) {
            function absRequire(relPath) {
                return require(graph[file].deps[relPath])
            }
            var exports = {};
            (function (require,exports,code) {
                eval(code)
            })(absRequire,exports,graph[file].code)
            return exports
        }
        require('${file}')
    })(${depsGraph})`;
}
const content = bundle("./src/index.js");

// console.log(content);

!fs.existsSync("./dist") && fs.mkdirSync("./dist");
fs.writeFileSync("./dist/bundle.js", content);