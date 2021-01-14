/**
 * 图片下载到本地
 */
const fs = require('fs');
const request = require("request");
/**
 * @param {string} src  图片地址
 * @param {string} dest 图片保存路径
 * @param {Function} callback 回调函数
*/
let downloadPic = function (src, dest,callback){//图片地址，图片保存路径
    request(src).pipe(fs.createWriteStream(dest)).on('close',function(){
        // console.log('下载成功:',dest.split('/').reverse()[0])
        callback(dest.split('/').reverse()[0]);//
    })
};
module.exports=downloadPic;