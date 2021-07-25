import Canvas from 'canvas';
import { HEX_COLOUR_PALETTE } from '../constants.js';
import { cropImageToBoardSize } from './image.service.js';
import nearestColour from 'nearest-color';

const brickImgs = {};
// Load images of individual bricks
(async () => {
    // For each hex colour, load image and set as canvas image object inside brickImgs array.
    for (const hex of HEX_COLOUR_PALETTE) {
        const name = hex.substring(1);
        const blockImgPath = new URL(`../../resources/bricks/${name}_32x32.png`, import.meta.url);
        const blockImg = await Canvas.loadImage(blockImgPath.pathname);
        brickImgs[hex] = blockImg;
    }
})();

// Finds closest hex colour in colour palette when given RGB val
const closestColourInPalette = (r, g, b) => {
    const matcher = nearestColour.from(HEX_COLOUR_PALETTE);
    return matcher(`rgb(${r}, ${g}, ${b})`);
};

const pixelateImage = async (src, widthBlocks, heightBlocks) => {
    console.groupCollapsed(['Pixelate Image']);
    console.time('pixelate');

    const img = await Canvas.loadImage(src);

    // Get cropped values
    const { newWidth, newHeight, widthCrop, heightCrop, newWidthBlocks, newHeightBlocks } =
        cropImageToBoardSize(widthBlocks, heightBlocks, img.width, img.height);
    // Rotation swaps these
    widthBlocks = newWidthBlocks;
    heightBlocks = newHeightBlocks;

    // Create Canvas to draw cropped image on to analyze colours
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

    // Get pixel array where each pixel is 4 slots (RGBA)
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

export { brickImgs, pixelateImage, closestColourInPalette };
