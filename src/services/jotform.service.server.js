import fetch from 'node-fetch';
import { JOTFORM_UPLOAD_URL, JOTFORM_USERNAME, JOTFORM_API_KEY } from '../constants.js';
import { cartoonifyImage, makeImageBricks } from './image.service.server.js';

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
        throw new Error(`Failed retrieving image (${fileName}) from JotForm`);
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

const pixelateJotFormImage = async (formId, subId, fileName, boardSize) => {
    const cartoon = await cartoonifyJotFormImage(formId, subId, fileName);

    let widthBlocks = 64;
    let heightBlocks = 64;
    if (boardSize === 'Small 64x64') {
        widthBlocks = 64;
        heightBlocks = 64;
    } else if (boardSize === 'Medium 96x64') {
        widthBlocks = 96;
        heightBlocks = 64;
    } else if (boardSize === 'Large 96x96') {
        widthBlocks = 96;
        heightBlocks = 96;
    }
    return makeImageBricks(cartoon, widthBlocks, heightBlocks);
};

export { getJotFormImage, cartoonifyJotFormImage, pixelateJotFormImage };
