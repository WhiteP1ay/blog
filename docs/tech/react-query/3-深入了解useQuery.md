# 深入了解 useQuery

## 条件性请求

所谓条件性请求，就是指 query 只在某个场景下或某种条件达成的前提下进行。

比如：

```tsx
//!!! 错误示范
if (keyword) {
  useQuery({
    queryKey: ["search", keyword],
    queryFn,
  });
}
```

但很明显，这违反了 `hook` 的设计规范。

可以通过传入 `enabled` 来解决条件性请求。即：仅当 `enabled` 为 `true` 时，query 才会被触发。

```tsx
useQuery({
  queryKey: ["search", keyword],
  queryFn,
  enabled: !!keyword,
});
```

## 依赖性请求

依赖性请求是指当前请求依赖于其他请求的结果。

比如：基于书名请求一本书的详情和评论。获取评论需要书的 id，而书的 id 需要基于书名获取。

依赖性请求可以在 `queryFn` 里通过多个 `await` 处理，但这并不利于逻辑的抽象，或者说耦合性过高。不利于维护。

但也不是一无是处，这种处理方式可以让两个请求共享错误处理、loading 状态等等。如果你明确不需要拆分，那这样确实会更加方便。

```tsx
//!!! 耦合度过高
useQuery({
  queryKey: ["book", "comments", bookTitle],
  queryFn: async () => {
    const book = await fetchBook(bookTitle);
    const comments = await fetchBookComments(book.data.id);
    return {
      book,
      comments,
    };
  },
});
```

但我更推荐拆分开，基于 `enabled` 控制请求触发时机。这样更灵活，且低耦合。

```tsx
const useBookDetail = (bookTitle: string) => {
  return useQuery({
    queryKey: ["book", bookTitle],
    queryFn: () => fetchBook(bookTitle),
    enabled: !!bookTitle,
  });
};
```

```tsx
const useBookComments = (bookId: string) => {
  return useQuery({
    queryKey: ["comments", bookId],
    queryFn: () => fetchBookComments(bookId),
    enabled: !!bookId,
  });
};
```

```tsx
const useBookDetailAndComments = (bookTitle: string) => {
  const book = useBookDetail(bookTitle);
  const comments = useBookComments(book.data?.id);
  return {
    book,
    comments,
  };
};
```

## 轮询

轮询通常用于那些需要实时性反馈的场景，比如查询用户是否完成支付。

`useQuery` 的 `refetchInterval` 参数可以定义轮询时间，单位毫秒。

```ts
useQuery({
  queryKey: ["list", { sort }],
  queryFn,
  refetchInterval: 5000, // 5 seconds 轮询
});
```

`refetchInterval` 也可以是一个函数。

想象这样一个场景：前端通过轮询来得知用户是否完成支付，用户一旦完成支付轮询就该停止。

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

当一些业务场景需要前端并发若干请求时，我们可以在 `queryFn` 里基于 `Promise.all` 来并发请求。

这很好，但会让两个请求耦合在一起。任意请求的失败都会导致整个请求失败，且只有一个缓存 key，不利于细粒度的控制缓存。

```ts
const queryFn = async (bookId: string) => {
  const [book, comments] = await Promise.all([
    fetchBookDetail(bookId),
    fetchBookComments(bookId),
  ]);
  return {
    book,
    comments,
  };
};
useQuery({
  queryKey: ["book", "comments", bookId],
  queryFn,
});
```

也可以调用 `useQuery` 多次，这也很好，但缺点是不能动态控制请求并发的数量。

```ts
// 基于ids并发请求，可以动态控制请求数量
const ids = [1, 2, 3];
const combinedQueries = useQueries({
  queries: ids.map((id) => ({
    queryKey: ["post", id],
    queryFn: () => fetchPost(id),
  })),
  combine: (results) => {
    return {
      data: results.map((result) => result.data),
      pending: results.some((result) => result.isPending),
    };
  },
});
```

如果你明确并发的请求之间存在逻辑关联，或者需要动态控制并发数量，更推荐使用 `useQueries`。

`useQueries` 的 `queries` 参数是一个数组，数组里的每一项都是一个 `useQuery` 的配置对象。

基于 `combine` 可以实现更复杂的聚合逻辑。

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
