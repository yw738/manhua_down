const express = require('express');
const cheerio = require('cheerio');
const superagent= require('superagent');
const Nightmare = require('nightmare');          // 自动化测试包，处理动态页面
const nightmare = Nightmare({ show: true });     // show:true  显示内置模拟浏览器
const app = express();

let path = 'https://www.kuaikanmanhua.com';



let server = app.listen(8881,function () {
    console.log('服务器启动');
});
let localNews = [];                              // 本地新闻

let getLocalNews = (res) => {
    let arr = [];
    let $ = cheerio.load(res);
    $('div.ItemSpecial a').each((index, item) => {
        let news = {
            href: $(item).find('.img').attr('src'),
            title:$(item).find('.itemTitle').text(),
            id:$(item).attr('href').split('/').reverse()[0]
        };
    arr.push(news);
    });
    return arr
};
let n = 1;

app.get('/', async (req, res, next) => {
    res.send({
        localNews: localNews,
    })
});
app.get('/list', async (req, res, next) => {
    list().then(response=>{
        res.send(response)
    })
});


/*分页*/
/*
* state 类别
* page 页码
* type 题材
* */
function list(data) {
    let {type = 0,state = 1,page = 1} = data || {};
    console.log(type,state,page);
    let path = `https://www.kuaikanmanhua.com/tag/${type}?state=${state}&page=${page}`;
    let p1 = new Promise((reject,resolve)=>{
        nightmare
            .goto(path)
            .wait("div.bodyContent")
            .evaluate(() => document.querySelector("div.bodyContent").innerHTML)
            .then(htmlStr => {
                localNews = getLocalNews(htmlStr);
                // list({
                //     page:n
                // });
                reject(getLocalNews(htmlStr))
            })
            .catch(error => {
                console.log(`报错了 - ${error}`);
                resolve(error)
            });
    });
    return p1;

}
function toDetail() {

}