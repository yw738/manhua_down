const express = require('express');
const fzdmRoute = express.Router();
const api = require('../controller/Api/ApiController');


fzdmRoute.route('/pcApi/home').get(api.home);

fzdmRoute.route('/pcApi/list').get(api.list);



module.exports = fzdmRoute;