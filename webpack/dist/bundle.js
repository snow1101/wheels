(function (graph) {
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
        require('./src/index.js')
    })({"./src/index.js":{"deps":{"./add.js":"./src/add.js","./minus.js":"./src/minus.js","./test.js":"./src/test.js"},"code":"\"use strict\";\n\nvar _add = _interopRequireDefault(require(\"./add.js\"));\n\nvar _minus = _interopRequireDefault(require(\"./minus.js\"));\n\nvar _test = _interopRequireDefault(require(\"./test.js\"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { \"default\": obj }; }\n\nvar test = (0, _add[\"default\"])(1, 2);\nvar test1 = (0, _minus[\"default\"])(10, _test[\"default\"]);\nconsole.log(test, test1);"},"./src/add.js":{"deps":{"./minus.js":"./src/minus.js"},"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports[\"default\"] = void 0;\n\nvar _minus = _interopRequireDefault(require(\"./minus.js\"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { \"default\": obj }; }\n\nvar add = function add(a, b) {\n  return a + b;\n};\n\nvar a = (0, _minus[\"default\"])(6, 2);\nconsole.log(a);\nvar _default = add;\nexports[\"default\"] = _default;"},"./src/minus.js":{"deps":{},"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports[\"default\"] = void 0;\n\nvar minus = function minus(a, b) {\n  return a - b;\n};\n\nvar _default = minus;\nexports[\"default\"] = _default;"},"./src/test.js":{"deps":{"./minus.js":"./src/minus.js"},"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports[\"default\"] = void 0;\n\nvar _minus = _interopRequireDefault(require(\"./minus.js\"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { \"default\": obj }; }\n\nvar test = (0, _minus[\"default\"])(5 - 3);\nvar _default = test;\nexports[\"default\"] = _default;"}})