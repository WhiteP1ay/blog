# 预加载 prefetch

预加载是指，基于某种条件，提前请求数据。

预加载的好处是可以减少用户等待时间，提升用户体验。

## 基于 query 的预加载实现

假设有一个书籍列表，展示了书名，点击某个书名会进入详情页查看书的简介和评论列表。

通常我们会这么实现：

1. 点击列表项，进入详情页。
2. 详情页请求数据，展示数据。
3. 用户点击返回按钮，返回列表页，为了保证列表页数据是最新的，需要重新请求数据。
4. 用户再次点击列表项，进入详情页，再次请求数据。

这种实现方案的缺点是用户体验比较差，我想到至少两个优化点

1. 如果对数据实时性要求没有特别高的话，请求过的详情页和列表页可以缓存起来，不需要每次都重新请求。
2. 当用户鼠标悬浮在列表项上时，可以预先请求数据，等用户点击列表项时，数据已经请求回来并放到缓存中，这样就减少了用户的等待时间。

缓存前文已经说过了，query 提供开箱即用的缓存管理。

至于预加载的实现，query 提供了`prefetchQuery`方法。

示例代码如下，值得关注的是这里通过`onMouseEnter`事件来触发预加载，通过`useQueryClient`来获取`queryClient.prefetchQuery`方法：

```tsx
import { useQueryClient } from "@tanstack/react-query";

const queryClient = useQueryClient();

...some tsx...
<li onMouseEnter={() => {
  queryClient.prefetchQuery({
      queryKey: ["book", id],
      queryFn: () => fetchBookDetail(id),
      staleTime: 60 * 1000, //避免过于频繁的网络请求
    });
  }}
>
```

> 为`prefetchQuery`提供`staleTime`参数，它表示缓存数据的有效时间。这有效避免了过于频繁的网络请求。

## 占位符

预加载并不是银弹，它并不能完全消除用户的等待时间，它只能减少用户的等待时间。

假设用户手速特别快，在预加载完成之前就已经进入详情页，那么还是会有等待时间。

如果网络请求没有响应，详情页只能展示一个大大的 loading 吗？

当然不，在列表时我们已经得知了一些基本数据，比如书名。那么详情页可以先展示书名。query 提供了`placeholderData`参数，可以设置占位符数据。

`queryClient`提供了`getQueryData`方法，可以获取缓存数据。

注意`getQueryData`的 queryKey 是`['book']`，没有`id`。因为我们想获取的是列表页的缓存数据，列表页的 queryKey 是`['book']`。

```tsx
const useBookDetail = (id: number) => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ["book", id],
    queryFn: () => fetchBookDetail(id),
    placeholderData: () => {
      const data =
        (queryClient.getQueryData(["book"]) as { id: number }[]).find(
          (item) => item.id === id
        ) ?? undefined;
      return data as Book;
    },
  });
};
```

## 完整示例

```tsx
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchBooks, fetchBookDetail, Book } from "../api/book";

type PropsType = {
  id: number;
  setBookId: (id: number | undefined) => void;
};

const useBookDetail = (id: number) => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ["book", id],
    queryFn: () => fetchBookDetail(id),
    placeholderData: () => {
      const data =
        (queryClient.getQueryData(["book"]) as { id: number }[]).find(
          (item) => item.id === id
        ) ?? undefined;
      return data as Book;
    },
  });
};

const BookDetail = ({ id, setBookId }: PropsType) => {
  // isPlaceHolderData 更准确的指示器
  const { data, isPlaceholderData } = useBookDetail(id);
  return (
    <div>
      <button onClick={() => setBookId(undefined)}>back</button>
      {isPlaceholderData ? (
        <>
          <h1>{data?.title}</h1>
          <p>loading...</p>
        </>
      ) : (
        <>
          <h1>{data?.title}</h1>
          <p>author: {data?.author}</p>
          <p>description: {data?.description}</p>
        </>
      )}
    </div>
  );
};

const useBookList = () => {
  return useQuery({ queryKey: ["book"], queryFn: fetchBooks });
};

const BookList = ({ setBookId }: { setBookId: (id: number) => void }) => {
  const { data, isLoading } = useBookList();
  const queryClient = useQueryClient();

  const handlePrefetch = (id: number) => {
    queryClient.prefetchQuery({
      queryKey: ["book", id],
      queryFn: () => fetchBookDetail(id),
      staleTime: 60 * 1000, //避免过于频繁的网络请求
    });
  };

  if (isLoading) {
    return <p>loading</p>;
  }
  return data?.map((item) => (
    <div
      onClick={() => setBookId(item.id)}
      onMouseEnter={() => handlePrefetch(item.id)}
    >
      {item.title}
    </div>
  ));
};

const BookApp = () => {
  const [bookId, setBookId] = useState<number | undefined>(undefined);

  return (
    <>
      {bookId ? (
        <BookDetail id={bookId} setBookId={setBookId} />
      ) : (
        <BookList setBookId={setBookId} />
      )}
    </>
  );
};

export default BookApp;
```
