# browserlist
[github](https://github.com/browserslist/browserslist)

用于指定你的项目支持的目标浏览器和其版本范围，可以指导babel/postcss-preset-env等工具将源代码编译到该配置的目标浏览器可以运行的代码。

在vscode打断点时很有用：在开发环境把browserlist调成 ###last 2 Chrome versions### ，避免使用新语法时打断点，跳到意外的地方。