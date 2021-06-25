import express from 'express';
const app = express();

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

import testController from './controllers/test.controller.server.js';
testController(app);

import {sealWrite} from './services/test.service.server.js'
sealWrite();

app.listen(8000);
