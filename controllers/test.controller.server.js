import { sealTest } from '../services/test.service.server.js';

export default (app) => {
    app.get('/api/test', (req, res) =>
        sealTest().then(async (img) => {
            res.contentType('image/jpeg');
            const data = await img.arrayBuffer();
            res.send(Buffer.from(data));
        })
    );
};
