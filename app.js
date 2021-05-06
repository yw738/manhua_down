const express = require("express");
const app = express();
app.use(express.json()); //设置json解析
const myHost = require("./model/getIp"); //本机ip
const MIME = {
  js: "application/javascript",
  json: "application/json",
  html: "text/html",
  css: "text/css",
  gif: "image/gif", //图片 (无损耗压缩方面被PNG所替代)
  jpeg: "image/jpeg", //图片
  png: "image/png", //图片
  svg: "image/svg+xml", //(矢量图)
};
/**
 * express 设置全局响应头
 **/
app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", " 3.2.1");
  res.header("Content-Type", "application/json;charset=utf-8");
  res.type("html");
  for (let [label, value] of Object.entries(MIME)) {
    if (req.url.endsWith(label)) {
    //   console.log(label, MIME[label]);
      res.header("Content-Type", value);
      break;
    }
  }
  next();
});

const fzdmRoute = require("./routes/fzdmRoute"); //漫画
const pingccRouter = require("./routes/pingccRouter"); //漫画
const downRouter = require("./routes/downRouter"); //漫画
app.use(fzdmRoute);
app.use(pingccRouter);
app.use(downRouter);

app.use(express.static(__dirname + "/public"));

/**
 * 公共的全局变量
 */
global.globalData = {
  local: "http://localhost", //本项目的ip
};

const port = 80;

app.listen(port, function () {
  console.log("启动成功,请在chrome里面打开网页：");
  console.log("http://localhost:" + port);
//   console.log(`http://${myHost}:${port}`);
});
