# enabled

有时候我们希望query只在某个场景下进行。比如

```tsx
if(search){
  useQuery({
    queryKey: ['search',search],
    queryFn,
  })
}
```

但很明显，这违反了hook的设计规范，所以可以通过传入enable来解决。

```tsx
useQuery({
  queryKey: ['search',search],
  queryFn,
  enable: search
})
```



## 垃圾回收

如果一致缓存数据不释放会导致内存泄漏。所以垃圾回收机制很重要，尤其是低端设备上。

query默认垃圾回收时间 `gcTime` 是5分钟。但这不意味着缓存时间超过五分钟都会被清空。被回收的前提是过期数据且不再被引用。组件每次引用query管理的状态都会创建一个观察者，所以query也可以通过判断观察者数量是否为0来判断数据是否不再被引用。

## 轮询

```ts
useQuery({
  queryKey: ['list',{sort}],
  queryFn,
  refetchInterval: 5000 // 5 seconds 轮询
})
```

refetchInterval也可以是一个函数，想象这样一个场景：前端通过轮询来得知用户是否完成支付，用户一旦完成支付轮询就该停止。

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

示例：一个轮询，并展示最近更新时间

```ts
const { dataUpdatedAt} = useQuery(...)
```

