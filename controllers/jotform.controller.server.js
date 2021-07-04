import { processImage } from '../services/image.service.server.js';
import { get } from 'lodash-es';
import { getSourceImage } from '../services/jotform.service.server.js';

export default (app) => {
    app.post('/api/jotform', async (req, res) => {
        try {
            console.log(req);

            const formId = req.body.formID;
            const subId = req.body.submission_id;
            for (const fileName of req.body['fileupload[]']) {
                const image = await getSourceImage(formId, subId, fileName);
                console.log(image);
            }

            res.status(500).send('Test!');


            // const img = await processImage(files.source);
            // res.contentType('image/jpeg');
            // const data = await img.arrayBuffer();
            // res.send(Buffer.from(data));
        } catch (error) {
            console.error(error);
            console.error(error.stack);
            res.status(500).send('Error!');
        }
    });
};
