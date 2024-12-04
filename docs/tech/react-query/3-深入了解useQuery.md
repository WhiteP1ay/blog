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
  queryKey: ["book", "author", bookTitle],
  queryFn: async () => {
    const book = await fetchBook(bookTitle);
    const author = await fetchBookAuthor(book.data.id);
    return {
      book,
      author,
    };
  },
});
```

通常更正确的做法是拆分开，更灵活，且低耦合。

```tsx
const useBook = (bookTitle) => {
  return useQuery({
    queryKey: ["book", bookTitle],
    queryFn: () => fetchBook(bookTitle),
    enabled: !!bookTitle,
  });
};
```

```tsx
const useAuthor = (bookId) => {
  return useQuery({
    queryKey: ["author", bookId],
    queryFn: () => fetchBookAuthor(bookId),
    enabled: !!bookId,
  });
};
```

```tsx
const useBookAuthor = (bookTitle) => {
  const book = useBook(bookTitle);
  const author = useAuthor(book.data.id);
  return {
    book,
    author,
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
  const [book, author] = await Promise.all([
    fetchBook(bookId),
    fetchBookAuthor(bookId),
  ]);
  return {
    book,
    author,
  };
};
useQuery({
  queryKey: ["book", "author", bookTitle],
  queryFn,
});
```

也可以同时调用 useQuery 多次，但又要额外处理 isFetching/isLoading 等逻辑。

所以更推荐使用 `useQueries` 来并发请求。

基于 combine 可以实现更复杂的聚合逻辑。

```ts
const queries = useQueries({
  queries: [
    { queryKey: ["book", bookId], queryFn: () => fetchBook(bookId) },
    { queryKey: ["author", bookId], queryFn: () => fetchBookAuthor(bookId) },
  ],
  combine: (results) => {
    const [book, author] = results.map((item) => item.data);
    return {
      book,
      author,
      isPending: results.some((result) => result.isPending),
      isError: results.some((result) => result.isError),
    };
  },
});
```
