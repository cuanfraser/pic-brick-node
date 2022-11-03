import { Express, Request, Response } from 'express';
import { makePicBrickFromJotForm } from '../services/jotform.service';

export default (app: Express): void => {
    app.post('/api/jotform', async (req: Request, res: Response) => {
        console.groupCollapsed(['/api/jotform request']);
        try {
            const formId = req.body.formID;
            const subId = req.body.submission_id;
            const firstFile = [].concat(req.body['fileupload[0]']);
            const size = req.body.size;
            console.log('request: ' + req);
            for (const fileName of firstFile) {
                console.log('filename: ' + fileName);
                const image = await makePicBrickFromJotForm(formId, subId, fileName, size);
                res.contentType('image/jpeg');
                res.send(image);
                break;
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal server error, please try again later.');
        }
        console.groupEnd();
    });
};
