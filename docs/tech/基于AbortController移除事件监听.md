# 基于AbortController移除事件监听

记录一下，今天学到的基于AbortController移除事件监听。

## 经典方法

```js
EventTarget.removeEventListener()
```

把当初绑定事件的回调函数引用传给removeEventListener就可以移除事件监听。

这应该是最常见的处理方式了，缺点我觉得有两个：

1. 一下子移除多个事件有点麻烦,比如需要移除5个事件,要调用5次removeEventListener
2. addEventListener的时候不能快乐的使用箭头函数了，因为为了保持函数引用，通常要单独定义回调函数。

## 基于AbortController的方法

[addEventListener](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener) 注意看第三个参数options对象的signal，该属性接受AbortSignal。当`AbortSignal.abort()`方法调用时，监听器会被移除。

```js
const controller = new AbortController();

window.addEventListener('resize', listener, { signal: controller.signal });

controller.abort();
```

## AbortController的常规用法

[举个常规的取消请求的例子:](https://developer.mozilla.org/zh-CN/docs/Web/API/AbortController/signal)

```js
const controller = new AbortController();
const signal = controller.signal;

downloadBtn.addEventListener("click", fetchVideo);

abortBtn.addEventListener("click", () => {
  controller.abort();
  console.log("Download aborted");
});
```





