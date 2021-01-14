const cheerio = require('cheerio');
const Nightmare = require('nightmare');
const nightmare = Nightmare({ show: false });
const url = 'http://www.mangabz.com';
/**
 * 获取列表页的api
 * http://localhost/api/list?mhId=xx
 *  
 * @parmas mhId (漫画id)
*/
class mangabzApi {
    //获取列表html
    static getListHtml(req, res) {
        let { mhId } = req.query;
        const path = `${url}/${mhId}`;
        nightmare
            .goto(path)
            .wait(400)
            .evaluate(() => document.querySelector("body").innerHTML)
            .then(htmlStr => {
                res.send(mangabzApi.getListData(htmlStr,mhId))
            })
            .catch(error => {
                console.log(`报错了 - ${error}`);
            });
    }
    //获取列表数据data
    static getListData(res,mhId) {
        let arr = [];
        let $ = cheerio.load(res); 
        const mh_url = $('.detail-info-1 .detail-info').find('img').attr('src');
        const mh_tit = $('.detail-info-1 .detail-info-title').text().trim();
        const author = $('.detail-info-1 .detail-info-tip').find('span').eq(0).find('a').text();
        const is_over = $('.detail-info-1 .detail-info-tip').find('span').eq(1).find('span').text();
        const info = $('.container .detail-info-content').text().replace(/\n/ig, '').replace('[+展開]','').replace('[-折疊]','');
        const tag = [];
        $('.detail-info-1 .detail-info-tip').find('span').eq(3).find('.item').each((index, item) => {
            tag.push($(item).text())
        });
        $('#chapterlistload a').each((index, item) => {
            arr.push({
                mh_id: $(item).attr('href').split('/')[1],
                mh_tit: $(item).text().split("（")[0].trim(),
                mh_page_num: $(item).find('span').text().match(/[0-9]*/img).join(""),
            })
        });
        return {
            mh_url,
            mh_tit,
            mh_id:mhId,
            author,
            is_over,
            info,
            tag,
            data: arr,
        }
    }
}

module.exports = {
    list(req, res) {
        mangabzApi.getListHtml(req, res);
    }
};