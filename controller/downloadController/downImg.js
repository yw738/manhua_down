const downLoad = require('../../model/downLoad')
const mkdir = require('../../model/mkdir')
const Bagpipe = require('bagpipe')
const bagpipe = new Bagpipe(10, { timeout: 1000 })
const axios = require('../../model/axios')
var ws = require('nodejs-websocket')

/**
 * 过滤不合法的文件名
 */
const setRegStr = (str = '') =>
    str.replace(/<|>|\/|\\|\||\:|\*|\?|\"|/gim, '').replace(/\s+/gim, '')
let progress = 0 //下载的总进度
let Socket = null //websocket 的 socket 用于推送进度

/**
 * websocket 推送下载进度
 */
ws.createServer(function(socket) {
    socket.on('connect', function(code) {
        console.log('开启连接', code)
    })
    socket.on('close', function(code) {
        console.log('关闭连接', code)
    })
    socket.on('error', function(code) {
        console.log('异常关闭', code)
    })

    // 事件名称为text(读取字符串时，就叫做text)，读取客户端传来的字符串
    socket.on('text', function(result) {
        console.log('收到的消息：', result)
    })
    Socket = socket
}).listen(8888)

// bagpipe.on('full', function (length) {
//     console.warn('底层系统处理不能及时完成，排队中，目前队列长度为:' + length);
// });
class DownClass {
    static title = '' //漫画名称
    static zj_tit = '' //章节名称
    static number = 0 //需要下载的总页数
    static downNum = 0 //已下载的页数

    /**
     * 单次下载图片（单话）
     * @param {object} req 参数
     * @param {function} res 回调
     * @param {string} id 章节id
     * @param {string} title 漫画名称
     * @param {string} zj_tit 章节名称
     */
    static downLoadAWorl(req, res = { send() {} }) {
        let { id, title, zj_tit } = req.query
        if (!id || !title || !zj_tit) {
            res.send({ code: 400, massage: '参数缺失！' })
            return
        }
        title = setRegStr(title)
        zj_tit = setRegStr(zj_tit)
        DownClass.title = title
        DownClass.zj_tit = zj_tit
        mkdir([title, zj_tit])
        let { down } = DownClass(({ title, zj_tit, res }) => {
            const url = `${global.globalData.local}/api/pingccApi/detail?chapterId=${id}`
            axios({ url: url })
                .then((response) => {
                    if (response.code == 1) {
                        res.send({ code: 400, massage: response.msg })
                        return
                    }
                    console.warn('开始下载=>', title, zj_tit)
                    res.send({ code: 200, massage: '下载成功！' })
                    let contentArr = response.data.data[0] || response.data.data
                    contentArr.content.forEach((item, index) => {
                        DownClass.number++

                            down({
                                img: item,
                                name: index + 1,
                                title,
                                zj_tit,
                            })
                    })
                })
                .catch(() => {
                    res.send({ code: 400, massage: '请求失败' })
                })
        })({ title, zj_tit, res })
    }

    /**
     * 批量下载图片（多话）
     * @param {object} req 参数
     * @param {function} res 回调
     * @param {array} arr 一个集合 包括章节id，章节名称
     * @param {string} title 漫画名称
     */
    static async downLoadAll(req, res) {
        let { arr, title } = req.body
        let { downLoadAWorl } = DownClass
        arr.forEach((item) => mkdir([title, item.title]))
        res.send({ code: 200, massage: '开始下载！' })
        for (let i = 0; i < arr.length; i++) {
            let json = Object.create(null)
            json = {
                query: {
                    id: arr[i].id,
                    title: title,
                    zj_tit: arr[i].title,
                },
            }
            await new Promise((resolve, reject) => {
                setTimeout(() => {
                    downLoadAWorl(json)
                    resolve()
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
        bagpipe.push(
            downLoad,
            img,
            `./file/${title}/${zj_tit}/${zj_tit}_${name}.jpg`,
            (name) => {
                DownClass.downNum++
                    progress = +((DownClass.downNum / DownClass.number) * 100) //进度
                console.log('下载成功:', name, '下载进度====>', progress + '%')
                let json = {
                    progress: progress,
                    allPage: DownClass.number,
                    downPage: DownClass.downNum,
                }
                if (Socket && Socket.sendText) {
                    Socket.sendText(JSON.stringify(json))
                }
                if (DownClass.downNum === DownClass.number) {
                    console.warn('全部下载完成！')
                    progress = 0
                    DownClass.downNum = 0
                    DownClass.number = 0
                    if (Socket && Socket.sendText) {
                        Socket.sendText(JSON.stringify({ message: '下载完成' }))
                    }
                }
            },
            function(err, cb) {
                /*批量下载*/
                //bagpipe 结束的回调函数
            }
        )
    }
}

module.exports = {
    //单话下载
    downLoadAWorl(req, res) {
        DownClass.downLoadAWorl(req, res)
    },
    //多话下载
    downLoadAll(req, res) {
        DownClass.downLoadAll(req, res)
    },
}