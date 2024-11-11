# 记安卓scale兼容问题

## 问题描述
scale在安卓设备上不生效。

## 解决过程

```css
scale: .7
```
这么写不规范,导致不生效
## 结论
改用标准写法
```css
transform: scale(.7)
```