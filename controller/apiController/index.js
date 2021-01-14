const getHome = require('./getHome.js');//获取首页
const search = require('./search.js');//检索
const getList = require('./getList.js');//列表
const getDetail = require('./getDetail.js');//详情

/**
 * 爬取数据的接口
*/
module.exports = {
    ...getHome,
    ...search,
    ...getList,
    ...getDetail
};