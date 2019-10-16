const cheerio = require('cheerio');
const Bagpipe = require('bagpipe');
const bagpipe = new Bagpipe(10, { timeout: 100 });
const Nightmare = require('nightmare');
const nightmare = Nightmare({ show: true });
const url = 'https://manhua.fzdm.com';//风之动漫
const downLoad = require('../model/downLoad');
const mkdir = require('../model/mkdir');


let getHome = (res) => {
    let arr = [];
    let $ = cheerio.load(res);
    $('div.ItemSpecial a').each((index, item) => {
        let href = $(item).find('.img').attr('src');
        let title = $(item).find('.itemTitle').text();
        let id = $(item).attr('href').split('/').reverse()[0];
        if (href == 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7') {
            href = $(item).find('.img').attr('data-src')
        }
        let news = {
            href: href,
            title: title,
            id: id
        };
        arr.push(news);
    });
    return arr
};

let getList = (res) => {
    let arr = [];
    let $ = cheerio.load(res);
    let tit = $('#share .bds_more strong').text();
    $('li a').each((i, v) => {
        let id = $(v).attr('href').split('/')[0];
        let title = $(v).text();
        arr.push({
            id: id,
            title: title,
            tit: tit
        })
    });
    return arr
};

let n = 0;
let state = {
    id: '',
    arr: []
};
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
    let { id, detailId, res, tit } = json;
    let arr = [];
    let $ = cheerio.load(res);
    let img = $('img#mhpic').attr('src');
    let detailsTit = $('img#mhpic').attr('alt');
    let name = $('h1').text();
    let link = $('#mhimg0').find('a').attr('href');
    bagpipe.push(downLoad, img, `D:/Web/node/${tit}/${detailsTit}/${name}.jpg`, function (err, data) {
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
    let { id, detailId, link, tit } = json; /*id -- 漫画书id，id2 -- 漫画章节id*/
   
    let path;
    if (link) {
        path = `${url}/${id}/${detailId}/${link}`;
    } else {
        path = `${url}/${id}/${detailId}`;
    }
    nightmare
        .goto(path)
        .wait(100)
        .evaluate(() => document.querySelector("div#pjax-container").innerHTML)
        .then(htmlStr => {
            getDetails({
                id: id,
                detailId: detailId,
                tit: tit,
                res: htmlStr
            });
        })
        .catch(error => {
            console.log(`报错了 - ${error}`);
        });
};

const Api = {
    home(req, res) {
        let { type = 0, state = 1, page = 1 } = req || {};
        let path = `${url}/tag/${type}?state=${state}&page=${page}`;
        nightmare
            .goto(path)
            .wait(200)
            .evaluate(() => document.querySelector("div.bodyContent").innerHTML)
            .then(htmlStr => {
                // res.send(getHome(htmlStr))
                getHome(htmlStr)
            })
            .catch(error => {
                console.log(`报错了 - ${error}`);
            });
    },
    list(req, res) {
        let id = req.query.id;
        let path = `${url}/${id}/`;
        nightmare
            .goto(path)
            .wait(200)
            .evaluate(() => document.querySelector("div#content").innerHTML)
            .then(htmlSrc => {
                downManHua(id, getList(htmlSrc));//拿id 和 名字
            })
            .catch(error => {
                console.log(`报错了 - ${error}`);
            });
    },
};
module.exports = Api;