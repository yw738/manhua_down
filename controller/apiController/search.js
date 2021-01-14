const cheerio = require('cheerio');
const Nightmare = require('nightmare');
const nightmare = Nightmare({ show: false });
const url = 'http://www.mangabz.com';
/**
 * 检索接口
 * http://localhost/api/search?title=xxx&page=xx
 * 
 * @params title (关键字)
 * @params page (当前页码)
*/
class mangabzApi {
    //获取检索html
    static getSearchHtml(req, res) {
        let { title, page=1 } = req.query;
        const path = `${url}/search?title=${title}&page=${page}`;
        nightmare
            .goto(path)
            .wait(200)
            .evaluate(() => document.querySelector("body").innerHTML)
            .then(htmlStr => {
                res.send(mangabzApi.getSearchData(htmlStr))
            })
            .catch(error => {
                console.log(`报错了 - ${error}`);
            });
    }
    //获取检索数据data
    static getSearchData(res) {
        let arr = [];
        let $ = cheerio.load(res);
        const total = $('.result-title').html().match(/[0-9]+/img)[0];
        $('.container .mh-list li').each((index, item) => {
            arr.push({
                mh_id: $(item).find('.title a').attr('href').split('/')[1],
                mh_tit: $(item).find('.title a').attr('title'),
                mh_url: $(item).find('img').attr('src'),
            })
        });
        return {
            total,
            data: arr,
        }
    }
}

module.exports = {
    search(req, res) {
        mangabzApi.getSearchHtml(req, res);
    }
};