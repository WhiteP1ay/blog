# 预加载 prefetch

预加载可以减少用户等待时间，提升用户体验。

## 基于 query 的预加载实现

想象有一个列表，点击列表项会进入详情页，如果每次进入详情页都重新请求数据，那么就会有一个明显的等待时间。

开发者可以假设当用户鼠标悬停在列表项上代表用户想要进入该详情页，即在列表项触发`onMouseEnter`事件时发送网络请求。

当进入详情页时，数据已经请求回来并放到缓存中，详情页只需要从缓存中读取数据，这样就减少了用户的等待时间。

query 提供了`prefetchQuery`方法，可以预先请求数据。

示例代码如下：

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

值得注意的是`prefetchQuery`的`staleTime`参数，它表示缓存数据在获取新数据之前仍然有效的时间。这有效避免了过于频繁的网络请求。

## 占位符

预加载并不是银弹，它并不能完全消除用户的等待时间，它只能减少用户的等待时间。

假设用户手速特别快，在预加载完成之前就已经进入详情页，那么还是会有等待时间。如果网络请求没有响应，详情页只能展示一个大大的 loading，吗？

当然不，在列表时我们已经得知了一些基本数据，比如书名。那么详情页可以先展示书名。query 提供了`placeholderData`参数，可以设置占位符数据。

queryClient 提供了`getQueryData`方法，可以获取缓存数据。

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
