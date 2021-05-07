const { response } = require('express');
const request = require('request');
const URL = `http://api.pingcc.cn`;
/**
 * 对URL的接口进行转发
*/
//封装的ajax
const axios = ({ url, method = "GET", params = {} }) => {
       return new Promise((resolve, reject) => {
              request({
                     url: url,
                     method: method,//请求方式，默认为get
                     headers: {//设置请求头
                            "content-type": "application/json",
                     },
                     body: JSON.stringify(params)//post参数字符串
              }, function (error, response, body) {
                     if (!error && response.statusCode == 200) {
                            resolve(JSON.parse(body))
                     } else {
                            reject(JSON.parse(body))
                     }
              })
       })
}

class Api {
       /**
        * @param {string} option 选择搜索项，标题：title ， 作者 ：author ，分类：cartoonType
        * @param {string} key 搜索关键字，默认是模糊分词搜索
        * @param {string} from 当前页数，留空默认1，填0为完全匹配搜索。
        * @param {string} size 一页显示的数量，留空默认10，最多100。配合from为0可最多返回100条精确数据。
        * encodeURIComponent(userName)
        * decodeURIComponent(userName)
       */
       static search(req, res) {
              let { option = 'title', key = ' ', from = 1, size = 10 } = req.query;
              let str = Boolean(encodeURIComponent(key))?encodeURIComponent(key):'%20';
              axios({
                     url: `${URL}/cartoon/search/${option}/${str}/${Number(from)}/${Number(size)}`
              }).then(response => {
                     res.send(response)
              })
       }
       /**
       * @param {string} cartoonId 通过漫画搜索API获取到cartoonId
      */
       static getList(req, res) {
              //http://api.pingcc.cn/cartoonChapter/search/2yirenzhixia
              let { cartoonId = '' } = req.query;
              axios({
                     url: `${URL}/cartoonChapter/search/${cartoonId}`
              }).then(response => {
                     res.send(response)
              })
       }
       /**
       * @param {string} chapterId 通过漫画章节API获取chapterId
      */
       static getDetail(req, res) {
              let { chapterId = '' } = req.query;
              axios({
                     url: `${URL}/cartoonContent/search/${chapterId}`
              }).then(response => {
                     res.send(response)
              })
       }
}
module.exports = {
       search(req, res) {
              Api.search(req, res);
       },
       list(req, res) {
              Api.getList(req, res);
       },
       detail(req, res) {
              Api.getDetail(req, res);
       },
};