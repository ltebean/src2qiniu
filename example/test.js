var src2qiniu=require('../index.js');

src2qiniu.init({
  accessKey:'blabla',
  secretKey:'blabla',
  bucket:'your-bucket'
});

src2qiniu.transfer('https://www.npmjs.org/static/img/npm.png',function(err,imgUrl){
  // imgUrl: http://{your-bucket}.qiniudn.com/{hash}
})