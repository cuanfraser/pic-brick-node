import Canvas from 'canvas';
import {
    BRICK_IMG_HEIGHT_PIXELS,
    BRICK_IMG_WIDTH_PIXELS,
    HEX_COLOUR_PALETTE,
    MIN_HEX_COUNT,
} from '../constants.js';
import { cropToBoardSize, getPixelForCoords } from './image.service.js';
import { JotformSubmissionModel } from '../models/jotform-submission/jotform-submission.model.js';
import { IMosaic } from '../models/mosaic/mosaic.schema.js';
import { writeFile } from 'node:fs/promises';
import { closest } from 'color-diff';
import convert from 'color-convert';

export const brickImgs: { [key: string]: Canvas.Image } = {};
//Load images of individual bricks
export const loadBrickImages = async (): Promise<void> => {
    // For each hex colour, load image and set as canvas image object inside brickImgs array.
    for (const hex of HEX_COLOUR_PALETTE) {
        const name = hex.substring(1);
        const blockImgPath = new URL(`../../resources/bricks/${name}.png`, import.meta.url);
        const blockImg = await Canvas.loadImage(blockImgPath.pathname);
        brickImgs[hex] = blockImg;
    }
};

const rgbPalette: { R: number; G: number; B: number }[] = HEX_COLOUR_PALETTE.map((hex) => {
    const rgb = convert.hex.rgb(hex);
    return { R: rgb[0], G: rgb[1], B: rgb[2] };
});

// Finds closest hex colour in colour palette when given RGB val
export const closestColourInPalette = (
    r: number,
    g: number,
    b: number,
    rgbPalette: { R: number; G: number; B: number }[],
): string => {
    const result = closest({ R: r, G: g, B: b }, rgbPalette);
    return '#' + convert.rgb.hex(result.R, result.G, result.B);
};

export interface MosaicInfo {
    image: Buffer;
    hexToCountAfter: Map<string, number>;
    instructions: string[][];
    sampleSize: number;
}

// Make image into pixelated area reped by bricks
export const makeMosaic = async (
    src: Buffer,
    widthBlocks: number,
    heightBlocks: number,
): Promise<MosaicInfo> => {
    console.groupCollapsed(['makeMosaic']);
    console.time('makeMosaic');

    const img = await Canvas.loadImage(src);

    // Crop to correct board aspect ratio
    const cropValues = cropToBoardSize(widthBlocks, heightBlocks, img.width, img.height);
    const widthCrop = cropValues.widthCrop;
    const heightCrop = cropValues.heightCrop;
    const newWidth = cropValues.correctAspectRatioWidth;
    const newHeight = cropValues.correctAspectRatioHeight;
    // Rotation swaps these
    widthBlocks = cropValues.newWidthBlocks;
    heightBlocks = cropValues.newHeightBlocks;

    // Create Canvas to draw cropped image on to analyze colours
    const can = Canvas.createCanvas(newWidth, newHeight);
    const ctx = can.getContext('2d');
    ctx.drawImage(
        img,
        widthCrop / 2,
        heightCrop / 2,
        newWidth,
        newHeight,
        0,
        0,
        newWidth,
        newHeight,
    );

    // Get pixel array where each pixel is 4 slots (RGBA)
    const pixelArr = ctx.getImageData(0, 0, newWidth, newHeight).data;

    //Brick image
    const brickImageWidth = widthBlocks * BRICK_IMG_WIDTH_PIXELS;
    const brickImageHeight = heightBlocks * BRICK_IMG_HEIGHT_PIXELS;
    const brickImageCan = Canvas.createCanvas(brickImageWidth, brickImageHeight);
    const brickImageCtx = brickImageCan.getContext('2d');

    const hexToCount = new Map<string, number>();
    const widthSampleSize = newWidth / widthBlocks;
    const heightSampleSize = newHeight / heightBlocks;
    if (widthSampleSize < 1 || heightSampleSize < 1) {
        throw new Error(`Sample size is too small, please use a higher quality image.`);
    }

    // Find closest hex in palette for each brick
    for (let brickRow = 0; brickRow < heightBlocks; brickRow++) {
        for (let brickCol = 0; brickCol < widthBlocks; brickCol++) {
            const match = getColourMatchForSample(
                brickRow,
                brickCol,
                heightSampleSize,
                widthSampleSize,
                newWidth,
                newHeight,
                pixelArr,
                rgbPalette,
            );
            const count = hexToCount.get(match);
            hexToCount.set(match, count ? count + 1 : 1);
        }
    }

    // New Palette excluding Hex colours with less than chosen amount
    const newRgbPalette = HEX_COLOUR_PALETTE.filter((hex) => {
        let count = hexToCount.get(hex);
        if (count == undefined) {
            count = 0;
        }
        return count > MIN_HEX_COUNT;
    }).map((hex) => {
        const rgb = convert.hex.rgb(hex);
        return { R: rgb[0], G: rgb[1], B: rgb[2] };
    });

    const hexToCountAfter = new Map<string, number>();
    const instructions = new Array<Array<string>>(heightBlocks);

    // Build image on canvas
    for (let brickRow = 0; brickRow < heightBlocks; brickRow++) {
        const instructionsRow = new Array<string>(widthBlocks);

        for (let brickCol = 0; brickCol < widthBlocks; brickCol++) {
            const match = getColourMatchForSample(
                brickRow,
                brickCol,
                heightSampleSize,
                widthSampleSize,
                newWidth,
                newHeight,
                pixelArr,
                newRgbPalette,
            );
            const count = hexToCount.get(match);
            hexToCount.set(match, count ? count + 1 : 1);
            instructionsRow[brickCol] = match;

            brickImageCtx.drawImage(
                brickImgs[match],
                brickCol * BRICK_IMG_WIDTH_PIXELS,
                brickRow * BRICK_IMG_HEIGHT_PIXELS,
            );
        }
        instructions[brickRow] = instructionsRow;
    }

    const imageOutput = brickImageCan.toBuffer('image/jpeg', { quality: 0.75 });

    const output = {
        image: imageOutput,
        hexToCountAfter: hexToCountAfter,
        instructions: instructions,
        sampleSize: widthSampleSize,
    };

    console.timeEnd('makeMosaic');
    console.groupEnd();

    return output;
};

