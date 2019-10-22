const express = require('express');
const app = express();

const RNRoute = require('./routes/RNRoute');
const fzdmRoute = require('./routes/fzdmRoute'); //风之漫画
const mhApi = require('./routes/72mhRoute');
const api = require("./routes/ApiRoute");
app.use(RNRoute);
app.use(fzdmRoute);
app.use(mhApi);
app.use(api);
app.use(express.static(__dirname + '/public'));
app.listen(80, function() {
    console.log('启动');
});