# Mutation & 乐观更新

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
const { mutate, isPending, isSuccess, isError } = useMutation({
  mutationFn: () => {
    return axios.post("/api/user", { name: "jack" });
  },
  // 以下方法在 mutate 各个阶段触发
  onMutate: () => {
    console.log("onMutate");
  },
  onSuccess: () => {
    console.log("onSuccess");
  },
  onError: () => {
    console.log("onError");
  },
  onSettled: () => {
    console.log("onSettled");
  },
});
```

为什么不直接调用 `axios.post(...)`，而是要通过`useMutation`来调用？

因为`useMutation`可以让我们很方便的获取到`mutation`的衍生状态，比如`isPending`，`isSuccess`，`isError`等。而且可以配合`retry`参数，在请求失败后自动重试。

## 回调函数中做缓存管理

我们可以通过`onSuccess`，`onError`等回调函数，在`mutation`成功或失败后，更方便的做一些额外的操作。

> 值得注意的是，如果 mutationFn 中返回的 Promise 是`reject`的，那么就算接口请求成功了，onSuccess 也不会触发。useMutation 的 throwOnError 参数可以控制是否抛出错误，但默认是`false`换句话说，如果 onSuccess 一直不触发，请将 throwOnError 设为 true，查看是否报错。

```tsx
const { mutate } = useMutation({
  mutationFn: () => {
    return axios.post("/api/user", { name: "jack" });
  },
  onSuccess: (newUser) => {
    toast.success("User created successfully");
    // 创建用户成功后，更新缓存中的用户列表
    queryClient.setQueryData(["users", newUser.id], newUser);
    // 或者创建用户成功后，让之前的缓存数据失效，并重新获取数据（即刷新缓存）
    queryClient.invalidateQueries({ queryKey: ["users"] });
  },
});
```

`setQueryData` 是用于设置缓存数据

`invalidateQueries` 是用于让之前基于`queryKey`缓存的数据失效并重新获取数据（即刷新缓存）。

这些`api`对于前端管理缓存状态非常有用，可以有效提升用户体验。

## 乐观更新 Optimistic Updates

通常我们提交一个`mutation`后，需要给用户一个 loading，并等待后端返回结果，确保请求成功后才能更新 UI。

但这样用户体验很不流畅。

我们该如何优化呢？其实，在很多情况下，我们不需要等待后端返回结果就已经可以预知请求成功后的 ui 变化。如果服务器告诉我们请求失败了，大不了提示用户“请求失败稍后重试”，然后回滚 ui。

这就是`optimistic updates`，也就是`乐观更新`。

以下这些场景非常适合：

- 点赞
- 收藏
- 关注
- 评论
- 删除

## 基础实现

既然是乐观更新，那就不能等后端返回结果再修改状态了。换句话说，我们不应该在`onSuccess`中修改状态，而是应该在`onMutate`中修改状态。

怎么修改状态呢？

`queryClient`提供了`setQueryData`方法，可以让我们修改缓存的数据。

接下来要思考的问题是，如果网络请求失败了，我们该如何回滚状态？

`queryClient`提供了`getQueryData`方法，可以让我们获取缓存的数据。

基于`queryKey`，我们可以在乐观的修改状态前先保存目前缓存的状态作为快照，再在`onMutate`方法中返回一个回滚方法。

onError 函数的第三个参数是 context，它是`onMutate`的返回值，在本例中就是回滚方法。

类似`Promise`，该 api 还提供了`onSettled`，它无论接口成功与否，都会执行。我们可以在里面调用`invalidateQueries`，刷新缓存。

```ts
onMutate: async ({ targetData }) => {
  const snapshot = queryClient.getQueryData(queryKey);
  // 乐观更新
  queryClient.setQueryData(queryKey, (oldData) => {
    //handle old data and then
    return newData;
  });
  // 回滚
  return () => queryClient.setQueryData(queryKey, snapshot);
};
onError: (err, variables, rollback) => {
  rollback?.();
};

onSettled: () => {
  return queryClient.invalidateQueries({
    queryKey,
  });
};
```

## 真实代码

```tsx
export type Todo = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
};

const useCheckTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ todo }: { todo: Todo }) => checkTodo(todo),
    onMutate: ({ todo }) => {
      const snapshot = queryClient.getQueryData(["todoList"]);
      queryClient.setQueryData(["todoList"], (oldData: Todo[]) => {
        return oldData.map((t) =>
          t.id === todo.id ? { ...t, completed: !t.completed } : t
        );
      });
      /**
       * The value returned from this function will be passed to both the onError and onSettled functions in the event of a mutation failure and can be useful for rolling back optimistic updates.
       */
      return () => {
        queryClient.setQueryData(["todoList"], snapshot);
      };
    },
    onError: (error, todo, rollback) => {
      rollback?.();
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["todoList"] });
    },
  });
};
```

## hook 封装

如果常用乐观更新这种操作，我们可以将它封装成一个 hook，方便复用。

> 但我觉得一个项目中涉及到乐观更新的地方其实并不多，基于`useMutate`调用`onMutate`，`onError`，`onSettled`等方法，可以很方便的实现乐观更新。封装了 Hook 后，反而增加了代码的复杂度。

```tsx
export const useOptimisticMutation = ({
  mutationFn,
  queryKey,
  updater,
  invalidates,
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onMutate: async () => {
      // 取消任何相关请求，避免覆盖结果
      await queryClient.cancelQueries({
        queryKey,
      });

      const snapshot = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, updater);

      return () => {
        queryClient.setQueryData(queryKey, snapshot);
      };
    },
    onError: (err, variables, rollback) => {
      rollback?.();
    },
    onSettled: () => {
      return queryClient.invalidateQueries({
        queryKey: invalidates,
      });
    },
  });
};
```
