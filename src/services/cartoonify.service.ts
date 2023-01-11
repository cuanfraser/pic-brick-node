import fetch, { Response } from 'node-fetch';
import FormData from 'form-data';
import { CARTOON_API_URL } from '../constants.js';

const cartoonifyImage = async (img: Buffer): Promise<Buffer> => {
    console.time('cartoonifyImage');

    const formData = new FormData();
    formData.append('file_type', 'image');
    formData.append('source', img, 'input image.jpg');
    const resp: Response = await fetch(CARTOON_API_URL, {
        method: 'POST',
        body: formData,
    });

    if (!resp.ok) {
        throw new Error(`cartoonify API error: ${resp.statusText}`);
    }

    console.timeEnd('cartoonifyImage');
    return resp.buffer();
};

export { cartoonifyImage };
