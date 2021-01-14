/**
 * Created by 杨非凡 
 * 爬取数据的接口
 */
const express = require('express');
const api = require('../controller/apiController/index.js');
const Route = express.Router();

Route.route('/api/home').get(api.home);
Route.route('/api/search').get(api.search);
Route.route('/api/list').get(api.list);
Route.route('/api/detail').get(api.detail);




module.exports = Route;