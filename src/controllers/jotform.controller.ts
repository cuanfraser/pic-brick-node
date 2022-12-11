import { Express, Request, Response } from 'express';
import { JotformSubmission } from 'models/jotform-submission/jotform-submission.model';
import { ImageWithHexCount } from 'services/brick.service';
import { makePicBrickFromJotForm } from '../services/jotform.service';

export default (app: Express): void => {
    app.post('/api/jotform', async (req: Request, res: Response) => {
        console.groupCollapsed(['/api/jotform request']);
        try {
            // ADJUST FOR MULTIPLE IMAGES
            const formId = req.body.formID;
            const subId = req.body.submission_id;
            const firstFile = [].concat(req.body['fileupload[0]']);
            const size = req.body.size;

            const submission = new JotformSubmission({
                submissionId: subId,
                formId: formId,
                ip: req.body.ip,
                email: req.body.email,
                size: size,
                imageNames: firstFile
            });
            await submission.save();

            for (const fileName of firstFile) {
                const result: ImageWithHexCount = await makePicBrickFromJotForm(formId, subId, fileName, size);
                res.contentType('image/jpeg');
                res.send(result.image);
                break;
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal server error, please try again later.');
        }
        console.groupEnd();
    });
};
