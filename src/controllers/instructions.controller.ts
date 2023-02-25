import { Express, Request, Response } from 'express';
import { writeFile } from 'node:fs/promises';
import { getInstructionsForSubmission } from '../services/instructions.service.js';

export default (app: Express): void => {
    app.get('/api/results/:id', async (req: Request, res: Response) => {
        console.groupCollapsed(['/api/results request']);
        try {
            
            const csvString = await getInstructionsForSubmission(req.params['id']);
            const fileName = `${req.params['id']}-instructions.csv`;
            await writeFile(fileName, csvString);
            res.download(fileName);

        } catch (error) {
            console.error(error);
            res.status(500).send('Internal server error, please try again later.');
        }
        console.groupEnd();
    });
};
