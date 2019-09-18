//创建文件夹
var fs=require('fs');


//1.异步

fs.mkdir("./第一个目录",function(err){

    if (err) {
        return console.error(err);
    }

    console.log("第一个目录目录创建成功。");

    fs.mkdir("./第一个目录/test1",function(err){

        if (err) {

            return console.error(err);

        }

        console.log("test1目录创建成功。");

    });
    fs.mkdir("./第一个目录/test2",function(err){

        if (err) {

            return console.error(err);

        }

        console.log("test2目录创建成功。");

    });

});

console.log("创建目录 /第一个目录/test");

//2.同步

fs.mkdirSync("./第二个目录");

fs.mkdirSync("./第二个目录/test");