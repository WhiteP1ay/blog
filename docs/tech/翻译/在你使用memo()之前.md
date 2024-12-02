# 【翻译】在你使用 `memo` 之前

翻译自https://overreacted.io/before-you-memo/

市面上有很多文章介绍如何为 `react` 应用做性能优化，通常来说，如果状态更新很慢，你需要：

- 确保你构建的是生产环境 （开发环境构建被故意放慢，极端情况下甚至会慢一个数量级）
- 确保你没有把状态放在不必要的高层级 （比如把 `input` 的输入状态放到了某个集中状态管理中通常不是个好主意）
- 运行 `React DevTools Profiler` 来查看什么导致了重新渲染，并将最耗费性能的重新渲染用 `memo`/`useMemo` 包裹起来
  最后一步通常最烦人，理想情况下编译工具应该帮你做这步，在未来可能实现。

在这篇博文中，我想分享两个不同的技术。尽管这两个技术非常基础，但很少有人意识到这会提升性能。

## 一个（人为）性能缓慢的组件

以下是一个存在严重渲染性能问题的组件：

```tsx
import { useState } from "react";

export default function App() {
  let [color, setColor] = useState("red");
  return (
    <div>
      <input value={color} onChange={(e) => setColor(e.target.value)} />
      <p style={{ color }}>Hello, world!</p>
      <ExpensiveTree />
    </div>
  );
}

function ExpensiveTree() {
  let now = performance.now();
  while (performance.now() - now < 100) {
    // Artificial delay -- do nothing for 100ms
  }
  return <p>I am a very slow component tree.</p>;
}
```

问题是无论何时 `color` 的变更都会导致 `ExpensiveTree` 的重新渲染，并且重新渲染人为的非常缓慢。

我可以使用 `memo`，然后大功告成，但现在有很多关于 `memo` 的文章，所以我不会花时间在上面。我想展示两种不同的解决方案。

## 解决方案 1： 下放状态

如果仔细观察渲染代码，您会注意到返回树中只有一部分真正关心当前 `color` 状态，所以我们可以提出这部分放到 `Form` 组件里，并吧 `color` 状态下放到 `Form` 组件中：

```tsx
export default function App() {
  return (
    <>
      <Form />
      <ExpensiveTree />
    </>
  );
}

function Form() {
  let [color, setColor] = useState("red");
  return (
    <>
      <input value={color} onChange={(e) => setColor(e.target.value)} />
      <p style={{ color }}>Hello, world!</p>
    </>
  );
}
```

现在 `color` 的改变，只有 `Form` 会重新渲染，问题解决了。

## 解决方案 2： 内容提升

但如果状态变更发生在有重新渲染性能问题的组件的父级，上面的解决方案就不会生效了。比如：

```tsx
export default function App() {
  let [color, setColor] = useState("red");
  return (
    // color被使用在ExpensiveTree的父级
    <div style={{ color }}>
      <input value={color} onChange={(e) => setColor(e.target.value)} />
      <p>Hello, world!</p>
      <ExpensiveTree />
    </div>
  );
}
```

现在我们不能通过 提取不使用 `color` 部分到另一个组件的方法 来解决问题了，因为这将不得不包括 `div`，而 `div` 又包括了 `ExpensiveTree`，所以我们只能使用 `memo` 了对吗？ 

...

...

...

...

其实很简单：

```tsx
export default function App() {
  return (
    <ColorPicker>
      <p>Hello, world!</p>
      <ExpensiveTree />
    </ColorPicker>
  );
}

function ColorPicker({ children }) {
  let [color, setColor] = useState("red");
  return (
    <div style={{ color }}>
      <input value={color} onChange={(e) => setColor(e.target.value)} />
      {children}
    </div>
  );
}
```

我们将 `App` 组件一分为二。依赖于 `color` 部分移动到 `ColorPicker` 中。不关心 `color` 部分的留在了 `App` 组件里，并通过 `children` 传递给了 `ColorPicker`

当 `color` 改变时，`ColorPicker` 会重新渲染，但 `children` 属性并没有改变，所以子树并不会被 `React` 访问到。

结论就是 `<ExpensiveTree />` 没有重新渲染

## 什么是最佳实践

在应用诸如 `memo` 或 `useMemo` 之类的优化之前，做一些上文所属的组件拆分通常是有意义的。

这些方法的有趣之处在于，它们与性能本身并没有任何关系。使用 `children` 拆分组件会让数据流更清晰，并减少跨组件传递的 `props` 数量。在这种情况下，性能的提高只是锦上添花，而不是最终目标。

奇怪的是，这种模式在未来也带来了更多的性能优势。

例如，当服务器组件特性稳定并正式发布后，我们的 `ColorPicker` 组件可以从服务器接收其子组件。整个 `<ExpensiveTree/>` 组件或其部分都可以在服务器上运行，即使是应用顶层状态的更新也会在客户端上"跳过"这些部分的重新渲染。

这是连 `memo` 都做不到的！但同样，这两种方法是相辅相成的。在`内容提升`和`下放状态`都不够用的时候，使用 `Profiler` 和 `memo`。
