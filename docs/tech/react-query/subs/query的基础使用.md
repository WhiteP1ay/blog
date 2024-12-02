# query 基础

1. query 支持主流前端框架、包括`react`和`vue`。

2. 基础使用就是，所以接下来我会通过案例介绍什么是queryKey什么是queryFn。

   ```tsx
   useQuery({
     queryKey: any[],
     queryFn: ()=>Promise
   })
   ```

## 简单示例

一个基础示例，查看三个同学的信息卡，首先我们需要封装一个同学的信息卡组件

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

接下来，我们需要一个 card 列表，列表里渲染了三张卡片

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

让异步像同步一样简单，但仍需要注意数据的变化。因为初始阶段 data 是 undefined，`infoList?.map`是需要问号的。

## 关于query-fn

值得注意的是react-query并不在乎queryFn中是否有一个真实的网络请求，react-query只在乎Promise的状态。

如果用浏览器的fetch Api来编写网络请求，queryFn应该看起来是这样的

```tsx
queryFn: async ()=>{
	const response = await fetch(url)
  if(!response.ok){
    throw new Error(`Error status: ${response.status}`)
  }
  return response.json()
}
```

不需要在这里嵌套try-catch，直接throw Error是为了告诉react-query发生了错误。

## 关于query-key

要把请求相关的参数放到query-key参数中，每当query-key变更就会重新执行查询函数，并把查询结果缓存起来。

```ts
// id/排序/页码/每页条数/排序 等等都应该放到query-key中
useQuery({ queryKey: ['todo', 5], ... })
```

如果query-key命中缓存中的key，react-query就会直接返回上次的缓存结果。

这对于提升c端项目用户体验很重要。

react-query 会基于query-key计算hash值，所以你可以大胆的在query-key里使用对象和数组。

并且react-query会无视对象键值对的顺序。

```ts
// 这些query-key是一回事
useQuery({ queryKey: ['todos', { status, page }], ... })
useQuery({ queryKey: ['todos', { page, status }], ...})
useQuery({ queryKey: ['todos', { page, status, other: undefined }], ... })
```

