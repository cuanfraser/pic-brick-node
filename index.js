import express from 'express';
const app = express();
const port = process.env.PORT || 8000;

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

import testController from './controllers/image.controller.server.js';
testController(app);

app.listen(port, () => console.log('Listening on port ' + port));
