# npm发包丢文件的问题

### 问题描述

我在给组件库发包的时候发现Icon组件丢失了,没有发布出去.

### 解决方法

去问ai,ai让我检查gitignore/npmignore文件

果然,gitignore包含了Icon

### 后记

推荐一个[gitignore生成工具](https://www.toptal.com/developers/gitignore/)

然后我基于该工具生成了[一份gitignore文件](https://www.toptal.com/developers/gitignore/api/macos,visualstudiocode,vue,node,storybookjs)

通过url不难看出我的关键词是: macos,vscode,vue,node,storybook

但经过这个问题,很明显: 这个工具不能无脑用,否则会有意外的Ï丢文件的情况

