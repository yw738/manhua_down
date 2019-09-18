const express = require('express');
const api = require('../controller/jianController');
const TxtApi =express.Router();


TxtApi.route('/txt/home').get(api.home);





module.exports = TxtApi;