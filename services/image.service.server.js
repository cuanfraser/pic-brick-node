import fetch from 'node-fetch';
import FormData from 'form-data';
import { readFile, writeFile } from 'fs/promises';

const API_URL = 'https://master-white-box-cartoonization-psi1104.endpoint.ainize.ai/predict';

const processImage = async (file) => {
    console.log(file);
    const img = await readFile(file.path);
    return cartoonifyImage(img);
}

const cartoonifyImage = async (img) => {
    const formData = new FormData();
    formData.append('file_type', 'image');
    formData.append('source', img, 'input image.jpg');
    return fetch(API_URL, {
        method: 'POST',
        body: formData,
    });
};

const sealTest = () =>
    readFile('./seal.jpg')
        .then((img) => cartoonifyImage(img))
        .catch((err) => console.log(`Error: ${err}`));

export { cartoonifyImage, sealTest, processImage };
