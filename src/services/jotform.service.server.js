import fetch from 'node-fetch';
import { JOTFORM_UPLOAD_URL, JOTFORM_USERNAME, JOTFORM_API_KEY } from '../constants.js';
import { cartoonifyImage, pixelateImage } from './image.service.server.js';

const getJotFormImage = async (formId, subId, fileName) => {
    console.time('jotImage');
    const imageUrl = `${JOTFORM_UPLOAD_URL}/${JOTFORM_USERNAME}/${formId}/${subId}/${fileName}`;
    const apiParam = `?apiKey=${JOTFORM_API_KEY}`;
    const url = imageUrl;
    console.log('JotForm Image Retrieval URL: ' + url);
    const resp = await fetch(url);
    if (resp.ok) {
        console.timeEnd('jotImage');
        return resp.buffer();
    } else {
        throw new Error('Failed retrieving image from JotForm');
    }
};

const cartoonifyJotFormImage = async (formId, subId, fileName) => {
    const image = await getJotFormImage(formId, subId, fileName);
    const resp = await cartoonifyImage(image);

    if (resp.ok) {
        return resp.buffer();
    } else {
        throw new Error('Failed cartoonifying image');
    }
};

const pixelateJotFormImage = async (formId, subId, fileName, size) => {
    const cartoon = await cartoonifyJotFormImage(formId, subId, fileName);
    return pixelateImage(cartoon, size);
};

export { getJotFormImage, cartoonifyJotFormImage, pixelateJotFormImage };
