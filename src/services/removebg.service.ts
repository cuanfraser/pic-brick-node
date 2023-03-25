import { REMOVE_BG_API_KEY, REMOVE_BG_URL } from '../constants.js';
import fetch, { Response, FormData } from 'node-fetch';

const removeBackground = async (img: Buffer, bgHex: string): Promise<Buffer> => {
    console.time('removeBg');

    const formData = new FormData();
    // TODO: Change to Auto on production
    formData.set('size', 'preview');
    formData.set('image_file', new Blob([img]));
    formData.set('type', 'auto');
    formData.set('format', 'jpg');
    formData.set('bg_color', bgHex);

    const resp: Response = await fetch(REMOVE_BG_URL, {
        method: 'POST',
        body: formData,
        headers: REMOVE_BG_API_KEY ? { 'X-Api-Key': REMOVE_BG_API_KEY } : undefined,
    });

    if (!resp.ok) {
        throw new Error(`remove.bg error: ${resp.status}: ${resp.statusText}`);
    }

    console.timeEnd('removeBg');
    return resp.buffer();
};

export { removeBackground };
