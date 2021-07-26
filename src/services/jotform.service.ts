import fetch from 'node-fetch';
import { JOTFORM_UPLOAD_URL, JOTFORM_USERNAME } from '../constants';
import { processInputImage } from './image.service';
import { pixelateImage } from './brick.service'
import { removeBackground } from './removebg.service';
import { cartoonifyImage } from './cartoonify.service';

const getJotFormImage = async (formId: string, subId: string, fileName: string): Promise<Buffer> => {
    console.time('jotImage');
    const imageUrl = `${JOTFORM_UPLOAD_URL}/${JOTFORM_USERNAME}/${formId}/${subId}/${fileName}`;
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

const makePicBrickFromJotForm = async (formId: string, subId: string, fileName: string, boardSize: string): Promise<Buffer> => {
    const originalImage = await getJotFormImage(formId, subId, fileName);
    const modifiedImage = await processInputImage(originalImage);
    const cartoon = await cartoonifyImage(modifiedImage);
    const noBg = await removeBackground(cartoon);

    // Calculate Sample Size based on Physical Size
    console.log(boardSize);
    let widthBlocks = 64;
    let heightBlocks = 64;
    // Sample Size = (Res / Blocks #)
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

    return pixelateImage(noBg, widthBlocks, heightBlocks);
};

export { getJotFormImage, makePicBrickFromJotForm };
