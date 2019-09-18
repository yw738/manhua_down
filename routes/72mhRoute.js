/**
 * Created by 杨非凡 on 2019/7/14.
 */
const express = require('express');
const api = require('../controller/72mhController');
const mhApi = express.Router();


mhApi.route('/72/home').get(api.home);

mhApi.route('/72/list').get(api.list);



module.exports = mhApi;