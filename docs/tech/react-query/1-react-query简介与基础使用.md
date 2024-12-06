# @tanstack/query 简介与基础使用

![IMG_3907](./img/IMG_3907.jpg)

> 一只在奥森拍到的玳瑁猫，颜色像打翻的颜料盘

## 前言

嘿，我是老白。

给大家推荐一个前端库，名字叫做`@tanstack/query` （aka `react-query`，下文简称 query）。

它是一个异步状态管理工具，支持 react/vue/angular 等主流前端框架。我自己在生产项目中使用过 react 和 vue 的版本，体验都还不错。

文档上 react 方面做的更好一些。

什么是异步状态管理，简单地说，就是管理基于异步操作而获得状态。通常是管理网络请求返回的数据以及衍生状态。这个后续细说。

先看一下这个库的成绩：

> [github](https://github.com/TanStack/query) 42.7k ⭐️，npm[周下载量](https://www.npmjs.com/package/@tanstack/react-query) 4422006。

这个数据看起来非常夸张，实际上也确实如此，query 在国外是非常主流的技术选择。

> 官方说法是“平均每 6 个 react 项目中就有一个使用了 query。”

但在国内似乎比较冷门，也缺少完善的中文翻译。这也是我想做这个技术分享的原因，想把好的工具介绍给更多的国内开发者。当然选择分享一个冷门的技术也注定这个系列没几个人能看到。

如果你看到了，我很荣幸。

## 我们为什么需要它

### 简朴的 fetch

如果没有这个库，我们在通过 `fetch` 获取数据时，通常是这样的。

```tsx
type Student = {
  id: number;
  name: string;
  age: number;
  gender: string;
};

// 一个简单的获取学生列表的组件
const StudentList = () => {
  // 定义状态存储学生数据
  const [students, setStudents] = useState<Array<Student>>([]);

  // 组件挂载时获取数据
  useEffect(() => {
    fetch("https://api.example.com/students")
      .then((res) => res.json())
      .then((data) => {
        setStudents(data);
      });
  }, []);

  return (
    <ul>
      {students.map((student) => (
        <li key={student.id}>
          <p>姓名: {student.name}</p>
          <p>年龄: {student.age}</p>
          <p>性别: {student.gender}</p>
        </li>
      ))}
    </ul>
  );
};
```

如果你在 demo 里这么写，没有问题。但在生产环境中一定需要处理 loading 状态和错误处理。

否则一旦 loading 时间过长却没有任何用户反馈、或者请求出错但前端没有响应，对用户体验来说都是致命打击。

那么，这个代码将变成这样：

```tsx
// 一个简单的获取学生列表的组件
type Student = {
  id: number;
  name: string;
  age: number;
  gender: string;
};

const StudentList = () => {
  // 定义状态存储学生数据和加载状态
  const [students, setStudents] = useState<Array<Student>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // 组件挂载时获取数据
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("https://api.example.com/students");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setStudents(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("发生未知错误"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // 加载状态显示
  if (isLoading) {
    return <div>加载中...</div>;
  }

  // 错误状态显示
  if (error) {
    return <div>发生错误: {error.message}</div>;
  }

  return (
    <ul>
      {students.map((student) => (
        <li key={student.id}>
          <p>姓名: {student.name}</p>
          <p>年龄: {student.age}</p>
          <p>性别: {student.gender}</p>
        </li>
      ))}
    </ul>
  );
};
```

有的同学看到这里可能会说，loading 和错误提示可以在`axios`或者类似库的网络请求拦截器中处理。但这种处理通常是统一处理，如果在灵活性要求比较高的场景下、还是会不得不自己控制类似`isLoading`的衍生状态。

### 竞态问题

另一个复杂的场景是：由于`fetch` 是异步操作，当多个请求同时发出，由于我们不知道哪一步先完成，所以我们不能保证最终渲染的是否是最后一次请求结果。

上述有点抽象，我们想象两个场景：

1. 有一个支持翻页的列表组件，如果用户频繁的翻页，从第一页快速的翻到第十页。此时用户期望看到的是第十页的数据，但因为我们不能保证第十页的请求一定早于其他请求返回到前端，所以第十页的请求结果可能被其他页码的请求结果覆盖。
2. 一个自动完成组件，用户输入一部分内容，组件会在用户输入时访问远程服务器，获取智能补全的列表。但因为用户输入变更很快，最终的智能补全的提示词可能被延期返回的请求结果覆盖。

这就是我们要解决的[“race condition—竞态问题”](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect)。

一个简单的处理静态问题的思路：通过闭包的`active`来让旧的请求在组件重渲染时不再执行后续逻辑。

```tsx
useEffect(() => {
  let active = true;

  const fetchData = async () => {
    setTimeout(async () => {
      const response = await fetch(`https://swapi.dev/api/people/${props.id}/`);
      const newData = await response.json();
      if (active) {
        setFetchedId(props.id);
        setData(newData);
      }
    }, Math.round(Math.random() * 12000));
  };

  fetchData();

  return () => {
    active = false;
  };
}, [props.id]);
```

每次发起请求都有一个新的`active`被创建，只有当`active`为`true`才会执行网络请求的后续操作。

当组件重新渲染或者说页面状态过期的时候 active 变成 false，这个`false`作为网络请求的闭包被缓存到了回调函数中，从而阻止了过期的后续操作。

### 异步状态管理

以上只是明显的缺陷，还有一个隐含的不那么容易暴露出来的缺陷：客户端状态和服务端状态的差异导致的状态维护困难。

客户端状态总是同步的，完全由我们控制的。

但服务端状态并不能一股脑扔进状态管理的 store 里，因为它涉及有效性的问题。

传统的方案是每次使用服务端状态前都要发送一个网络请求，经过一个 `loading`，以保证数据都有效性。但这么做其实是一种懒惰：以牺牲用户体验为代价，减少程序员的开发量。

因为我们仔细思考一下就会发现一些数据并不总是变化的：

- 基金的收益只有结算时会揭露，且每天一次。
- 一个用户的个人简介可能几个月也不会变化一次。
- ”我的关注”列表什么时候发生了变化只有用户自己最清楚。

如果我们既不想要每次使用异步状态都弹出一个`loading`阻塞用户操作，又不想自己手动管理复杂的异步状态何时过期、何时刷新的话，可以尝试使用 query，query 提供了较完善的方案。

query 可以让我们轻松的完成以下功能：

- Cache 管理
- 轮询
- 翻页缓存
- 自动重载
- 无限滚动
- 窗口聚焦自动重载
- 离线数据
- 失败重试

## query 基础使用

这节讲一下query 的基础使用，发起一个网络请求很简单，只需要调用`useQuery`，该函数需要两个参数：`queryKey`和`queryFn`。

```tsx
useQuery({
  queryKey: any[],
  queryFn: ()=>Promise
})
```

## 关于 queryFn

`queryFn` 总是返回一个 Promise，因为 query 并不在乎`queryFn`中是否有一个真实的网络请求，query 只在乎 Promise 的状态。

如果用浏览器的`fetch` Api 来编写网络请求，`queryFn`看起来是这样的。

```tsx
queryFn: async () => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Error status: ${response.status}`);
  }
  return response.json();
};
```

