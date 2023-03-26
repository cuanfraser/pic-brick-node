import { NODE_ENV, NODE_ENV_PROD, REMOVE_BG_API_KEY, REMOVE_BG_URL } from '../constants.js';
import fetch, { Response, FormData } from 'node-fetch';

const removeBackground = async (img: Buffer, bgHex: string): Promise<Buffer> => {
    console.time('removeBg');

    const formData = new FormData();
    
    const size = NODE_ENV === NODE_ENV_PROD ? 'auto' : 'preview';

    formData.set('size', size);
    formData.set('image_file_b64', img.toString('base64'));
    formData.set('type', 'auto');
    formData.set('format', 'jpg');
    formData.set('bg_color', bgHex);

    const resp: Response = await fetch(REMOVE_BG_URL, {
        method: 'POST',
        body: formData,
        headers: REMOVE_BG_API_KEY ? { 'X-Api-Key': REMOVE_BG_API_KEY } : undefined,
    });

    if (!resp.ok) {
        console.timeEnd('removeBg');
        throw new Error(`remove.bg error: ${resp.status}: ${resp.statusText}: ${await resp.text()}`);
    }

    console.timeEnd('removeBg');
    return resp.buffer();
};

export { removeBackground };
