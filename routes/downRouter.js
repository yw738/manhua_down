/**
 * Created by 杨非凡 
 * 爬取数据的接口
 */
const express = require('express');
const api = require('../controller/downloadController/index.js');
const Route = express.Router();



Route.route('/api/downLoadAWorl').get(api.downLoadAWorl);
Route.route('/api/downLoadAll').post(api.downLoadAll);

// Route.route('/api/search').get(api.search);
// Route.route('/api/list').get(api.list);
// Route.route('/api/detail').get(api.detail);




module.exports = Route;