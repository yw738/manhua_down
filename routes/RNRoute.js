const express = require('express');
const api = require('../controller/RNController');
const RNApi =express.Router();


RNApi.route('/api/home').get(api.home);

RNApi.route('/api/list').get(api.list);

RNApi.route('/api/details').get(api.details);


module.exports = RNApi;