export const getMosaicForSubmission = async (id: string): Promise<string> => {
    return JotformSubmissionModel.findOne({ submissionId: id })
        .populate<{ mosaics: [IMosaic] }>('mosaics')
        .orFail()
        .then(async (sub) => {
            if (sub.mosaics.length != 1) {
                throw new Error(
                    `Unsupported number of mosaics in this submission (${sub.mosaics.length}).`,
                );
            }
            const mosaic = sub.mosaics[0];
            const resultFileName = `${sub.submissionId}-mosaic-${sub.imageNames.length}.jpeg`;
            await writeFile(resultFileName, mosaic.buffer);
            return resultFileName;
        });
};

export const getMosaicForLatestSubmission = async (): Promise<string> => {
    const latestSubmission = await JotformSubmissionModel.findOne({}, {}, { sort: { date: -1 } });
    if (!latestSubmission) {
        throw new Error('No submissions found');
    }
    return getMosaicForSubmission(latestSubmission.submissionId);
};

// Get hex from palette that is closest to the average colour in the given sample area
const getColourMatchForSample = (
    brickRow: number,
    brickCol: number,
    heightSampleSize: number,
    widthSampleSize: number,
    imageWidth: number,
    imageHeight: number,
    pixelArr: Uint8ClampedArray,
    rgbPalette: { R: number; G: number; B: number }[],
): string => {
    const pixelsOriginCol = brickCol * widthSampleSize;
    const pixelsEndCol = pixelsOriginCol + widthSampleSize;
    const pixelsOriginRow = brickRow * heightSampleSize;
    const pixelsEndRow = pixelsOriginRow + heightSampleSize;

    // Average RGB vals over sample size
    //   Collect RGB values over sample size
    const rVals = [];
    const gVals = [];
    const bVals = [];

    // Loop through the vertical pixel indices for the sample box
    for (let row = Math.floor(pixelsOriginRow); row <= pixelsEndRow && row < imageHeight; row++) {
        // Loop through the pixels for this row in the sample box
        for (let col = Math.floor(pixelsOriginCol); col <= pixelsEndCol && col < imageWidth; col++) {
            const pixelRgb = getPixelForCoords(
                Math.floor(col),
                Math.floor(row),
                imageWidth,
                pixelArr,
            );

            let fractionOfPixel = 1;
            if (col === Math.floor(pixelsOriginCol)) {
                fractionOfPixel = fractionOfPixel * (1 - (pixelsOriginCol % 1));
            } else if (col + 1 > pixelsEndCol) {
                fractionOfPixel = fractionOfPixel * (pixelsEndCol % 1);
            }

            if (row === Math.floor(pixelsOriginRow)) {
                fractionOfPixel = fractionOfPixel * (1 - (pixelsOriginRow % 1));
            } else if (row + 1 > pixelsEndRow) {
                fractionOfPixel = fractionOfPixel * (pixelsEndRow % 1);
            }

            const weight = fractionOfPixel / (widthSampleSize * heightSampleSize);
            rVals.push({ value: pixelRgb.r, weight: weight });
            gVals.push({ value: pixelRgb.g, weight: weight });
            bVals.push({ value: pixelRgb.b, weight: weight });
        }
    }

    //   Average RGB vals
    const rAvg = Math.floor(rVals.reduce((acc, cur) => acc + cur.value * cur.weight, 0));
    const gAvg = Math.floor(gVals.reduce((acc, cur) => acc + cur.value * cur.weight, 0));
    const bAvg = Math.floor(bVals.reduce((acc, cur) => acc + cur.value * cur.weight, 0));

    // Find closest RGB colour in palette
    const match = closestColourInPalette(rAvg, gAvg, bAvg, rgbPalette);
    return match;
};
