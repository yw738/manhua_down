const { response } = require('express');
const request = require('request');
const URL = `http://api.pingcc.cn`;
/**
 * 封装的ajax
 * 对URL的接口进行转发
 * @param {string} url 请求路径
 * @param {string} method 请求类型
 * @param {object} params 请求参数
*/
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
module.exports = axios