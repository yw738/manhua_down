const cheerio = require('cheerio');
const Bagpipe = require('bagpipe');
const bagpipe = new Bagpipe(10,{timeout: 100});
const Nightmare = require('nightmare'); // 自动化测试包，处理动态页面
const nightmare = Nightmare({ show: true }); // show:true  显示内置模拟浏览器
const url = 'https://www.kuaikanmanhua.com';
const downLoad = require('../model/downLoad');

let getHome =(res)=> {
    let arr = [];
    let $ = cheerio.load(res);
    $('div.ItemSpecial a').each((index, item) => {
        let href = $(item).find('.img').attr('src');
        let title = $(item).find('.itemTitle').text();
        let id = $(item).attr('href').split('/').reverse()[0];
        if (href == 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'){
            href = $(item).find('.img').attr('data-src')
        }
        let news = {
            href:href ,
            title:title,
            id:id
        };
        arr.push(news);
    });
    return arr
};
let getList=(res)=>{
    let arr = [];
    let json = {};
    let $ = cheerio.load(res);
    json.titImg=$('.TopicList .imgCover').attr('src');
    json.titName=$('.TopicList .title').text();
    json.titTips=$('.TopicList .detailsBox p').text();
    json.titHeat=$('.TopicList .btnListRight .heat').text();
    json.titLaud=$('.TopicList .btnListRight .laud').text();
    $('.TopicList .TopicItem').each((i,v)=>{
        let img = $(v).find('.cover a .imgCover').attr('src');
        let id = $(v).find('.cover a').attr('href').split('/').reverse()[0];
        let title = $(v).find('.title a span ').text();
        let date = $(v).find('.date span ').text();
        if (img == 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'){
            img = $(v).find('.cover a .imgCover').attr('data-src');
        }
        arr.push({
            img:img,
            id:id,
            title:title,
            date:date,
        })
    });
    json.data=arr;
    return json
};
let getDetails=(res)=>{
    let arr = [];
    let $ = cheerio.load(res);
    $('.imgList img').each((i,v)=>{
        let img = $(v).attr('src');
        if (img == 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'){
            img = $(v).attr('data-src');
        }
        bagpipe.push(downLoad,img, `D:/Web/node/img/${i}.jpg`, function(err, data){
           /*批量下载*/
        });
        arr.push(img)
    });
    return arr
 };
const Api = {
    /*获取列表 分页*/
    /*
     * state 类别
     * page 页码
     * type 题材
     * */
    home(req,res){
        let {type = 0,state = 1,page = 1} = req || {};
        let path = `${url}/tag/${type}?state=${state}&page=${page}`;
        nightmare
            .goto(path)
            .wait(200)
            .evaluate(() => document.querySelector("div.bodyContent").innerHTML)
            .then(htmlStr => {
                res.send(getHome(htmlStr))
            })
            .catch(error => {
                console.log(`报错了 - ${error}`);
            });
    },
    list(req,res){
        let path = `${url}/web/topic/${req.query.id}/`;
            nightmare
                .goto(path)
                .wait(200)
                .evaluate(() => document.querySelector("div.contentBox").innerHTML)
                .then(htmlSrc => {
                    res.send(getList(htmlSrc))
                })
                .catch(error => {
                    console.log(`报错了 - ${error}`);
                });
    },
    details(req,res){
        let id = req.query.id;
        let path = `${url}/web/comic/${id}/`;
        nightmare
            .goto(path)
            .wait(200)
            .evaluate(() => document.querySelector("div.comicDetails").innerHTML)
            .then(htmlStr => {
                res.send(getDetails(htmlStr))
            })
            .catch(error => {
                console.log(`报错了 - ${error}`);
            });
    }
};
module.exports = Api;