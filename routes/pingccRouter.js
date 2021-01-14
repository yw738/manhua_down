/**
 * Created by 杨非凡 
 * 接口转发router
 */
const express = require('express');
const api = require('../controller/pingccApi/index.js');
const Route = express.Router();

Route.route('/api/pingccApi/search').get(api.search);
Route.route('/api/pingccApi/list').get(api.list);
Route.route('/api/pingccApi/detail').get(api.detail);

// http://localhost/api/pingccApi/search?key=%E7%A7%9F%E5%80%9F
// http://localhost/api/pingccApi/list?cartoonId=2yirenzhixia
// http://localhost/api/pingccApi/detail?chapterId=2316518

module.exports = Route;