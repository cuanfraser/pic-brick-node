import { processImage, sealTest } from '../services/image.service.server.js';
import formidable from 'formidable';

export default (app) => {
    app.get('/api/seal', (req, res) =>
        sealTest().then(async (img) => {
            res.contentType('image/jpeg');
            const data = await img.arrayBuffer();
            res.send(Buffer.from(data));
        })
    );

    app.post('/api/image', async (req, res) => {
        try {
            const form = formidable({ multiples: true, uploadDir: './tmp' });

            form.parse(req, async (err, fields, files) => {
                const img = await processImage(files.source);
                res.contentType('image/jpeg');
                const data = await img.arrayBuffer();
                res.send(Buffer.from(data));
            });
        } catch (error) {
            console.log(error);
        }
    });
};
