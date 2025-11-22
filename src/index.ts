import express from 'express';
import jotformController from './controllers/jotform.controller.js';
import mongoose from 'mongoose';
import { MONGODB_URI } from './constants.js';
import hexCountController from './controllers/hex-count.controller.js';
import instructionsController from './controllers/instructions.controller.js';
import mosaicController from './controllers/mosaic.controller.js';
import { loadBrickImages } from './services/mosaic.service.js';
const app = express();
const port = process.env.PORT || 8555;

const main = async () => {

    loadBrickImages();

    let dbConnectionString = 'mongodb://localhost:27017/pic-brick';
    if (MONGODB_URI) {
        dbConnectionString = MONGODB_URI;
    }
    console.log('DB Connection String: ' + dbConnectionString);
    try {
        await mongoose.connect(dbConnectionString);
        console.log('Successfully connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
    

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
    hexCountController(app);
    instructionsController(app);
    mosaicController(app);

    app.listen(port, () => console.log('Listening on port ' + port));
}

main();


