import { HEX_BACKGROUND_COLOUR, REMOVE_BG_API_KEY, REMOVE_BG_URL } from '../constants.js';
import fetch, { Response } from 'node-fetch';
import FormData from 'form-data';

const removeBackground = async (img: Buffer): Promise<Buffer> => {
    console.time('removeBg');

    const formData = new FormData();
    // TODO: Change to Auto on production
    formData.append('size', 'preview');
    formData.append('image_file', img);
    formData.append('type', 'auto');
    formData.append('format', 'jpg');
    const bgCol = HEX_BACKGROUND_COLOUR.substring(1);
    formData.append('bg_color', bgCol);

    const resp: Response = await fetch(REMOVE_BG_URL, {
        method: 'POST',
        body: formData,
        headers: REMOVE_BG_API_KEY ? { 'X-Api-Key': REMOVE_BG_API_KEY } : undefined,
    });

    if (!resp.ok) {
        throw new Error(`remove.bg error: ${resp.statusText}`);
    }

    console.timeEnd('removeBg');
    return resp.buffer();
};

export { removeBackground };
