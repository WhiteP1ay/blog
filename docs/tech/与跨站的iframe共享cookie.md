# 与跨站的iframe共享cookie

先说背景：我们有一个老项目，已经有非常多的模块了，且技术栈比较老旧，维护起来很困难。

所以我打算把一部分老项目的页面迁移到新项目里去写。再通过iframe的方式集成在一起。

## 遇到的问题

了解到该项目对安全性要求不是非常高，我在引入iframe时直接把token放到src里做querystring。然后新项目从url里拿到token，再存储到cookie里。这样就实现了登录状态的同步。

但随着新项目部署到测试环境我发现新项目的接口请求都没有通过鉴权。

这个项目的鉴权是基于cookie的，而iframe里发的请求都没携带cookie。

## 排查过程

因为跨站了，所以cookie没共享。也正是因为跨站了，浏览器的[同源策略](https://developer.mozilla.org/zh-CN/docs/Web/Security/Same-origin_policy)限制导致新项目在iframe里发请求都无法携带第三方cookie。

## 解决方案

不让带cookie但是可以在请求头里自定义其他字段。

我在请求头里添加了一个自定义字段，然后在nginx转发的时候把字段名改成`Cookie`，实现身份伪装达成登录状态同步。

但感觉方案不是特别好。

## Why not

1. 为什么不在新项目里自己发请求获取token再`set-cookie`？因为这样会导致老项目登录状态被挤掉。
2. 为什么不同源部署？因为奇怪且头疼的原因，沟通成本比较高。

# 资料分享

翻译总结一下外网资料：

还有一种方式（或者说是真正正确的方式）是set-cookie时如此操作

```
Set-Cookie: session=your_session; SameSite=None; Secure 
```

**原理**

Cookie的domain和网站的domain一致称为第一方Cookie,不一致称为第三方Cookie。长期以来二者作用相同，发请求时会被携带。但这样有一些缺点：

- [CSRF，跨站伪造攻击](https://owasp.org/www-community/attacks/csrf)
- 在请求头里添加大量无用的内容
- 被恶意用于追踪用户在多个站点的活动

所以后来Cookie被添加了一个新的属性，`SameSite`，此属性允许您声明您的cookie是否应限制在第一方或同站上下文中。可能的值：

`None`：Cookie也会在第三方上下文中发送。

`Strict`：只有在第一方上下文中（当浏览器URL栏中的域名与您的cookie域名匹配时）才会发送cookie。

`Lax`：cookie将在第一方上下文中发送，并且也会随顶级导航一起发送。

浏览器的默认行为发生改变，过去默认值是`None`，现在是`Lax`，如果想设定为`None`还需要在安全的上下文中。即`https`。

除此之外还需要`set-cookie`时设定`Secure`属性，目的是防止cookie因明文传输而被未经授权的各方观察到。

因此，除了`SameSite=None`和`Secure`之外，Iframe内部使用的URL必须是以https开头的安全URL。



