const axios = require('./../model/axios.js')
const URL = `http://api.pingcc.cn`

/**
 * 对URL的接口进行转发
 */
class Api {
    /**
     * 查询
     * @param {string} option 选择搜索项，标题：title ， 作者 ：author ，分类：cartoonType
     * @param {string} key 搜索关键字，默认是模糊分词搜索
     * @param {string} from 当前页数，留空默认1，填0为完全匹配搜索。
     * @param {string} size 一页显示的数量，留空默认10，最多100。配合from为0可最多返回100条精确数据。
     * encodeURIComponent(userName)
     * decodeURIComponent(userName)
     */
    static search(req, res) {
        let { option = 'title', key = ' ', from = 1, size = 10 } = req.query
        let str = Boolean(encodeURIComponent(key)) ?
            encodeURIComponent(key) :
            '%20'
        const url = `${URL}/comic/search/${option}/${str}/${+from}/${+size}`
        axios({ url }).then((response) => res.send(response))
    }

    /**
     * 获取列表
     * @param {string} cartoonId 通过漫画搜索API获取到cartoonId
     * http://api.pingcc.cn/cartoonChapter/search/2yirenzhixia
     */
    static getList(req, res) {
        let { cartoonId = '' } = req.query
        const url = `${URL}/comicChapter/search/${cartoonId}`
        axios({ url }).then((response) => res.send(response))
    }

    /**
     * 获取详情列表
     * @param {string} chapterId 通过漫画章节API获取chapterId
     * https://api.pingcc.cn/comicContent/search/{chapterId}
     */
    static getDetail(req, res) {
        let { chapterId = '' } = req.query
        const url = `${URL}/comicContent/search/${chapterId}`
        axios({ url }).then((response) => res.send(response))
    }
}
module.exports = {
    search(req, res) {
        Api.search(req, res)
    },
    list(req, res) {
        Api.getList(req, res)
    },
    detail(req, res) {
        Api.getDetail(req, res)
    },
}