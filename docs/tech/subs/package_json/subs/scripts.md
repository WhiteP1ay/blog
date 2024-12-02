# scripts
"scripts" 属性是一个包含在您的包的生命周期中在各个时刻运行的脚本命令的字典。键是生命周期事件，值是在该时刻运行的命令。

一般我们会把项目常用的脚本也写到该字段

## 6.1 前置、后置脚本

如果需要创建前置或后置脚本，只需创建另一个脚本，名称与之匹配，并在它们的开头添加 "pre" 或 "post"。

```
{
  "scripts": {
    "precompress": "{{ executes BEFORE the `compress` script }}",
    "compress": "{{ run command to compress files }}",
    "postcompress": "{{ executes AFTER `compress` script }}"
  }
}
```

在该例子中 npm run compress 将执行三个脚本。

## 6.2 生命周期脚本

- 常用的是 prepare，例如用于husky，在本地npm install时会运行（不带任何参数) ，用于注入git hooks。
- 还有###prepublish###、###prepublishOnly、prepack###等等，我用的不多，具体参考[npm Docs](https://docs.npmjs.com/cli/v10/using-npm/scripts)

## 6.3 bin

用于指定一些可执行文件的路径，使得这些文件可以在全局环境下直接运行。

```tsx
//create-react-app的bin
"bin": {
    "create-react-app": "./index.js"
 }
```