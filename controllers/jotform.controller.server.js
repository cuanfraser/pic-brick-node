import { processImage } from '../services/image.service.server.js';
import formidable from 'formidable';

export default (app) => {
    app.post('/api/jotform', async (req, res) => {
        try {
            console.log(req);
            res.status(500).send('Test!');

            // const img = await processImage(files.source);
            // res.contentType('image/jpeg');
            // const data = await img.arrayBuffer();
            // res.send(Buffer.from(data));
            
        } catch (error) {
            console.error(error);
            res.status(500).send('Error!');
        }
    });
};
