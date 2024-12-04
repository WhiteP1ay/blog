# 深入了解 useQuery

## 条件性请求

有时候我们希望 query 只在某个场景下或某种条件达成的前提下进行。比如

```tsx
//!!! 错误示范
if (keyword) {
  useQuery({
    queryKey: ["search", keyword],
    queryFn,
  });
}
```

但很明显，这违反了 `hook` 的设计规范，所以可以通过传入 `enable` 来解决。

```tsx
useQuery({
  queryKey: ["search", keyword],
  queryFn,
  enable: !!keyword,
});
```

## 依赖性请求

假设请求 a 依赖于请求 b 的结果，我们将请求 a 称为依赖性请求。

依赖性请求可以在 `queryFn` 里统一处理，但这并不利于逻辑的抽象，或者说耦合性过高了。不利于维护。

但也不是一无是处，`queryFn` 里统一处理依赖性请求，可以使得两个请求共享错误处理、loading 状态等等。如果你明确没有拆分场景，那这样确实更加方便。

```tsx
//!!! 耦合度过高
useQuery({
  queryKey: ["book", "comments", bookId],
  queryFn: async () => {
    const book = await fetchBook(bookId);
    const comments = await fetchBookComments(book.data.id);
    return {
      book,
      comments,
    };
  },
});
```

通常更正确的做法是拆分开，基于 `enabled` 控制请求触发时机。这样更灵活，且低耦合。

```tsx
const useBookDetail = (bookId) => {
  return useQuery({
    queryKey: ["book", bookId],
    queryFn: () => fetchBook(bookId),
    enabled: !!bookId,
  });
};
```

```tsx
const useBookComments = (bookId) => {
  return useQuery({
    queryKey: ["comments", bookId],
    queryFn: () => fetchBookComments(bookId),
    enabled: !!bookId,
  });
};
```

```tsx
const useBookDetailAndComments = (bookId) => {
  const book = useBookDetail(bookId);
  const comments = useBookComments(bookId);
  return {
    book,
    comments,
  };
};
```

## 垃圾回收

如果一致缓存数据不释放会导致内存泄漏。所以垃圾回收机制很重要，尤其是低端设备上。

query 默认垃圾回收时间 `gcTime` 是 5 分钟。但这不意味着缓存时间超过五分钟都会被清空。

**被回收的前提是数据过期且不再被引用。**

组件每次引用异步状态都会创建一个观察者，所以 query 也可以通过判断观察者数量是否为 0 来判断数据是否不再被引用。

## 轮询

轮询通常用在需要实时性反馈的场景，比如用户是否完成支付。

`useQuery` 的 `refetchInterval` 参数可以定义轮询时间，单位毫秒。

```ts
useQuery({
  queryKey: ["list", { sort }],
  queryFn,
  refetchInterval: 5000, // 5 seconds 轮询
});
```

`refetchInterval` 也可以是一个函数，想象这样一个场景：前端通过轮询来得知用户是否完成支付，用户一旦完成支付轮询就该停止。

```ts
{
   ...,
   refetchInterval: (query)=>{
     if(query.state.data?.finished){
       return false
     }
     return 3000
   }
}
```

## 并发请求

我们可以在 queryFn 里基于 `Promise.all` 来并发请求。但这又犯了上文说的错误，让两个请求耦合在一起。

```ts
const queryFn = async (bookId) => {
  const [book, comments] = await Promise.all([
    fetchBook(bookId),
    fetchBookComments(bookId),
  ]);
  return {
    book,
    comments,
  };
};
useQuery({
  queryKey: ["book", "comments", bookTitle],
  queryFn,
});
```

也可以同时调用 useQuery 多次，但又要额外处理 isFetching/isLoading 等逻辑。

所以更推荐使用 `useQueries` 来并发请求。

基于 combine 可以实现更复杂的聚合逻辑。

```ts
const { bookComments, bookDetail, isDetailAndCommentPending } = useQueries({
  queries: [
    {
      queryKey: ["book", selectedBookId],
      queryFn: () => fetchBookDetail(selectedBookId!),
      enabled: !!selectedBookId,
    },
    {
      queryKey: ["bookComments", selectedBookId],
      queryFn: () => fetchBookComments(selectedBookId!),
      enabled: !!selectedBookId,
    },
  ],
  combine: (data) => {
    const [bookDetail, bookComments] = data;
    return {
      bookDetail,
      bookComments,
      isDetailAndCommentPending: data.some((query) => query.isPending),
    };
  },
});
```
