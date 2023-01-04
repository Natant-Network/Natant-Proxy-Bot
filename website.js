const express = require('express');
const app = express();
let { port } = require('./config.json');
//no longer used
app.use(express.static('website'))
app.listen(port);
console.log('listening on port ' + port);
