# npm发包丢文件的问题

## 问题描述

我在给组件库发包的时候发现Icon组件丢失了,没有发布出去.

## 解决方法

去问ai

ai让我检查gitignore/npmignore文件

> 1. ###.gitignore 文件###：检查你的项目根目录中是否有 .gitignore 文件。如果有，确保它没有忽略 components/Icon 目录。
> 2. ###.npmignore 文件###：创建一个名为 .npmignore 的文件（如果没有的话），并确保它不包含对 components/Icon 的忽略规则。
> 3. ###package.json 中的 files 字段###：检查 package.json 文件中的 "files" 字段。如果你指定了要包含的文件列表，确保 components/Icon 被包含其中。

果然,

gitignore包含了Icon

## 后记

推荐一个[gitignore生成工具](https://www.toptal.com/developers/gitignore/)

然后我基于该工具生成了[一份gitignore文件](https://www.toptal.com/developers/gitignore/api/macos,visualstudiocode,vue,node,storybookjs)

通过url不难看出我的关键词是: macos,vscode,vue,node,storybook

但经过这个问题,很明显: 这个工具不能无脑用,否则会有意外的Ï丢文件的情况

