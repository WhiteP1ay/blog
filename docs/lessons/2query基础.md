# query 基础

1. query 支持各种框架

2. 基础使用就是

   ```tsx
   useQuery({
     queryKey: any[],
     queryFn: ()=>Promise
   })
   ```

3. 一个基础示例，查看三个同学的信息卡

首先我们需要封装一个同学的信息卡组件

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

const CardList = () => {
  const {
    data: infoList,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["studentList"],
    queryFn: fetchStudentList,
  });

  const handleClick = (id: number) => {
    // 处理点击事件
  };

  if (isLoading) {
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

让异步像同步一样简单，但仍需要注意数据的变化。因为初始阶段 data 是 undefined，`infoList?.map`是需要问号的并且我们需要注意
