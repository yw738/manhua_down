const fs=require('fs');
const dirCache={};
/**
 * 过滤不合法的文件名
*/
const setRegStr = (str="")=>str.replace(/<|>|\/|\\|\||\:|\*|\?|\"|/img,'').replace(/\s+/img,'');
/**
 * 创建文件夹
 * fs.existsSync 验证文件夹是否存在
 * 如果存在跳过，不存在的话就创建文件夹
 * @param {Array} filepath 路径数组，最大长度2
*/
let mkdir = (filepath=[]) => {
    let path = setRegStr(filepath[0]);
    let path2= setRegStr(filepath[1]);
    if(!fs.existsSync(`./../file`)){
        fs.mkdir(`./../file`, { recursive: true }, (err) => {
            if (err) throw err;
        });
    }
    if(!fs.existsSync(`./../file/${path}`)){
        fs.mkdir(`./../file/${path}`, { recursive: true }, (err) => {
            if (err) throw err;
        });
    }
    if(!fs.existsSync(`./../file/${path}/${path2}`)){
        fs.mkdir(`./../file/${path}/${path2}`, { recursive: true }, (err) => {
            if (err) throw err;
        });
    }
    
};
module.exports=mkdir;