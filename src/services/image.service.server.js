import fetch from 'node-fetch';
import FormData from 'form-data';
import { CARTOON_API_URL } from '../constants.js';

const cartoonifyImage = async (img) => {
    const formData = new FormData();
    formData.append('file_type', 'image');
    formData.append('source', img, 'input image.jpg');
    return fetch(CARTOON_API_URL, {
        method: 'POST',
        body: formData,
    });
};

export { cartoonifyImage };
