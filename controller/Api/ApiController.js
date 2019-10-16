const cheerio = require('cheerio');
const Bagpipe = require('bagpipe');
const bagpipe = new Bagpipe(10, { timeout: 100 });
const Nightmare = require('nightmare');
const nightmare = Nightmare({ show: true });
const url = 'https://www.manhuaniu.com';
const apiModel = require("../../model/ApiModel");
let { addDetailDb } = apiModel;

let arr = [];//待爬取的章节列表
let page = 1;//爬取的当前页码

let getHome = (res) => {
    let arr = [];
    let $ = cheerio.load(res);
    $('li').each((index, item) => {
        let href = $(item).find('.ImgA').attr('href');
        let titImg = $(item).find('.ImgA').find('img').attr('src');
        let tit = $(item).find('.txtA').text();
        let new_zj = $(item).find('.info').text();
        // let id = $(item).attr('href').split('/').reverse()[0];
        arr.push({
            href: href,
            titImg: titImg,
            tit: tit,
            new_zj: new_zj
        });
        // apiModel.add({
        //     href: href,
        //     titImg: titImg,
        //     tit: tit,
        //     new_zj: new_zj
        // }, (err, data) => '');
    });
    return arr;
};

let getList = (json) => {
    let { parentId } = json;//漫画id
    let path = `${url}/manhua/${parentId}/`;
    let p1 = new Promise((resolve) => {
        nightmare
            .goto(path)
            .wait(100)
            .evaluate(() => document.querySelector("div.comic-view").innerHTML)
            .then(htmlStr => {
                let $ = cheerio.load(htmlStr);
                let parentTit = $('.book-title h1 span').text();
                let tips = $('#intro-cut p').text().trim();
                let isEnd = $(".status a").eq(0).text();
                let gx_time = $(".status .red").text();
                let author = $(".detail-list li").eq(1).find("span").eq(1).find("a").text();
                let img = $(".cover .pic").attr("src");
                let c_type = $(".detail-list li").eq(1).find("span").eq(0).find("a").eq(0).text();
                let listType = $(".detail-list li").eq(0).find("span").eq(1).find("a").text();
                apiModel.updated({
                    mh_id: parentId,
                    title: parentTit,
                    tips: tips,
                    isEnd: isEnd,
                    gx_time: gx_time,
                    author: author,
                    img: img,
                    c_type: c_type,
                    listType: listType,
                })
                $('#chapter-list-1 li').each((index, item) => {
                    let list_id = $(item).find('a').attr('href').split("/").reverse()[0].split(".")[0];
                    let title = $(item).find('a span').text();
                    apiModel.addList({
                        parentId: parentId,
                        parentTit: parentTit,
                        list_id: list_id,
                        title: title
                    });
                    console.log('图书列表入库:', parentTit, '--', title);
                    arr.push({
                        parentId: parentId,
                        list_id: list_id,
                    });
                });
                resolve(arr);
            })
            .catch(error => {
                console.log(`报错了 - ${error}`);
            });
    })
    p1.then(arr => {
        let { parentId, list_id } = arr[0];
        reDetail();
        console.log('开始');
    })
};
let reDetail = (index = 0) => {
    page = 1;
    if (index + 1 > arr.length) {
        console.log('结束');
        return false;
    } else {
        let { parentId, list_id } = arr[index];
        index++;
        Details({
            parentId: parentId,
            list_id: list_id,
            index: index
        });

    }
}
let Details = async (json = {}) => {
    let { parentId, list_id, index } = json;
    let path = `${url}/manhua/${parentId}/${list_id}.html?p=${page}`;
    nightmare
        .goto(path)
        .wait(150)
        .evaluate(() => document.querySelector("#tbCenter").innerHTML)
        .then(htmlStr => {
            let $ = cheerio.load(htmlStr);
            let imgUrl = $("#images").find("img").attr("src");
            let str = $("#images").find(".img_info").text();
            if (str == "") {
                //读取当前页码失败，重新再请求一次。
                Details({
                    parentId: parentId,
                    list_id: list_id,
                    index: index
                });
                return false;
            }
            let ifPage = str.split("(")[1].split(")")[0].split("/")[1];
            if (page >= parseInt(ifPage)) {
                //章节完成
                console.log(list_id, '章节结束', " 开始下一章。");
                reDetail(parseInt(index));
            } else {
                addDetailDb({
                    imgUrl: imgUrl,
                    parentId: list_id,
                    page: page
                });
                console.log('图片:', page, '---', imgUrl);
                page++;
                Details({
                    parentId: parentId,
                    list_id: list_id,
                    index: index
                });
            }
        })
        .catch(error => {
            console.log(`报错了 - ${error}`);
        });
};
const Api = {
    home(req, res) {
        nightmare
            .goto(url)
            .wait(200)
            .evaluate(() => document.querySelector("#listbody").innerHTML)
            .then(htmlStr => {
                res.send(getHome(htmlStr));
            })
            .catch(error => {
                console.log(`报错了 - ${error}`);
            });
    },
   
    list(req, res) {
         //通过漫画id 来爬取漫画
        let { query: { id } } = req;
        getList({
            parentId: id
        });
        //一人之下 - 10660
    },
};

// 通过 漫画id 来获取整本漫画。
module.exports = Api;