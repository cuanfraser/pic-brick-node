import { Express, Request, Response } from 'express';
import { writeFile, rm } from 'node:fs/promises';
import { getHexCountCsv } from '../services/hex-count.service.js';
import { authenticateKey } from '../services/auth.service.js';

export default (app: Express): void => {
    app.get('/api/hex-count', async (req: Request, res: Response) => {
        console.groupCollapsed(['/api/hex-count request']);
        try {
            await authenticateKey(req);
            const csvString = await getHexCountCsv();
            const fileName = 'totalHexCount.csv';
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
