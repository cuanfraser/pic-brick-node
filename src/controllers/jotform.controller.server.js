import { cartoonifyImage } from '../services/image.service.server.js';
import { get } from 'lodash-es';
import { pixelateJotFormImage } from '../services/jotform.service.server.js';

export default (app) => {
    app.post('/api/jotform', async (req, res) => {
        try {
            const formId = req.body.formID;
            const subId = req.body.submission_id;
            const files = [].concat(req.body['fileupload[]']);
            const size = req.body.size;
            for (const fileName of files) {
                const image = await pixelateJotFormImage(formId, subId, fileName, size);
                res.contentType('image/jpeg');
                res.send(image);
                break;
                // const newImg = await cartoonifyImage(image);
                // res.contentType('image/jpeg');
                // const data = await newImg.arrayBuffer();
                // res.send(Buffer.from(data));
            }
        } catch (error) {
            console.error(error);
            console.error(error.stack);
            res.status(500).send('Error!');
        }
    });
};
