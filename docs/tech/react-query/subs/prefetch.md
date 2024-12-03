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