# Mutation

> Unlike queries, mutations are typically used to create/update/delete data or perform server side-effects. For this purpose, TanStack Query exports a useMutation hook.

> 与查询不同，mutation（变更）通常用于创建/更新/删除数据或执行服务器端副作用。为此，TanStack Query 导出了一个 useMutation 钩子。

## 什么是 Mutation

所有状态管理工具本质上都是在做两件事,一个是`获取数据`，一个是`修改数据`。

比如 react 自己的`useState` hook，顾名思义，它本质也是一种状态管理。

```ts
const [state, setState] = useState(initialState);
```

它返回的`state` 是用于获取数据的，`setState` 是用于修改数据的。

在`query` 中，`获取数据`对应的是`useQuery`，`修改数据`对应的是`useMutation`。

> 我个人理解，就是为`POST`/`PUT`/`DELETE`等请求提供了一个更方便的钩子。

## useMutation

```tsx
const { mutate } = useMutation({
  mutationFn: () => {
    return axios.post("/api/user", { name: "jack" });
  },
});
```

为什么不直接调用 `axios.post(...)`，而是要通过`useMutation`来调用？

因为`useMutation`可以让我们很方便的获取到`mutation`的衍生状态，比如`isPending`，`isSuccess`，`isError`等。而且可以配合`retry`参数，在请求失败后自动重试。

## 回调函数中做缓存管理

我们可以通过`onSuccess`，`onError`等回调函数，在`mutation`成功或失败后，更方便的做一些额外的操作。

```tsx
const { mutate } = useMutation({
  mutationFn: () => {
    return axios.post("/api/user", { name: "jack" });
  },
  onSuccess: (newUser) => {
    toast.success("User created successfully");
    // 创建用户成功后，更新缓存中的用户列表
    queryClient.setQueryData(["users", newUser.id], newUser);
    // 或者创建用户成功后，让之前的缓存数据失效
    queryClient.invalidateQueries({ queryKey: ["users"] });
  },
});
```

`setQueryData` 是用于设置缓存数据，`invalidateQueries` 是用于让之前基于`queryKey`缓存的数据失效。

这些`api`对于前端管理缓存状态非常有用，可以有效提升用户体验。
