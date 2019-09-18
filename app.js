const express = require('express');
const app = express();

const RNRoute = require('./routes/RNRoute');
const fzdmRoute = require('./routes/fzdmRoute');
const TxtApi = require('./routes/jianRoute');
const mhApi = require('./routes/72mhRoute');
app.use(RNRoute);
app.use(fzdmRoute);
app.use(TxtApi);
app.use(mhApi);
let server = app.listen(8881, function() {
    console.log('启动');
});