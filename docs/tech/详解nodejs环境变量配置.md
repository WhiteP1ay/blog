# 详解 Nodejs 环境变量配置

## 什么是环境变量？

[环境变量](https://zh.wikipedia.org/wiki/环境变量) 是一个动态命名的值，可以影响计算机上进程的行为方式。

简单来说，环境变量通常用来确保应用程序在不同环境中（如开发、测试、生产）表现不同的行为。

环境变量基本保存以下几种数据

- 接口服务地址
- 服务端口
- 当前环境
- 数据库相关配置
- 一些敏感数据 如 密钥、token 等

还是有点抽象？让我举个例子：

想象一下，你在开发一个项目，该项目需要连接数据库，而数据库的地址、端口、用户名、密码等配置信息，在不同的环境（如开发、测试、生产）中是不同的。所以，你不能在代码中直接写死这些配置信息，而是需要通过环境变量来动态设置。

环境变量通常被定义在 `*.env` 文件中，保存在项目根目录下。

如果环境变量比较多，也通常放在 `config` 目录或者 `env` 目录下。

`.env` 文件的缺点是可读性相对差一点、缺少代码高亮和嵌套关系。

如果环境变量很复杂，更推荐使用 yml 或 json 文件。

## 常见的 `process.env.NODE_ENV` 到底是个啥

`process.env` 是 Node.js 中的环境变量对象，我们添加的环境变量最终都会追加到该对象中。

而`NODE_ENV` 并不是 Node.js 官方定义的环境变量，它只是由社区约定俗成的一个实践。

所以你完全可以不使用 `NODE_ENV`，而使用其他你喜欢的变量名。

为了方便，下文继续使用 `NODE_ENV` 作为环境变量名。

## 项目怎么知道当前处于什么环境？

一般启动项目的时候，会指定当前运行的环境。比如

```bash
$ export NODE_ENV=production
$ node my-app.js
```

此时，`process.env.NODE_ENV` 的值就是 `production`。

> 这个脚本在 windows 上执行会报错，因为 windows 不支持 `export` 命令。

为了让项目在不同操作系统上都能正常运行，通常我们会使用 `cross-env` 来设置环境变量。

```bash
$ npx cross-env NODE_ENV=production node my-app.js
```

理论上讲到这里，就已经可以愉快的设置环境变量了。但把环境变量全都写在命令行里肯定是不好维护的。我们更想把不同环境的值定义在不同文件中。

## 项目怎么知道该读取哪个配置文件？

环境变量分散在不同的配置文件中，比如 `dev.env` 和 `prod.env` 文件分别对应了开发环境和生产环境。

那项目怎么知道该读取哪个配置文件呢？

常见的解决方案是 [dotenv](https://www.npmjs.com/package/dotenv) 和 [node-config](https://www.npmjs.com/package/config)

## 前端的额外需求

在前端工程领域，不仅要读取环境变量，还要在构建时将环境变量注入到静态资源里。

以 webpack 举例。webpack 在构建时通过 [DefinePlugin](https://webpack.docschina.org/plugins/define-plugin/) 将使用到的环境变量字符串替换成 webpack 配置文件中的值。

```js
//配置时
new webpack.DefinePlugin({
  PRODUCTION: JSON.stringify(true),
  VERSION: JSON.stringify("5fa3b9"),
  BROWSER_SUPPORTS_HTML5: true,
  TWO: "1+1",
  "typeof window": JSON.stringify("object"),
  "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
});

//使用时
console.log("Running App version " + VERSION);
```

把环境变量写死到 webpack 配置文件中，可能不是个好的解决方案。

所以，就会用到[dotenv-webpack](https://www.npmjs.com/package/dotenv-webpack) 插件，该插件本质就是 dotenv + DefinePlugin。

`dotenv-webpack`插件初始化时可以指定从哪个路径来读取配置项。

```js
const dotenv = require("dotenv-webpack");
const { resolve } = require("path");

//...some config...
plugins: [
  new dotenv({
    path: resolve("env", process.env.NODE_ENV + ".env"),
  }),
];
```

### dotenv 基本介绍

dotenv 提供简单方便读取.env 文件的方法。

```js
require("dotenv").config();
console.log(process.env);
```

### node-config 基本介绍

node-config 允许读取 json/yaml 格式的文件，解决了.env 文件缺少代码高亮、不容易处理嵌套关系的问题。

node-config 默认仅支持 json 文件，也可以通过安装其他包来支持 yaml。

它的功能更强大，支持配置文件合并，按层级读取配置文件等。具体示例如下：

假设项目根目录下的 config 文件夹下有个 default.json

```json
{
  // Customer module configs
  "Customer": {
    "dbConfig": {
      "host": "localhost",
      "port": 5984,
      "dbName": "customers"
    },
    "credit": {
      "initialLimit": 100,
      // Set low for development
      "initialDays": 1
    }
  }
}
```

和 production.json 文件

```json
{
  "Customer": {
    "dbConfig": {
      "host": "production-db.example.com"
    }
  }
}
```

你可以在项目代码中这样使用配置文件。config 提供了像 `get` 和 `has` 这样的方法来获取配置文件中的值。

```js
const config = require("config");
//...
const dbConfig = config.get("Customer.dbConfig");
db.connect(dbConfig, ...);

if (config.has('optionalFeature.detail')) {
  const detail = config.get('optionalFeature.detail');
  //...
}
```

如果启动项目时，指定环境变量，那么配置文件还会合并。

```bash
$ export NODE_ENV=production
$ node my-app.js
```

`port` 和 `dbname` 会从 `default.json` 中获取，而 host 将会被 `production.json` 覆盖。

（因为 production.json 中没有定义`Customer.dbConfig.port`和`Customer.dbconfig.dbname`）

## 扩展

一个正式项目在启动时可能需要一些列操作。这时候你可能想：如果我把繁琐的操作写进一个 shell 脚本，然后启动项目时，直接执行这个脚本不就好了。这时候你可能需要用到[scripty](https://www.npmjs.com/package/scripty) 这个包。scripty 允许你 `npm run xxx` 时，执行一个 shell 脚本。

功能类似的还有 [npm-run-all](https://www.npmjs.com/package/npm-run-all)，它可以同时执行多个 npm 脚本，这在 `monorepo` 架构的项目中很有用。

## 总结

环境变量是项目中非常重要的一部分，它可以帮助我们管理不同环境下的配置。

- 在 Node.js 中，我们可以使用 `process.env` 来读取运行环境上下文中的环境变量。
- 社区提供了`dotenv`、`node-config`等工具，方便我们读取配置文件。
- 前端项目在构建时，需要将环境变量注入到静态资源里。
