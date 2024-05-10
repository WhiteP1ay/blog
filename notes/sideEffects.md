# sideEffects

用于描述副作用项。打包工具在做摇树优化的时候大体遵循如下逻辑：

1. 基于esModule的静态分析，找到没有引用的模块
2. 考虑该模块是否有副作用，如果没有副作用则删掉
3. 怎么知道有没有副作用呢？一方面webpack依赖的terser会去检测语句中的副作用（但js作为动态类型语言，不执行是分析不出结果的，所以语句层面的副作用分析能力有限，可以通过魔法注解 /**#**PURE****/ 来配合，旨在标明该声明无副作用），另一方面我们可以在sideEffects配置项中告诉打包工具哪些文件是有副作用的，即允许打包工具应该跳过对整个模块及其子树的分析。

实践中遇到的问题：

```tsx
//setFontSize.ts
import { detectDeviceType } from './deviceUtils';

(function flexible(window: Window, document: Document) {
	function resetFontSize() {
		const clientWidth = parseInt(
			document.documentElement.clientWidth.toString(),
			10,
		);
		let size = 0;
		// 使用 detectDeviceType 函数判断设备类型
		if (detectDeviceType() === 'desktop') {
			size = (document.documentElement.clientWidth / 1920) * 16;
			document.documentElement.style.fontSize = (size <= 14 ? 13 : size) + 'px';
		} else {
			size = clientWidth;
			const fontSize = (size / 750) * 16;
			document.documentElement.style.fontSize = fontSize + 'px';
		}
	}

	resetFontSize();
	window.addEventListener('pageshow', resetFontSize);
	window.addEventListener('resize', resetFontSize);
})(window, document);

//index.ts
import '@utils/resetFontSize';

```

看似index.ts有对resetFontSize的直接引用，但因为setFontSize没有export导出任何东西，所以该文件会被摇树优化掉。解决方法是

```json
//...package.json
"sideEffects": [
		"./src/utils/resetFontSize.ts",
]
```

类似的还有打包后样式文件的丢失。解决方法是

```json
//...package.json
"sideEffects": [
		"**/*.css"
		//如果是vue项目，组件内样式丢失，你需要指明哪个组件含有副作用
		"./src/ComponentWithStyle.vue"
]
```

另外，因为tree-shaking依赖于esModule的静态分析，所以在使用一些库的时候优先考虑es版本

比如使用***lodash-es***而不是***lodash。***