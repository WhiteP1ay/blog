# type/main/module

## type

type 字段是用来指定你的项目是一个什么类型的包。默认是commonjs。备选值是module，表示这是一个ES module。

[commonjs和ESmodule的区别](https://es6.ruanyifeng.com/#docs/module-loader#ES6-%E6%A8%A1%E5%9D%97%E4%B8%8E-CommonJS-%E6%A8%A1%E5%9D%97%E7%9A%84%E5%B7%AE%E5%BC%82)

> Node.js 要求 ES6 模块采用`.mjs`后缀文件名。也就是说，只要脚本文件里面使用`import`或者`export`命令，那么就必须采用`.mjs`后缀名。Node.js 遇到`.mjs`文件，就认为它是 ES6 模块，默认启用严格模式，不必在每个模块文件顶部指定`"use strict"`。
> 
> 
> 如果不希望将后缀名改成`.mjs`，可以在项目的`package.json`文件中，指定`type`字段为`module`。
> 

## main

###`main`### 字段是一个模块标识符，是你程序的主要入口点。也就是说，如果你的包叫做 foo，用户安装了它，然后执行 ###`require("foo")`###，那么你main模块的导出对象将被返回。

如果没设置main，默认是 index.js

```json
// 假设存在一个包
// ./node_modules/es-module-package/package.json
{
	"type": "module",
	"main": "./src/index.js"
}

// ./my-app.mjs
import{ something }from'es-module-package';
// 实际加载的是 ./node_modules/es-module-package/src/index.js
```

## module

可以通过module字段明确ES module的入口文件。

```json
//vue的package.json 
"module": "dist/vue.runtime.esm-bundler.js",
```