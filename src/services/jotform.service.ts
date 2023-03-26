import fetch from 'node-fetch';
import {
    HEX_COLOUR_BG_MAP,
    JOTFORM_API_KEY,
    JOTFORM_LARGE_TEXT,
    JOTFORM_MEDIUM_TEXT,
    JOTFORM_REPLACE_BG_YES,
    JOTFORM_SMALL_TEXT,
    JOTFORM_UPLOAD_URL,
    JOTFORM_USERNAME,
} from '../constants.js';
import { processInputImage } from './image.service.js';
import { makeMosaic } from './mosaic.service.js';
import { IJotformSubmission } from '../models/jotform-submission/jotform-submission.schema.js';
import { JotformSubmissionModel } from '../models/jotform-submission/jotform-submission.model.js';
import { MosaicModel } from '../models/mosaic/mosaic.model.js';
import { removeBackground } from './removebg.service.js';
import { writeFile } from 'node:fs/promises';
import JSZip from 'jszip';

export const processJotformSubmission = async (submission: IJotformSubmission): Promise<string> => {
    const nameToFile = new Map<string, Buffer>();
    for (const originalImageName of submission.imageNames) {
        const result = await makeMosaicFromJotForm(submission, originalImageName);
        const resultFileName = `${originalImageName}-${submission.imageNames.length}-mosaic.jpeg`;

        if (submission.imageNames.length === 1) {
            await writeFile(resultFileName, result);
            return resultFileName;
        }

        nameToFile.set(resultFileName, result);
    }

    const zip = new JSZip();
    nameToFile.forEach((file, fileName) => {
        zip.file(fileName, file);
    });
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
    const fileName = 'pic-brick-preview-images.zip';
    await writeFile(fileName, zipBuffer);
    return fileName;
};

export const getJotFormImage = async (
    formId: string,
    subId: string,
    fileName: string,
): Promise<Buffer> => {
    console.time('getJotFormImage');
    const imageUrl = `${JOTFORM_UPLOAD_URL}/${JOTFORM_USERNAME}/${formId}/${subId}/${encodeURIComponent(
        fileName,
    )}?apiKey=${JOTFORM_API_KEY}`;
    console.log('JotForm Image Retrieval URL: ' + imageUrl);
    const resp = await fetch(imageUrl);
    console.timeEnd('getJotFormImage');
    if (resp.ok) {
        return resp.buffer();
    } else {
        throw new Error(
            `Failed retrieving image (${fileName}) from JotForm with response: "${resp.status}: ${resp.statusText}"`,
        );
    }
};

// Gets JotForm image and converts to PicBrick image with hex counts
export const makeMosaicFromJotForm = async (
    jotformSubmission: IJotformSubmission,
    fileName: string,
): Promise<Buffer> => {
    const originalImage = await getJotFormImage(
        jotformSubmission.formId,
        jotformSubmission.submissionId,
        fileName,
    );
    const modifiedImage = await processInputImage(originalImage);

    const backgroundColor = jotformSubmission.backgroundColor;
    let bgImage = modifiedImage;
    if (jotformSubmission.replaceBackground === JOTFORM_REPLACE_BG_YES) {
        if (!HEX_COLOUR_BG_MAP.has(backgroundColor)) {
            throw new Error(`Unavailable background color chosen (${backgroundColor}).`);
        }
        const bgHex = HEX_COLOUR_BG_MAP.get(backgroundColor);
        try {
            bgImage = await removeBackground(modifiedImage, bgHex!);
        } catch (error) {
            console.log(error);
            bgImage = modifiedImage;
        }
    }

    // Calculate Sample Size based on Physical Size
    const boardSize = jotformSubmission.size;
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

    const mosaic = new MosaicModel({
        size: boardSize,
        originalImageName: fileName,
        buffer: mosaicInfo.image,
        hexToCountMap: mosaicInfo.hexToCountAfter,
        instructions: mosaicInfo.instructions,
        sampleSize: mosaicInfo.sampleSize,
    });
    await mosaic.save();
    await JotformSubmissionModel.findByIdAndUpdate(jotformSubmission._id, {
        $push: { mosaics: mosaic },
    });

    return mosaicInfo.image;
};
