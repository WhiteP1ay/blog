# file.type的坑

在文件上传的时候，前端通过`<input type="file" />`的`change`事件回调，拿到file。再通过`file.type`获取文件的`mimetype`。基于`mimetype`来做文件的类型校验，来实现文件类型相关的功能。

但今天遇到的坑是：测试无论怎么上传都传不上去，提示文件类型错误。把文件传给我，我就可以正常上传。

## 解决思路

然后我为了定位问题，在上传前打印了一下`file`实例。发现测试电脑上传的文件`type`是空字符串。

既然知道问题在哪了，就好办了。

## 代码实现

```javascript
// 通过文件名获取扩展名
export default function getFileExtension(fileName) {
  return fileName ? fileName.split('.').pop() : undefined;
}

 const fileType = file.type;
 const fileExt = getFileExtension(file.name);

 const isAllowedMimeType = MIME_TYPES.includes(fileType);
 const isAllowedExt = FILE_EXT.includes(fileExt);

 const isNotAllowd = !isAllowedExt && !isAllowedMimeType;
 if (isNotAllowd) {
     ElMessage.error('附件格式不支持');
     uploadStatus.value = UPLOAD_STATUS.READY;
     // others
 }

```





