//mkdir.js
const fs=require('fs');
const dirCache={};
//filepath --->  path1 / path2

let mkdir = (filepath) => {
    let arr = filepath.split('/');
    let path = arr[0];
    let path2= arr[1];
    fs.exists(`D:/Web/node/${path}`, function(exists) {
        if (!exists){
            fs.mkdir(`D:/Web/node/${path}`, (error) => {
                if (error) {
                    console.log(error);
                }
            })
        }
    });
    fs.exists(`D:/Web/node/${path}/${path2}`, function(exists) {
        if (!exists){
            fs.mkdir(`D:/Web/node/${path}/${path2}`, (error) => {
                if (error) {
                    console.log(error);
                }
            })
        }
    });
};
module.exports=mkdir;