const cheerio = require('cheerio');
const Bagpipe = require('bagpipe');
const bagpipe = new Bagpipe(10, { timeout: 100 });
const Nightmare = require('nightmare');
const nightmare = Nightmare({ show: false });
const url = 'http://www.mangabz.com';
const downLoad = require('../../model/downLoad');
const mkdir = require('../../model/mkdir');
/**
 * 获取首页的api
 * http://localhost/api/home
*/
class mangabzApi {
    //获取首页html
    static getHomeHtml(req,res){
        nightmare
            .goto(url)
            .wait(200)
            .evaluate(() => document.querySelector("body").innerHTML)
            .then(htmlStr => {
                // res.send(getHome(htmlStr))
                res.send(mangabzApi.getHomeData(htmlStr))
            })
            .catch(error => {
                console.log(`报错了 - ${error}`);
            });
    }
    //获取首页data
    static getHomeData(res){
        let arr = [];
        let $ = cheerio.load(res);
        $('div a').each((index, item) => {
            if($(item).attr('title')&&$(item).find('img')){
                arr.push({
                    mh_id:$(item).attr('href').split('/')[1],
                    mh_tit:$(item).attr('title'),
                    mh_url:$(item).find('img').attr('src'),
                })
            }else{
                if($(item).find('img').attr('src')){
                    arr.push({
                        mh_id:$(item).attr('href').split('/')[1],
                        mh_tit:"",
                        mh_url:$(item).find('img').attr('src'),
                    })
                }else{
                    arr.push({
                        mh_id:$(item).attr('href').split('/')[1],
                        mh_tit:$(item).text(),
                        mh_url:"",
                    })
                }
            }
        });
        arr = arr.filter(item=>item.mh_id&&item.mh_id.includes('bz'));
        let filterArr = [];
        //数组查重，合并同类项
        arr.forEach(item=>{
            let filterIndex = filterArr.findIndex(v=>v.mh_id==item.mh_id);
            if(filterIndex<0){
                //没有重复的 添加一个item
                filterArr.push(item);
            }else{
                //有重复的 更新值
                if(filterArr[filterIndex].mh_tit&&!filterArr[filterIndex].mh_url){
                    filterArr[filterIndex].mh_url = item.mh_url
                }else if(filterArr[filterIndex].mh_url){
                    filterArr[filterIndex].mh_tit = item.mh_tit
                }
            }
        })
        return filterArr
    }
}

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

module.exports = {
    home(req, res) {
        mangabzApi.getHomeHtml(req,res);
    }
};