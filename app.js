const express = require('express');
const app = express();
app.use(express.json());//设置json解析 
/**
 * express 设置全局响应头
 **/
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    res.type('html');
    next();
});

const fzdmRoute = require('./routes/fzdmRoute'); //漫画
const pingccRouter = require('./routes/pingccRouter'); //漫画
const downRouter = require('./routes/downRouter'); //漫画
app.use(fzdmRoute);
app.use(pingccRouter);
app.use(downRouter);

app.use(express.static(__dirname + '/public'));

/**
 * 公共的全局变量
*/
global.globalData = {
    local: 'http://localhost',//本项目的ip

}

app.listen(80, function () {
    console.log('启动成功');
});

// var ws = require('nodejs-websocket');
// var server = ws.createServer(function(socket){
// // 事件名称为text(读取字符串时，就叫做text)，读取客户端传来的字符串
// 　  var count = 1;
//     socket.on('text', function(str) {
// 　　     // 在控制台输出前端传来的消息　　
//         console.log(str);
//         //向前端回复消息
//         socket.sendText('服务器端收到客户端端发来的消息了！' + count++);
//     });
// }).listen(3000); 