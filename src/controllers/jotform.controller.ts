import { Express, Request, Response } from 'express';
import { JotformSubmissionModel } from '../models/jotform-submission/jotform-submission.model.js';
import { processJotformSubmission } from '../services/jotform.service.js';
import { rm } from 'node:fs/promises';

export default (app: Express): void => {
    app.post('/api/jotform', async (req: Request, res: Response) => {
        console.groupCollapsed(['/api/jotform request']);
        try {
            const formId = req.body.formID;
            const subId = req.body.submission_id;
            const size = req.body.size;
            const replaceBackground = req.body.replace_background;
            const backgroundColor = req.body.background_color;

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
                replaceBackground: replaceBackground,
                backgroundColor: backgroundColor,
                imageNames: fileNames
            });
            await submission.save();

            const fileName = await processJotformSubmission(submission);
            res.download(fileName);
            await rm (fileName);

        } catch (error) {
            console.error(error);
            res.status(500).send('Internal server error, please try again later.');
        }
        console.groupEnd();
    });
};
