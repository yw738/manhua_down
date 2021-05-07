/**
 * Created by  
 * 爬取数据的接口
 */
const express = require('express');
const api = require('../controller/downloadController/index.js');
const Route = express.Router();
Route.route('/api/downLoadAWorl').get(api.downLoadAWorl);
Route.route('/api/downLoadAll').post(api.downLoadAll);

module.exports = Route;