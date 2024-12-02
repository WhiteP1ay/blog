# @tanstack/query

## @tanstack/query是什么？

@tanstack/query 是一个异步状态管理工具，支持react/vue等主流前端框架。

>[github](https://github.com/TanStack/query) 42.7k ⭐️，npm[周下载量](https://www.npmjs.com/package/@tanstack/react-query) 4422006。

可以看出无论是github的star数量还是周下载量都非常夸张，是一个在国外非常主流的技术选择。

平均每6个react项目中就有一个使用了react-query。

## 我们为什么需要它

### 简陋的fetch

如果没有这个库，我们在通过 Fetch 获取数据时，通常是这样的

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

如果对交互细节有追求，就会发现以上代码并没有完。

为了完善的 Loading 和错误提示，这个代码将变成这样：

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

这就 ok 了吗，并没有。为了避免每次网络请求都重复写这一堆逻辑，我们不得不对这些代码再做一次抽象。

抽象后的hooks为了避免多次调用导致的重复发送请求，需要把请求到的数据作为状态缓存起来。然后我们又面临计算机中最复杂的问题之一：缓存何时失效。

为了把缓存的状态分发到各个组件，这又意味着服务端的数据得和状态管理结合起来。问题变得越来越复杂。

### 竞态问题

另一个复杂的场景是：由于 fetch 是异步操作，当多个请求同时发出，由于我们不知道哪一步先完成，所以我们不能保证最终渲染的是否是最后一次请求结果。

想象一下，有一个支持翻页的列表组件，如果用户频繁的翻页，从第一页快速的翻到第十页，因为我们不能保证第十页的请求最后完成，所以第十页的请求结果可能被其他页码的请求结果覆盖。

这就是我们要解决的[“race condition，竞态问题”](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect)。

一个简单的处理静态问题的例子：通过闭包的active来让旧的请求在组件重渲染时不再执行后续逻辑。

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

### 异步状态管理

以上只是明显的缺陷，还有一个隐含的不那么容易暴露出来的缺陷：客户端状态和服务端状态的差异导致的状态维护困难。

客户端状态总是同步的，完全由我们控制的。但服务端状态并不总是听话，所以当我们需要管理这些状态时就很乏力。

传统的方案是每次使用服务端状态前都要经过一个 Loading，因为我们缺乏一个机制来保证缓存数据的有效性（当然不存在完美的缓存机制，但我们可以做的尽可能的好）。

而 query 提供了较完善的方案。所以我们可以轻松的完成以下功能

- Cache 管理
- 轮询
- 翻页缓存
- 自动重载
- 无限滚动
- 窗口聚焦自动重载
- 离线数据
- 失败重试
