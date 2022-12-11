import express from 'express';
import jotformController from './controllers/jotform.controller.js';
import mongoose from 'mongoose';
import { MONGODB_URI } from 'constants.js';
const app = express();
const port = process.env.PORT || 8000;

const main = async () => {

    if (!MONGODB_URI) {
        return -1;
    }

    await mongoose.connect(MONGODB_URI);

    app.use(function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Credentials', 'true');
        next();
    });
    
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());

    jotformController(app);
    app.listen(port, () => console.log('Listening on port ' + port));
}

main();


