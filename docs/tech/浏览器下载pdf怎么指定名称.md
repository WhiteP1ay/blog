# 浏览器下载 pdf 怎么指定名称

通常在下载附件的时候我们通过 a 标签的 `download` 属性来设置文件名。但如果直接通过`window.open()`打开 pdf 链接，下载的文件名就变得不可控。

## 解决方案

其实可以在服务端通过设置响应头来指定文件名  
关键在

`'Content-Disposition': 'attachment; filename="example.pdf"'`

```js
// 注意：这是next.js的服务端代码
export async function GET() {
  const url = "https:xxx.pdf";
  const response = await fetch(url);
  const blob = await response.blob();

  // 设置所需的响应头
  const headers = {
    "Content-Type": "application/pdf",
    "Content-Disposition": 'inline; filename="example.pdf"',
  };

  return new Response(blob, { headers });
}
```

## 两个知识点

1. 关于 `Content-Disposition`

`inline` 可以让浏览器打开预览该 pdf，`attachment` 则会触发浏览器的另存。

```
Content-Disposition: inline
Content-Disposition: attachment
Content-Disposition: attachment; filename="filename.jpg"

```

2. 关于 `Response` 对象

一个在前端几乎不会用的 api，但在服务端的 js 却常用。

```
new Response(body, init)
```

具体见 https://developer.mozilla.org/zh-CN/docs/Web/API/Response/Response
