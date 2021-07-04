import fetch from 'node-fetch';
import FormData from 'form-data';

const API_URL = 'https://master-white-box-cartoonization-psi1104.endpoint.ainize.ai/predict';

const cartoonifyImage = async (img) => {
    const formData = new FormData();
    formData.append('file_type', 'image');
    formData.append('source', img, 'input image.jpg');
    return fetch(API_URL, {
        method: 'POST',
        body: formData,
    });
};

export { cartoonifyImage, processImage };
