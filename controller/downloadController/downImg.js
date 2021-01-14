const downLoad = require('../../model/downLoad');
const mkdir = require('../../model/mkdir');
const Bagpipe = require('bagpipe');
const bagpipe = new Bagpipe(10, { timeout: 1000 });
const axios = require('../../model/axios');

// bagpipe.on('full', function (length) {
//     console.warn('底层系统处理不能及时完成，排队中，目前队列长度为:' + length);
// });
class DownClass {
    static title = '';//漫画名称
    static zj_tit = '';//章节名称
    /**
     * 单次下载图片（单话）
     * @param {object} req 参数
     * @param {function} res 回调
    */
    static downLoadAWorl(req, res = { send() { } }) {
        let { id, title, zj_tit } = req.query;
        if (!id || !title || !zj_tit) {
            res.send({ code: 400, massage: '参数不正确！' });
            return;
        }
        DownClass.title = title;
        DownClass.zj_tit = zj_tit;
        mkdir([title, zj_tit]);
        let { down } = DownClass;
        (({ title, zj_tit, res }) => {
            axios({
                url: `${global.globalData.local}/api/pingccApi/detail?chapterId=${id}`,
            }).then(response => {
                if (response.code == 1) {
                    res.send({ code: 400, massage: response.msg });
                    return
                }
                console.warn('开始下载=>', title, zj_tit);
                res.send({ code: 200, massage: '下载成功！' });
                response.data.data[0].content.forEach((item, index) => {
                    down({
                        img: item,
                        name: index + 1,
                        title,
                        zj_tit
                    });
                });
            }).catch(() => {
                res.send({ code: 400, massage: '请求失败' });
            })
        })({ title, zj_tit, res })
    }
    /**
     * 批量下载图片（多话）
     * @param {object} req 参数
     * @param {function} res 回调
    */
    static async downLoadAll(req, res) {
        let { arr, title } = req.body;
        let { downLoadAWorl } = DownClass;
        arr.forEach(item => mkdir([title, item.title]));
        res.send({ code: 200, massage: '开始下载！' });
        for (let i = 0; i < arr.length; i++) {
            let json = Object.create(null);
            json = {
                query: {
                    id: arr[i].id,
                    title: title,
                    zj_tit: arr[i].title,
                }
            }
            await new Promise((resolve, reject) => {
                setTimeout(() => {
                    downLoadAWorl(json)
                    resolve();
                }, 600)
            })
        }
        // console.warn('下载成功！！！')
    }
    /**
     * @param {string} img 图片路径
     * @param {string} name 漫画详情名称
     * @param {string} title 漫画名称
     * @param {string} zj_tit 漫画章节名称
    */
    static down({ img, name, title, zj_tit }) {
        // console.warn('底层系统处理不能及时完成，排队中，目前队列长度为:',bagpipe.queue.length);
        bagpipe.push(downLoad, img, `./file/${title}/${zj_tit}/${zj_tit}_${name}.jpg`, (name) => {
            console.log('下载成功:', name);
            //downLoad 结束的回调函数
        }, function (err, cb) {
            /*批量下载*/
            //bagpipe 结束的回调函数
        });
    }
}

module.exports = {
    downLoadAWorl(req, res) {
        DownClass.downLoadAWorl(req, res);
    },
    downLoadAll(req, res) {
        DownClass.downLoadAll(req, res);
    },
};