import fetch from 'node-fetch';
import { JOTFORM_API_KEY, JOTFORM_LARGE_TEXT, JOTFORM_MEDIUM_TEXT, JOTFORM_SMALL_TEXT, JOTFORM_UPLOAD_URL, JOTFORM_USERNAME } from '../constants.js';
import { processInputImage } from './image.service.js';
import { makeBrickImage, ImageWithHexCount } from './brick.service.js'
import { IJotformSubmission } from '../models/jotform-submission/jotform-submission.schema.js';
import { JotformSubmission } from '../models/jotform-submission/jotform-submission.model.js';
import { Mosaic } from '../models/mosaic/mosaic.model.js';
//import { removeBackground } from './removebg.service';
//import { cartoonifyImage } from './cartoonify.service';

const getJotFormImage = async (
    formId: string,
    subId: string,
    fileName: string,
): Promise<Buffer> => {
    console.time('jotImage');
    const imageUrl = `${JOTFORM_UPLOAD_URL}/${JOTFORM_USERNAME}/${formId}/${subId}/${encodeURIComponent(fileName)}?apiKey=${JOTFORM_API_KEY}`;
    console.log('JotForm Image Retrieval URL: ' + imageUrl);
    const resp = await fetch(imageUrl);
    if (resp.ok) {
        console.timeEnd('jotImage');
        return resp.buffer();
    } else {
        throw new Error(`Failed retrieving image (${fileName}) from JotForm with response: "${resp.status}: ${resp.statusText}"`);
    }
};

// Gets JotForm image and converts to PicBrick image with hex counts
const makePicBrickFromJotForm = async (
    jotformSubmission: IJotformSubmission,
    fileName: string,
): Promise<ImageWithHexCount> => {
    const formId = jotformSubmission.formId;
    const subId = jotformSubmission.submissionId;
    const boardSize = jotformSubmission.size;
    const originalImage = await getJotFormImage(formId, subId, fileName);
    const modifiedImage = await processInputImage(originalImage);
    // const cartoon = await cartoonifyImage(modifiedImage);
    // const noBg = await removeBackground(cartoon);

    // Calculate Sample Size based on Physical Size
    console.log(boardSize);
    let widthBlocks = 64;
    let heightBlocks = 64;
    // Sample Size = (Res / Blocks #)
    if (boardSize === JOTFORM_SMALL_TEXT) {
        widthBlocks = 64;
        heightBlocks = 64;
    } else if (boardSize === JOTFORM_MEDIUM_TEXT) {
        widthBlocks = 96;
        heightBlocks = 64;
    } else if (boardSize === JOTFORM_LARGE_TEXT) {
        widthBlocks = 96;
        heightBlocks = 96;
    }

    const imageWithHex = await makeBrickImage(modifiedImage, widthBlocks, heightBlocks);

    const mosaic = new Mosaic({ size: boardSize, originalImageName: fileName, buffer: imageWithHex.image, hexToCountMap: imageWithHex.hexToCountAfter });
    await mosaic.save();
    await JotformSubmission.findByIdAndUpdate(jotformSubmission._id, { $push: { mosaics: mosaic }});

    return imageWithHex;
};

export { getJotFormImage, makePicBrickFromJotForm };
