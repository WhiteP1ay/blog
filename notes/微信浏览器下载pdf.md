# 在微信浏览器下载 pdf

做的 h5 需要下载功能,但万恶的微信浏览器在安卓端和 Ios 端对下载 Pdf 相同代码执行结果不一致.

## 安卓端

如果通过 js 下载 blob,然后再通过 a 标签触发下载,在安卓端会提示:'请打开浏览器下载',在浏览器中地址栏是 blob 地址,无法完成下载.
解决方法:

```js
window.open(url, "_blank");
```

## 苹果端

如果在苹果端直接 window.open 则会直接打开 pdf,而不是所谓的下载(所说本质也是下载)  
解决方式是通过 js 转 blob 的方式实现下载
解决方法:

```js
fetch(url)
  .then((res) => res.blob())
  .then((blobRes) => {
    // const blob = new Blob([blobRes]);
    // 解开这行能在ios_safari触发下载行为 ???
    const blob = blobRes;
    const url = URL.createObjectURL(blob);
    const aEl = document.createElement("a");
    aEl.href = url;
    aEl.download = `${title}.pdf`;
    aEl.target = "_blank";
    document.body.appendChild(aEl);
    aEl.click();
    document.body.removeChild(aEl);
    URL.revokeObjectURL(url);
  });
```