# Usage

```js

var src2qiniu = require('src2qiniu');

src2qiniu.init({
  accessKey:'blabla',
  secretKey:'blabla',
  bucket:'your-bucket'
});

src2qiniu.transfer('https://www.npmjs.org/static/img/npm.png',function(err,imgUrl){
  // imgUrl: http://{your-bucket}.qiniudn.com/{hash}
});

```