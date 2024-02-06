# compatibility
在网页开发过程中常常需要适配ios/android的webview和万恶的微信内置浏览器，所以在这里记录一些coding中碰到的兼容性问题。  
### safari全系不支持requestIdleCallback
无论是mac还是iphone，都不支持requestIdleCallback Api。

