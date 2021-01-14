const cheerio = require('cheerio');
const { response } = require('express');
const Nightmare = require('nightmare');
const nightmare = Nightmare({ show: false });
const url = 'http://www.mangabz.com';
/**
 * 获取漫画详情
 * 请求20页大概花了32s
 * http://localhost/api/detail?zjId=m102849
 * 
 * @parmas zjId (章节id)
*/
class mangabzApi {
    static mhArr = [];//漫画详情页合集
    static pageNum = 1;//该章节总页数
    static zjId = "";//章节id
    static zjTit = "";//章节标题
    static pId = "";//章节父级id
    //获取详情html
    static async getDetailHtml(req, res) {
        let { zjId } = req.query;
        mangabzApi.zjId = zjId;
        try {
            await mangabzApi.getData({ zjId });
            await mangabzApi.getAllData().catch(err => console.log(err))
            let arr = mangabzApi.mhArr.sort((m, n) => m.num - n.num);
            res.send({
                message: '请求成功',
                code: 200,
                data: arr,
                zj_tit: mangabzApi.zjTit,
                zj_id: zjId,
                p_id: mangabzApi.pId
            })
        } catch (error) {
            res.send({
                message: '服务出错,请稍后重试！',
                code: 500
            })
        }
        mangabzApi.cancel();
    }
    //获取页数总数 和 第一页的数据 和 title
    static getPageNum(res) {
        let $ = cheerio.load(res);
        const num = $('.bottom-bar-tool .bottom-page2').text().replace(/\s*/img, "").split("-")[1];
        const url_1 = $('#cp_image').attr("src")
        const zjTit = $('.top-title').text().trim();
        const pId = $('.top-title a').attr('href').split("/")[1];
        mangabzApi.zjTit = zjTit;
        mangabzApi.pId = pId
        return {
            num,
            url_1,
        }
    }
    //获取当前页的数据
    static getPage(res) {
        let $ = cheerio.load(res);
        const url_1 = $('#cp_image').attr("src")
        return {
            url_1
        }
    }
    //获取详情数据data
    /**
     * 获取详情的总页数，再根据总页数进行轮循获取所有的url
     * 第一次查总页数和第一页的url，第二次以后只查url
     * pageNum 页码
     * zjId 章节id
    */
    static getData({ zjId, pageNum = 1 }) {
        const path = `${url}/${zjId}/#ipg${pageNum}`;
        return new Promise((response, reject) => {
            nightmare
                .goto(path)
                .wait("#cp_image")
                .evaluate(() => document.querySelector("body").innerHTML)
                .then(htmlStr => {
                    if (pageNum === 1) {
                        //pageNum 等于1 的时候，调用，获取“当页的页码”和“当页的详情数据”
                        let { num, url_1 } = mangabzApi.getPageNum(htmlStr);
                        mangabzApi.mhArr.push({
                            num: pageNum,
                            img_url: url_1
                        });
                        mangabzApi.pageNum = Number(num);
                    } else {
                        //pageNum 不等于1 的时候，调用，只获取“当页的详情数据”
                        let { url_1: img_url } = mangabzApi.getPage(htmlStr);
                        mangabzApi.mhArr.push({
                            num: pageNum,
                            img_url: img_url
                        });
                    }
                    console.log(`${mangabzApi.zjTit}=>${pageNum} / ${mangabzApi.pageNum}。抓取成功!`);
                    response();
                })
                .catch(error => {
                    console.log(`报错了 - ${error}`);
                    reject();
                });
        })
    }
    /**
     * 通过页码，进行继发轮询来获取每一页的数据（并发要崩）
    */
    static async getAllData() {
        let { pageNum, getData, zjId } = mangabzApi;
        for (let i = 0; i < Number(pageNum); i++) {
            if (i > 0) {
                try {
                    await getData({
                        zjId,
                        pageNum: i + 1
                    })
                } catch (err) {
                    console.log(`抓取失败。即将进行二次抓取,当前抓取是第${i + 1}页。`);
                    await getData({
                        zjId,
                        pageNum: i + 1
                    })
                }
            }
        }
        console.log(`操作结束！`);
        return {}
    }
    /**
     * 接口请求过后，数据初始化
    */
    static cancel() {
        mangabzApi.mhArr = [];
        mangabzApi.pageNum = 1;
        mangabzApi.zjId = "";
        mangabzApi.zjTit = "";
        mangabzApi.pId = "";
    }
}

module.exports = {
    detail(req, res) {
        mangabzApi.getDetailHtml(req, res);
    }
};