import { Express, Request, Response } from 'express';
import { JotformSubmissionModel } from '../models/jotform-submission/jotform-submission.model.js';
import { makeMosaicFromJotForm } from '../services/jotform.service.js';
import { writeFile, rm } from 'node:fs/promises';
import JSZip from 'jszip';

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

            const submission = new JotformSubmissionModel({
                submissionId: subId,
                formId: formId,
                ip: req.body.ip,
                email: req.body.email,
                size: size,
                imageNames: fileNames
            });
            await submission.save();

            const zip = new JSZip();
            let fileCount = 0;
            for (const fileName of fileNames) {
                const result = await makeMosaicFromJotForm(submission, fileName);
                const writtenFileName = `${fileName}-${fileCount}-mosaic.jpeg`;
                zip.file(writtenFileName, result);
                fileCount++;
            }
            
            const zipBuffer = await zip.generateAsync({type: 'nodebuffer'});
            await writeFile('test.zip', zipBuffer);
            res.download('test.zip');
            await rm ('test.zip');

        } catch (error) {
            console.error(error);
            res.status(500).send('Internal server error, please try again later.');
        }
        console.groupEnd();
    });
};
