import { Express, Request, Response } from 'express';
import { rm } from 'node:fs/promises';
import { getMosaicForLatestSubmission, getMosaicForSubmission } from '../services/mosaic.service.js';

export default (app: Express): void => {
    app.get('/api/mosaic/latest', async (req: Request, res: Response) => {
        console.groupCollapsed(['/api/mosaic/latest request']);
        try {
            const fileName = await getMosaicForLatestSubmission();
            res.download(fileName);
            await rm(fileName);
        } catch (error) {
            console.error(error);
            res.status(500).send(`Internal server error: ${error}`);
        }
        console.groupEnd();
    });

    app.get('/api/mosaic/:id', async (req: Request, res: Response) => {
        console.groupCollapsed(['/api/mosaic/id request']);
        try {
            const fileName = await getMosaicForSubmission(req.params['id']);
            res.download(fileName);
            await rm(fileName);
        } catch (error) {
            console.error(error);
            res.status(500).send(`Internal server error: ${error}`);
        }
        console.groupEnd();
    });
};
