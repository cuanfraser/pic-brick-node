import fetch from 'node-fetch';
import { JOTFORM_UPLOAD_URL, JOTFORM_USERNAME, JOTFORM_API_KEY } from '../constants.js';
import { cartoonifyImage } from './image.service.server.js';

const getSourceImage = async (formId, subId, fileName) => {
    const imageUrl = `${JOTFORM_UPLOAD_URL}/${JOTFORM_USERNAME}/${formId}/${subId}/${fileName}`;
    const apiParam = `?apiKey=${JOTFORM_API_KEY}`;
    const url = imageUrl + apiParam;
    console.log(url);
    const resp = await fetch(url);
    if (resp.ok) {
        return resp.buffer();
    } else {
        throw new Error('Failed retrieving image from JotForm');
    }
};

const cartoonifySourceImage = async (formId, subId, fileName) => {
    const image = await getSourceImage(formId, subId, fileName);
    const resp = await cartoonifyImage(image);

    if (resp.ok) {
        return resp.buffer();
    } else {
        throw new Error('Failed cartoonifying image');
    }
};

export { getSourceImage, cartoonifySourceImage };
