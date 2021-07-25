import { HEX_COLOUR_PALETTE } from '../constants.js';
import { brickImgs } from './file.service.js';
import Canvas from 'canvas';
import nearestColour from 'nearest-color';

const pixelateImage = async (src, widthBlocks, heightBlocks) => {
    console.groupCollapsed(['Pixelate Image']);
    console.time('pixelate');

    const img = await Canvas.loadImage(src);
    const originalWidth = img.width;
    const originalHeight = img.height;

    console.log(`originalWidth: ${originalWidth} originalHeight: ${originalHeight}`);

    const { newWidth, newHeight, widthCrop, heightCrop, newWidthBlocks, newHeightBlocks } =
        cropImageToBoardSize(widthBlocks, heightBlocks, originalWidth, originalHeight);

    widthBlocks = newWidthBlocks;
    heightBlocks = newHeightBlocks;

    const can = Canvas.createCanvas(newWidth, newHeight);
    let ctx = can.getContext('2d');
    ctx.drawImage(
        img,
        widthCrop / 2,
        heightCrop / 2,
        newWidth,
        newHeight,
        0,
        0,
        newWidth,
        newHeight
    );

    // Get pixel array
    let pixelArr = ctx.getImageData(0, 0, newWidth, newHeight).data;

    let sampleSize = newWidth / widthBlocks;
    console.log('Sample Size: ' + sampleSize);

    //Brick image
    const brickImageWidth = widthBlocks * 32;
    const brickImageHeight = heightBlocks * 32;
    console.log(`brickImageWidth: ${brickImageWidth} brickImageHeight: ${brickImageHeight}`);
    const brickImageCan = Canvas.createCanvas(brickImageWidth, brickImageHeight);
    let brickImageCtx = brickImageCan.getContext('2d');

    for (let y = 0; y < newHeight; y += sampleSize) {
        for (let x = 0; x < newWidth; x += sampleSize) {
            let p = (x + y * newWidth) * 4;

            // Average RGB vals over sample size
            //   Collect RGB values over sample size
            const rVals = [];
            const gVals = [];
            const bVals = [];
            for (let i = p; i < p + sampleSize * 4; i += 4) {
                const r = pixelArr[i];
                const g = pixelArr[i + 1];
                const b = pixelArr[i + 2];

                rVals.push(r);
                gVals.push(g);
                bVals.push(b);
            }
            //   Average RGB vals
            const rAvg = Math.floor(rVals.reduce((acc, cur) => acc + cur) / rVals.length);
            const gAvg = Math.floor(gVals.reduce((acc, cur) => acc + cur) / gVals.length);
            const bAvg = Math.floor(bVals.reduce((acc, cur) => acc + cur) / bVals.length);

            // Find closest RGB colour in palette
            const match = closestColourInPalette(rAvg, gAvg, bAvg);

            brickImageCtx.drawImage(brickImgs[match], (x / sampleSize) * 32, (y / sampleSize) * 32);
        }
    }

    const output = brickImageCan.toBuffer('image/jpeg', { quality: 0.75 });

    console.timeEnd('pixelate');
    console.groupEnd();

    return output;
};

// Finds closest hex colour in colour palette when given RGB val
const closestColourInPalette = (r, g, b) => {
    const matcher = nearestColour.from(HEX_COLOUR_PALETTE);
    return matcher(`rgb(${r}, ${g}, ${b})`);
};

const cropImageToBoardSize = (widthBlocks, heightBlocks, originalWidth, originalHeight) => {
    console.groupCollapsed(['Crop Image']);

    // Crop to correct aspect ratio
    const boardRatio = widthBlocks / heightBlocks;
    const horizontalRatio = originalWidth / originalHeight;
    const verticalRatio = originalHeight / originalWidth;

    console.log(
        `boardRatio: ${boardRatio} horizontalRatio: ${horizontalRatio} verticalRatio: ${verticalRatio}`
    );

    let cropW = 0;
    let cropH = 0;
    // landscape
    if (originalWidth >= originalHeight) {
        if (horizontalRatio > boardRatio) {
            const neededWidth = originalHeight * boardRatio;
            cropW = originalWidth - neededWidth;
        } else {
            const neededHeight = originalWidth / boardRatio;
            cropH = originalHeight - neededHeight;
        }
    }
    // vertical
    else if (originalWidth < originalHeight) {
        const temp = widthBlocks;
        widthBlocks = heightBlocks;
        heightBlocks = temp;
        if (verticalRatio > boardRatio) {
            const neededHeight = originalWidth * boardRatio;
            cropH = originalHeight - neededHeight;
        } else {
            const neededWidth = originalHeight / boardRatio;
            cropW = originalWidth - neededWidth;
        }
    }

    cropW = Math.floor(cropW);
    cropH = Math.floor(cropH);

    const ratioCropWidth = originalWidth - cropW;
    const ratioCropHeight = originalHeight - cropH;
    console.log(`ratioCropWidth: ${ratioCropWidth} ratioCropHeight: ${ratioCropHeight}`);
    console.log(`cropW: ${cropW} cropH: ${cropH}`);

    const modCropW = ratioCropWidth % widthBlocks;
    const modCropH = ratioCropHeight % heightBlocks;
    console.log(`modCropW: ${modCropW} modCropH: ${modCropH}`);

    const newWidth = ratioCropWidth - modCropW;
    const newHeight = ratioCropHeight - modCropH;
    const widthCrop = modCropW + cropW;
    const heightCrop = modCropH + cropH;
    const newWidthBlocks = widthBlocks;
    const newHeightBlocks = heightBlocks;
    const output = { newWidth, newHeight, widthCrop, heightCrop, newWidthBlocks, newHeightBlocks };
    console.log('Crop Output: ');
    console.dir(output);

    console.groupEnd();

    return output;
};

export { pixelateImage, closestColourInPalette, cropImageToBoardSize };
