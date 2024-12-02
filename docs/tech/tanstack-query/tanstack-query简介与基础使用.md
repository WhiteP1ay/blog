# @tanstack/query简介与基础使用

![IMG_3907](./img/IMG_3907.jpg)

> 一只在奥森拍到的玳瑁猫，颜色像打翻的颜料盘

## @tanstack/query是什么？

`@tanstack/query` （下文简称query）是一个异步状态管理工具，支持react/vue等主流前端框架。

>[github](https://github.com/TanStack/query) 42.7k ⭐️，npm[周下载量](https://www.npmjs.com/package/@tanstack/react-query) 4422006。

无论是github的star数量还是周下载量都非常夸张，query是一个在国外非常主流的技术选择。

平均每6个react项目中就有一个使用了query。

## 我们为什么需要它

### 简朴的fetch

如果没有这个库，我们在通过 `fetch` 获取数据时，通常是这样的

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

如果对交互细节有追求，我们需要额外管理loading状态和错误处理。

这个代码将变成这样：

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

抽象后的`hook`为了避免多次调用导致的重复发送请求，需要把请求到的数据作为状态缓存起来，再分发到各个组件。然后我们又面临计算机中最复杂的问题之一：缓存何时失效。

为了把缓存的状态分发到各个组件，这意味着服务端的数据得和状态管理结合起来。

问题变得越来越复杂。

### 竞态问题

另一个复杂的场景是：由于` fetch` 是异步操作，当多个请求同时发出，由于我们不知道哪一步先完成，所以我们不能保证最终渲染的是否是最后一次请求结果。

想象一下，有一个支持翻页的列表组件，如果用户频繁的翻页，从第一页快速的翻到第十页。

此时用户期望看到的是第十页的数据，但因为我们不能保证第十页的请求最后完成，所以第十页的请求结果可能被其他页码的请求结果覆盖。

这就是我们要解决的[“race condition—竞态问题”](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect)。

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

客户端状态总是同步的，完全由我们控制的。但服务端状态并不总是听话，所以我们管理这些状态时就很乏力。

传统的方案是每次使用服务端状态前都要发送一个次网络请求，经过一个 `loading`，以保证数据都有效性。但一些页面展示的数据并不总是变化的：

- 基金的收益只有结算时会揭露，且每天一次。
- 一个用户的个人简介可能几个月也不会变化一次。
- ”我的关注”列表什么时候发生了变化只有用户自己最清楚。

如果我们既不想要每次使用异步状态都弹出一个`loading`阻塞用户操作，又不想自己手动管理复杂的异步状态的话，可以尝试使用query，query 提供了较完善的方案。所以我们可以轻松的完成以下功能：

- Cache 管理
- 轮询
- 翻页缓存
- 自动重载
- 无限滚动
- 窗口聚焦自动重载
- 离线数据
- 失败重试

## query 基础使用

query的基础使用进需要两个参数：`queryKey`和`queryFn`。

```tsx
useQuery({
  queryKey: any[],
  queryFn: ()=>Promise
})
```

## 简单示例

一个基础示例，查看其他用户的信息，首先我们需要封装一个信息卡片组件：

```tsx
interface InfoCardProps {
  name: string;
  age: number;
  gender: string;
  id: number;
  onClick: (id: number) => void;
}

const InfoCard = ({ name, age, gender, id, onClick }: InfoCardProps) => {
  return (
    <li className="border border-gray-300 rounded-md p-4">
      <p className="text-lg font-bold">姓名：{name}</p>
      <p className="text-gray-500">年龄：{age}</p>
      <p className="text-gray-500">性别：{gender}</p>
      <button onClick={() => onClick(id)}>查看详情</button>
    </li>
  );
};
```

接下来，我们需要一个列表，列表通过`useQuery`获取数据，并渲染了三张卡片：

```tsx
import { useQuery } from "@tanstack/react-query";

const fetchStudentList = async () => {
  // 模拟API延迟
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return [
    { name: "张三", age: 18, gender: "男", id: 1 },
    { name: "李四", age: 19, gender: "女", id: 2 },
    { name: "王五", age: 20, gender: "男", id: 3 },
  ];
};

// CardList 是一个典型的 container 组件
const CardList = () => {
  const {
    data: infoList,
    isPending,
    error,
  } = useQuery({
    queryKey: ["studentList"],
    queryFn: fetchStudentList,
  });

  const handleClick = (id: number) => {
    // 处理点击事件
  };

  if (isPending) {
    return <div>加载中...</div>;
  }

  if (error) {
    return <div>发生错误：{error.message}</div>;
  }

  return (
    <ul>
      {infoList?.map((info) => (
        <InfoCard {...info} key={info.id} onClick={handleClick} />
      ))}
    </ul>
  );
};
```

这里需要注意`infoList?.map`是需要问号的，因为`infoList`通过异步操作才从`undefined`变成可用的数据。

## 关于queryFn

值得注意的是示例中没有发送真实网络请求是有意为之的。

因为query并不在乎`queryFn`中是否有一个真实的网络请求，query只在乎Promise的状态。

如果用浏览器的`fetch` Api来编写网络请求，`queryFn`看起来是这样的。

```tsx
queryFn: async ()=>{
	const response = await fetch(url)
  if(!response.ok){
    throw new Error(`Error status: ${response.status}`)
  }
  return response.json()
}
```

不需要在这里嵌套`try-catch`，直接throw Error是为了告诉query发生了错误。

query的定位和`axios`等网络请求库完全不冲突，`queryFn`可以是基于`axios`发起的网络请求。

## 关于queryKey

`queryKey`是一个数组，通常首位是对状态的简要描述。比如上面例子中的`studentList`。

请求相关的参数也应该放到`queryKey`列表中，每当`queryKey`变更就会重新执行查询函数，并把查询结果缓存起来。

```ts
// id/排序/页码/每页条数/排序 等等都应该放到query-key中
useQuery({ queryKey: ['todo', 5], ... })
```

如果`queryKey`命中缓存中的key，query就会直接返回上次的缓存结果（如果没有设置缓存有效期的话，query会静默的发起网络请求更新缓存）。跳过了阻塞用户操作的`loading`，提升了用户体验。

`queryKey`也许会让人联想到`useEffect`的依赖列表，但不完全相同。query 会基于`queryKey`计算hash值，所以你可以大胆的在`queryKey`里使用对象和数组，同时query会无视对象键值对的顺序。

```ts
// 这些query-key是一回事
useQuery({ queryKey: ['todos', { status, page }], ... })
useQuery({ queryKey: ['todos', { page, status }], ...})
useQuery({ queryKey: ['todos', { page, status, other: undefined }], ... })
```
