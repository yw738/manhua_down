/*图片下载*/
const Bagpipe = require('bagpipe');
const bagpipe = new Bagpipe(10,{timeout: 100});
const fs = require('fs');
const request = require("request");
let downloadPic = function (src, dest){//图片地址，图片保存路径
    request(src).pipe(fs.createWriteStream(dest)).on('close',function(){
        console.log('下载成功:',dest.split('/').reverse()[0])
    })
};
module.exports=downloadPic;