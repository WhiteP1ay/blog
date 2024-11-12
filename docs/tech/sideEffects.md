# sideEffects与摇树优化丢东西

起因是 在我们引入了lodash后,分析打包后的资源体积,发现lodash太大了.

然后决定手动配置package.json中的sideEffects字段来做摇树优化,减少lodash体积.

但启动摇树优化后,我们发现css样式丢了,以及部分js模块没执行.

## 解决方法

css的丢失可以这样解决:

```js
"sideEffects": [
		"**/*.css"
]
```

js丢失可能是因为那个模块没有导出任何东西,也需要手动添加进来

```js
"sideEffects": [
		"./src/utils/resetFontSize.ts",
]
```



## 摇树优化

用于描述副作用项。打包工具在做摇树优化的时候大体遵循如下逻辑：

1. 基于esModule的静态分析，找到没有引用的模块。
2. 考虑该模块是否有副作用，如果没有副作用则删掉。
3. 怎么知道有没有副作用呢？一方面webpack依赖的`terser`会去检测语句中的副作用（但 js 作为动态类型语言，很多情况下不执行是分析不出结果的，所以语句层面的副作用分析能力有限，可以通过魔法注解`/*#__PURE__*/` 来配合，旨在标明该声明无副作用），另一方面我们可以在`sideEffects`配置项中告诉打包工具哪些文件是有副作用的，即允许打包工具应该跳过对整个模块及其子树的分析。

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

看似`index.ts`有对`resetFontSize`的直接引用，但因为`setFontSize`没有`export`导出任何东西，所以该文件会被摇树优化掉。

解决方法：

```json
//...package.json
"sideEffects": [
		"./src/utils/resetFontSize.ts",
]
```

类似的还有打包后样式文件的丢失，因为css的导入也是副作用。解决方法是：

```json
//...package.json
"sideEffects": [
		"###/*.css"
		//如果是vue项目，组件内样式丢失，你需要指明哪个组件含有副作用
		"./src/ComponentWithStyle.vue"
]
```

或者[干脆把"sideEffects": false从package.json中删掉](https://vue-loader.vuejs.org/guide/#manual-setup)。另外，因为tree-shaking依赖于esModule的静态分析，所以在使用一些库的时候优先考虑es版本：比如使用`lodash-es`而不是`lodash`
