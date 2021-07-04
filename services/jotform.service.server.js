import fetch from 'node-fetch';
import { JOTFORM_UPLOAD_URL, JOTFORM_USERNAME, JOTFORM_API_KEY } from '../constants.js';

const getSourceImage = async (formId, subId, fileName) => {
    const imageUrl = `${JOTFORM_UPLOAD_URL}/${JOTFORM_USERNAME}/${formId}/${subId}/${fileName}`;
    const apiParam = `?apiKey=${JOTFORM_API_KEY}`;
    const url = imageUrl + apiParam;
    console.log(url);
    const resp = await fetch(url);
    return resp.buffer();
};

export { getSourceImage };
