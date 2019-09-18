/**
 * Created by 杨非凡 on 2019/7/14.
 */
const express = require('express');
const api = require('../controller/fzdmController');
const FzdmRoute =express.Router();


FzdmRoute.route('/fzdm/home').get(api.home);

FzdmRoute.route('/fzdm/list').get(api.list);

FzdmRoute.route('/fzdm/details').get(api.details);


module.exports = FzdmRoute;