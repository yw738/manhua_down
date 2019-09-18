const Bagpipe = require('bagpipe');
const bagpipe = new Bagpipe(10,{timeout: 100});
const fs = require('fs');
const request = require("request");
let downloadTxt = function (src, dest){//图片地址，图片保存路径
    fs.appendFile('message.doc', src, 'utf8', function(){
        console.log('下载成功:',dest)
    });
};
module.exports=downloadTxt;