不需要在这里嵌套`try-catch`，直接 throw Error 是为了告诉 query 发生了错误。

query 的定位是异步状态管理工具，和`pinia\jotai`这种同步状态管理库、还有`axios`这种网络请求库是完全不冲突的，因为定位不一样。

所以正式项目推荐把基于`axios`发起的网络请求作为`queryFn`。

## 关于 queryKey

`queryKey`是一个数组，通常首位是对状态的简要描述。比如如果获取学生列表就可以是`['student']`。如果获取血色好难过详情就可以是`['student',id]`。

请求相关的参数也应该放到`queryKey`列表中，每当`queryKey`变更就会重新执行查询函数，并把查询结果缓存起来。

```ts
// id/排序/页码/每页条数/排序 等等都应该放到query-key中
useQuery({ queryKey: ['todo', sort], ... })
```

如果`queryKey`命中缓存中的 key，query 就会直接返回上次的缓存结果，跳过了阻塞用户操作的`loading`，也就提升了用户体验。

`queryKey`也许会让人联想到`useEffect`的依赖列表，但不完全相同。

query 会基于`queryKey`计算 hash 值，所以你可以大胆的在`queryKey`里使用对象和数组，同时 query 会无视对象键值对的顺序。

```ts
// 这些query-key是一回事
useQuery({ queryKey: ['todos', { status, page }], ... })
useQuery({ queryKey: ['todos', { page, status }], ...})
useQuery({ queryKey: ['todos', { page, status, other: undefined }], ... })
```

## 简单示例

一个基础示例，基于所选的书名查看该书的详情：

```tsx
import { useState } from "react";
import { fetchBookDetail } from "../api/book";
import { useQuery } from "@tanstack/react-query";

const books = [
  { id: 1, title: "React 从入门到精通" },
  { id: 2, title: "深入理解 Vue" },
  { id: 3, title: "你不知道的 Angular" },
];

const Intro = () => {
  const [bookId, setBookId] = useState<number>(1);
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBookId(parseInt(e.target.value));
  };
  const {
    data: book,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["book", bookId],
    queryFn: () => fetchBookDetail(bookId),
  });

  if (isLoading) {
    return <p>加载中...</p>;
  }

  if (isError) {
    return <p>错误: {error.message}</p>;
  }

  return (
    <>
      <select value={bookId} onChange={handleChange}>
        {books.map((book) => (
          <option key={book.id} value={book.id}>
            {book.title}
          </option>
        ))}
      </select>
      <>
        <h1>{book?.title}</h1>
        <p>{book?.author}</p>
        <p>{book?.description}</p>
      </>
    </>
  );
};

export default Intro;
```

这里需要注意针对`book`的操作是需要问号的，因为`book`通过异步操作才从`undefined`变成可用的数据。
