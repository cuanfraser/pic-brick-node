import { Express, Request, Response } from 'express';
import { writeFile, rm } from 'node:fs/promises';
import { getInstructionsForSubmission } from '../services/instructions.service.js';
import { authenticateKey } from '../services/auth.service.js';

export default (app: Express): void => {
    app.get('/api/instructions/:id', async (req: Request, res: Response) => {
        console.groupCollapsed(['/api/instructions request']);
        try {
            await authenticateKey(req);
            const csvString = await getInstructionsForSubmission(req.params['id']);
            const fileName = `${req.params['id']}-instructions.csv`;
            await writeFile(fileName, csvString);
            res.download(fileName);

            await rm(fileName);
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal server error, please try again later.');
        }
        console.groupEnd();
    });
};
