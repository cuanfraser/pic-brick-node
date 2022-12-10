import Canvas from 'canvas';
import { HEX_COLOUR_PALETTE } from '../constants';
import { cropImageToBoardSize } from './image.service';
import nearestColour from 'nearest-color';

const brickImgs: { [key: string]: Canvas.Image; } = {};
//Load images of individual bricks
(async () => {
    // For each hex colour, load image and set as canvas image object inside brickImgs array.
    for (const hex of HEX_COLOUR_PALETTE) {
        const name = hex.substring(1);
        const blockImgPath = new URL(`../../resources/bricks/${name}.png`, import.meta.url);
        const blockImg = await Canvas.loadImage(blockImgPath.pathname);
        brickImgs[hex] = blockImg;
    }
})();

// Finds closest hex colour in colour palette when given RGB val
const closestColourInPalette = (r: number, g: number, b: number, palette: string[]): string => {
    const matcher = nearestColour.from(palette);
    return matcher(`rgb(${r}, ${g}, ${b})`);
};

interface ImageWithHexCount {
    image: Buffer,
    hexToCountBefore: Map<string, number>,
    hexToCountAfter: Map<string, number>
}


// Make image into pixelated area reped by bricks
const makeBrickImage = async (
    src: Buffer,
    widthBlocks: number,
    heightBlocks: number,
): Promise<ImageWithHexCount> => {
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

    const sampleSize = newWidth / widthBlocks;
    console.log('Sample Size: ' + sampleSize);

    //Brick image
    const brickImageWidth = widthBlocks * 32;
    const brickImageHeight = heightBlocks * 32;
    console.log(`brickImageWidth: ${brickImageWidth} brickImageHeight: ${brickImageHeight}`);
    const brickImageCan = Canvas.createCanvas(brickImageWidth, brickImageHeight);
    const brickImageCtx = brickImageCan.getContext('2d');

    const hexToCount = new Map<string, number>();

    for (let y = 0; y < newHeight; y += sampleSize) {
        for (let x = 0; x < newWidth; x += sampleSize) {
            const p = (x + y * newWidth) * 4;

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
            const match = closestColourInPalette(rAvg, gAvg, bAvg, HEX_COLOUR_PALETTE);
            const count = hexToCount.get(match);
            hexToCount.set(match, count ? count + 1 : 1);
        }
    }

    // Count of bricks used for each Hex colour
    hexToCount.forEach((value: number, key: string) => {
        console.log('Hex ' + key + ' used: ' + value);
    });

    // New Palette excluding Hex colours with less than chosen amount
    const newPalette = HEX_COLOUR_PALETTE.filter((hex) => {
        let count = hexToCount.get(hex);
        if (count == undefined) {
            count = 0;
        }
        return count > 5;
    });

    const hexToCountAfter = new Map<string, number>();

    // Build image on canvas
    for (let y = 0; y < newHeight; y += sampleSize) {
        for (let x = 0; x < newWidth; x += sampleSize) {
            const p = (x + y * newWidth) * 4;

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
            const match = closestColourInPalette(rAvg, gAvg, bAvg, newPalette);
            const count = hexToCountAfter.get(match);
            hexToCountAfter.set(match, count ? count + 1 : 1);

            brickImageCtx.drawImage(brickImgs[match], (x / sampleSize) * 32, (y / sampleSize) * 32);
        }
    }

    // Hex Usage after dropping min
    hexToCountAfter.forEach((value: number, key: string) => {
        console.log('Final Hex ' + key + ' used: ' + value);
    });

    const imageOutput = brickImageCan.toBuffer('image/jpeg', { quality: 0.75 });

    const output = {
        image: imageOutput,
        hexToCountBefore: hexToCount,
        hexToCountAfter: hexToCountAfter
    };

    console.timeEnd('pixelate');
    console.groupEnd();

    return output;
};

export { brickImgs, makeBrickImage, closestColourInPalette, ImageWithHexCount };
