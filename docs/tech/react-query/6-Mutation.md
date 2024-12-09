# Mutation

所有状态管理工具本质上都是在做两件事,一个是`获取数据`，一个是`修改数据`。

比如 `vuex` 中 `actions` 是用于修改数据的，`state` 是用于获取数据的。

或者 react 自己的 hooks，`useState` ,它返回的`state` 是用于获取数据的，`setState` 是用于修改数据的。

`获取数据`对应的是`Query`，`修改数据`对应的是`Mutation`。

`Mutation` 是 React Query 中用于修改数据的核心功能。它允许你执行诸如创建、更新和删除数据的操作，并处理这些操作的结果。

```tsx
const { mutate } = useMutation({
  mutationFn: () => {
    return axios.post("/api/user", { name: "jack" });
  },
});
```

为什么不直接调用 axios.post，而是要通过`useMutation`来调用？

因为`useMutation`可以让我们很方便的获取到`mutation`的衍生状态，比如`isPending`，`isSuccess`，`isError`等。

如果我们想在`mutation`成功后，做一些额外的操作，比如`refetch`，`invalidateQueries`，`toast`等，那么`useMutation`就非常有用了。

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

我们基于`queryKey`来缓存数据，所以`invalidateQueries`就是让之前基于`queryKey`缓存的数据失效。

queryKey 支持模糊匹配，所以`invalidateQueries({ queryKey: ["users"] })`会让所有包含`users`的`queryKey`的缓存数据都失效。
