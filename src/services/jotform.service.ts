import fetch from 'node-fetch';
import { HEX_COLOUR_BG_MAP, JOTFORM_API_KEY, JOTFORM_LARGE_TEXT, JOTFORM_MEDIUM_TEXT, JOTFORM_REPLACE_BG_YES, JOTFORM_SMALL_TEXT, JOTFORM_UPLOAD_URL, JOTFORM_USERNAME } from '../constants.js';
import { processInputImage } from './image.service.js';
import { makeMosaic } from './mosaic.service.js'
import { IJotformSubmission } from '../models/jotform-submission/jotform-submission.schema.js';
import { JotformSubmissionModel } from '../models/jotform-submission/jotform-submission.model.js';
import { MosaicModel } from '../models/mosaic/mosaic.model.js';
import { removeBackground } from './removebg.service.js';
//import { removeBackground } from './removebg.service';
//import { cartoonifyImage } from './cartoonify.service';

export const getJotFormImage = async (
    formId: string,
    subId: string,
    fileName: string,
): Promise<Buffer> => {
    console.time('jotImage');
    const imageUrl = `${JOTFORM_UPLOAD_URL}/${JOTFORM_USERNAME}/${formId}/${subId}/${encodeURIComponent(fileName)}?apiKey=${JOTFORM_API_KEY}`;
    console.log('JotForm Image Retrieval URL: ' + imageUrl);
    const resp = await fetch(imageUrl);
    console.timeEnd('jotImage');
    if (resp.ok) {
        return resp.buffer();
    } else {
        throw new Error(`Failed retrieving image (${fileName}) from JotForm with response: "${resp.status}: ${resp.statusText}"`);
    }
};

// Gets JotForm image and converts to PicBrick image with hex counts
export const makeMosaicFromJotForm = async (
    jotformSubmission: IJotformSubmission,
    fileName: string,
): Promise<Buffer> => {
    
    const originalImage = await getJotFormImage(jotformSubmission.formId, jotformSubmission.submissionId, fileName);
    const modifiedImage = await processInputImage(originalImage);

    const backgroundColor = jotformSubmission.backgroundColor;
    let bgImage = modifiedImage;
    if (jotformSubmission.replaceBackground === JOTFORM_REPLACE_BG_YES) {
        if (!HEX_COLOUR_BG_MAP.has(backgroundColor)) {
            throw new Error(`Unavailable background color chosen (${backgroundColor}).`);
        }
        const bgHex = HEX_COLOUR_BG_MAP.get(backgroundColor);
        bgImage = await removeBackground(modifiedImage, bgHex!);
    }

    // const cartoon = await cartoonifyImage(modifiedImage);

    // Calculate Sample Size based on Physical Size
    const boardSize = jotformSubmission.size;
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

    const mosaicInfo = await makeMosaic(bgImage, widthBlocks, heightBlocks);

    const mosaic = new MosaicModel({ size: boardSize, originalImageName: fileName, buffer: mosaicInfo.image, hexToCountMap: mosaicInfo.hexToCountAfter, instructions: mosaicInfo.instructions, sampleSize: mosaicInfo.sampleSize });
    await mosaic.save();
    await JotformSubmissionModel.findByIdAndUpdate(jotformSubmission._id, { $push: { mosaics: mosaic }});

    return mosaicInfo.image;
};
