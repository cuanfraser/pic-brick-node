import fetch from 'node-fetch';
import FormData from 'form-data';
import { CARTOON_API_URL, HEX_COLOUR_PALETTE } from '../constants.js';
import Canvas from 'canvas';
import convert from 'color-convert';
import nearestColour from 'nearest-color';

const cartoonifyImage = async (img) => {
    console.time('cartoon');
    const formData = new FormData();
    formData.append('file_type', 'image');
    formData.append('source', img, 'input image.jpg');
    const resp = await fetch(CARTOON_API_URL, {
        method: 'POST',
        body: formData,
    });

    console.timeEnd('cartoon');
    return resp;
};

const pixelateImage = async (src, boardSize) => {
    console.time('pixelate');
    // const img = new Canvas.Image();
    // img.src = src;
    const img = await Canvas.loadImage(src);

    console.group(['Pixelate Image']);

    const w = img.width;
    const h = img.height;

    console.log('Pixelate: h = ' + h);
    console.log('Pixelate: w = ' + w);

    const can = Canvas.createCanvas(w, h);
    let ctx = can.getContext('2d');
    ctx.drawImage(img, 0, 0);

    let pixelArr = ctx.getImageData(0, 0, w, h).data;

    // Calculate Sample Size based on Physical Size
    console.log(boardSize);
    let sampleSize = w / 64;
    let widthBlocks = 64;
    let heightBlocks = 64;
    // Sample Size = (Res / Blocks #)
    if (boardSize === 'Small 64x64') {
        sampleSize = w / 64;
        widthBlocks = 64;
        heightBlocks = 64;
    } else if (boardSize === 'Medium 96x64') {
        sampleSize = w / 64;
        widthBlocks = 96;
        heightBlocks = 64;
    } else if (boardSize === 'Large 96x96') {
        sampleSize = w / 96;
        widthBlocks = 96;
        heightBlocks = 96;
    }

    const roundedSampleSize = Math.floor(sampleSize);

    // Reduce Size to 64: Res*(1/(Math.floor(sampleSize)) - 1/(Res/widthBlocks))
    const reduceBlocks = w * (1 / roundedSampleSize - 1 / (w / widthBlocks));
    const pixelsDump = reduceBlocks * roundedSampleSize;

    console.log('Sample Size: ' + sampleSize);
    console.log('Rounded Sample Size: ' + roundedSampleSize);
    console.log('Image Width: ' + w);
    console.log('To Reduce Blocks: ' + reduceBlocks);
    console.log('Pixels Dump: ' + pixelsDump);

    const outputCan = Canvas.createCanvas(w - Math.ceil(pixelsDump), h - Math.ceil(pixelsDump));
    let outputCtx = outputCan.getContext('2d');

    for (let y = 0; y < h - pixelsDump; y += roundedSampleSize) {
        for (let x = 0; x < w - pixelsDump; x += roundedSampleSize) {
            let p = (x + y * w) * 4;

            // Average RGB vals over sample size
            //   Collect RGB values over sample size
            const rVals = [];
            const gVals = [];
            const bVals = [];
            for (let i = p; i < p + roundedSampleSize * 4; i += 4) {
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

            outputCtx.fillStyle =
                'rgba(' + match[0] + ',' + match[1] + ',' + match[2] + ',' + 1 + ')';
            outputCtx.fillRect(x, y, roundedSampleSize, roundedSampleSize);
        }
    }

    console.timeEnd('pixelate');

    console.groupEnd();

    return outputCan.toBuffer('image/jpeg', { quality: 0.75 });
};

const closestColourInPalette = (r, g, b) => {
    const matcher = nearestColour.from(HEX_COLOUR_PALETTE);
    const hexMatch = matcher(`rgb(${r}, ${g}, ${b})`);
    const rgbOutput = convert.hex.rgb(hexMatch);
    return rgbOutput;
};

export { cartoonifyImage, pixelateImage, closestColourInPalette };
