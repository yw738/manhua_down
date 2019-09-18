const cheerio = require('cheerio');
const Bagpipe = require('bagpipe');
const bagpipe = new Bagpipe(10, { timeout: 100 });
const Nightmare = require('nightmare');
const nightmare = Nightmare({ show: true });
const url = 'http://m.72qier.com/maoxian/shijie'; //72动漫
const downLoad = require('../model/downLoad');
const mkdir = require('../model/mkdir');



let downManHua = (id, arr) => {
    if (id && arr) {
        state.id = id;
        state.arr = arr;
        arr.forEach((v, i) => {
            mkdir(`${v.tit}/${v.title}`);
        });
    }
    if (n >= state.arr.length) {
        console.log('结束了');
        return
    }
    Details({
        id: state.id,
        detailId: state.arr[n].id,
        tit: state.arr[n].tit
    });
};
let getDetails = (json) => {
    let { id, res } = json;
    let arr = [];
    let $ = cheerio.load(res);
    let img = $('img#mhpic').attr('src');
    let detailsTit = $('img#mhpic').attr('alt');
    let name = $('h1').text();
    let link = $('#mhimg0').find('a').attr('href');
    bagpipe.push(downLoad, img, `D:/Web/node/${tit}/${detailsTit}/${name}.jpg`, function(err, data) {
        /*批量下载*/
        if (link) {
            Details({
                id: id,
                detailId: detailId,
                tit: tit,
                link: link
            });
            //id -- 漫画书id，id2 -- 漫画章节id，是否触发点击事件
        } else {
            console.log('结束了');
            n++;
            downManHua()
        }
    });
    arr.push(img);
    return arr
};
let Details = (json) => {
    let { id, page } = json;
    /*id -- 漫画书id，id2 -- 漫画章节id*/
    let path;
    if (page) {
        path = `${url}/${id}?p=${page}`;
    } else {
        path = `${url}/${id}`; //默认第一页
    }
    nightmare
        .goto(path)
        .wait(100)
        .evaluate(() => document.querySelector("div#pjax-container").innerHTML)
        .then(htmlStr => {
            getDetails({
                id: id,
                res: htmlStr
            });
        })
        .catch(error => {
            console.log(`报错了 - ${error}`);
        });
};

const Api = {
    home(req, res) {
        Details({
            id: '497416.html',
        })
    },
    list(req, res) {

    },
};
module.exports = Api;