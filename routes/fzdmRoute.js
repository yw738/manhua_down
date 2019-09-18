/**
 * Created by 杨非凡 on 2019/7/14.
 */
const express = require('express');
const api = require('../controller/fzdmController');
const fzdmRoute = express.Router();


fzdmRoute.route('/fzdm/home').get(api.home);
fzdmRoute.route('/fzdm/list').get(api.list);




module.exports = fzdmRoute;