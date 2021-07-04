import { processImage } from '../services/image.service.server.js';
import formidable from 'formidable';

export default (app) => {

    app.post('/api/jotform', async (req, res) => {
        try {
            const form = formidable({ multiples: true, uploadDir: './tmp' });

            form.parse(req, async (err, fields, files) => {
                //fields.submission_id
                console.log({fields});
                console.log({files});
                // const img = await processImage(files.source);
                // res.contentType('image/jpeg');
                // const data = await img.arrayBuffer();
                // res.send(Buffer.from(data));
                res.status(500).send('Test!')
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error!')
        }
    });
};
