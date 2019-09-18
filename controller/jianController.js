const cheerio = require('cheerio');
const Bagpipe = require('bagpipe');
const bagpipe = new Bagpipe(10,{timeout: 100});
const Nightmare = require('nightmare'); // 自动化测试包，处理动态页面
const nightmare = Nightmare({ show: false}); // show:true  显示内置模拟浏览器

const downLoad = require('../model/downLoadTxt');

let getHome =(res)=> {
    let arr = [];
    let $ = cheerio.load(res);
    let title = $('div#main h2#title').text();
    let txt = $('div#main div#text').text();
    let bookId = $('a#next2').attr('href');
    txt = txt.replace(/\s+/g,'(cnm)');
    bagpipe.push(downLoad,(title + txt), title, function(err, data){
        /*批量下载*/
        if (bookId !== 'javascript:void(0);'){
            // init(bookId.split('#cmd=')[1]);
            init(bookId);
        }else{
            console.log('结束了');
        }
    });
    arr.push({
        title:title,
        txt:txt,
    });
    return arr
};
let init = (res)=>{
    let url = 'http://k.sogou.com/vrtc/detail?v=2&sid=00&uID=-&sgid=null&gf=evryw-d1-pls-i&md=7326372966761159892&id=18271272104708480846&cmd=7326372966761155252offset=2740&offset=2739&url=http://www.biququ.com/html/4822/60272740.html&nn=&finalChapter=true';
    url = url + res;
    nightmare
        .goto(url)
        .wait(100)
        .evaluate(() => document.querySelector("div.wrapper").innerHTML)
        .then(htmlStr => {
            getHome(htmlStr);
        })
        .catch(error => {
            console.log(`报错了 - ${error}`);
        });
};

const Api = {
    home(req,res){
        console.log('接口调用');
       init('7326372966761155250');
    },
};
module.exports = Api;