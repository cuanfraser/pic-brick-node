import { Express, Request, Response } from 'express';
import { JotformSubmission } from '../models/jotform-submission/jotform-submission.model';
import { ImageWithHexCount } from '../services/brick.service';
import { makePicBrickFromJotForm } from '../services/jotform.service';
import { Mosaic } from '../models/mosaic/mosaic.model';
import { writeFile } from 'node:fs/promises';
import { __dirname } from '../constants';

export default (app: Express): void => {
    app.post('/api/jotform', async (req: Request, res: Response) => {
        console.groupCollapsed(['/api/jotform request']);
        try {
            // ADJUST FOR MULTIPLE IMAGES
            const formId = req.body.formID;
            const subId = req.body.submission_id;
            const size = req.body.size;

            const fileNames: string[] = [];
            let i = 0;
            let currentFile: string = req.body[`fileupload[${i}]`];
            while (currentFile) {
                fileNames.push(currentFile);
                i++;
                currentFile = req.body[`fileupload[${i}]`];
            }

            const submission = new JotformSubmission({
                submissionId: subId,
                formId: formId,
                ip: req.body.ip,
                email: req.body.email,
                size: size,
                imageNames: fileNames
            });
            await submission.save();

            let fileCount = 0;
            for (const fileName of fileNames) {
                const result: ImageWithHexCount = await makePicBrickFromJotForm(formId, subId, fileName, size);
                const mosaic = new Mosaic({ size: size, originalImageName: fileName, buffer: result.image });
                await mosaic.save();
                await JotformSubmission.findByIdAndUpdate(submission._id, { $push: { mosaics: mosaic }});

                const writtenFileName = `file${fileCount}.jpeg`;
                await writeFile(writtenFileName, result.image);

                res.contentType('image/jpeg');
                res.download(writtenFileName);
                //res.redirect('https://www.pic-brick.com/order')
                fileCount++;
                // TODO: REMOVE
                break;
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal server error, please try again later.');
        }
        console.groupEnd();
    });
};
