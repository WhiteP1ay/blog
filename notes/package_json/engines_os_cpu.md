---
id: engines&os&cpu
title: engines&os&cpu
---

# engines/os/cpu

engines用于指定node.js版本 , 如果是*就是不指定。

```json
{
	"engines": {
	"node": ">=0.10.3 <15"
	}
}
```

也可以通过该字段指定npm的版本（注意，这里不是指定包管理工具，指定包管理工具通常使用https://www.npmjs.com/package/only-allow来实现）

```json
{
	"engines": {
		"npm": "~1.0.20"
	}
}
```

 和engines相似的，还有cpu & os字段，分别用来约束cpu和操作系统

```json
{
	//! 表示不支持的cpu
	"cpu": ["x64", "ia32", "!mips"]
	"os": ["darwin", "linux", "!win32"]
}
```