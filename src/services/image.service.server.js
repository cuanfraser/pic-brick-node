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
    console.group(['Pixelate Image']);
    console.time('pixelate');

    const img = await Canvas.loadImage(src);
    const originalWidth = img.width;
    const originalHeight = img.height;

    console.log(`originalWidth: ${originalWidth} originalHeight: ${originalHeight}`);

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

    // Crop to correct aspect ratio
    const ratio = widthBlocks / heightBlocks;

    let cropW = 0;
    let cropH = 0;
    if (ratio === 1) {
        if (originalWidth > originalHeight) {
            cropW = originalWidth - originalHeight;
        } else if (originalHeight > originalWidth) {
            cropH = originalHeight - originalWidth;
        }
    }
    const croppedWidth = originalWidth - cropW;
    const croppedHeight = originalHeight - cropH;
    console.log(`croppedWidth: ${croppedWidth} croppedHeight: ${croppedHeight}`);
    console.log(`cropW: ${cropW} cropH: ${cropH}`);

    const modCropW = croppedWidth % widthBlocks;
    const modCropH = croppedHeight % heightBlocks;
    console.log(`modCropW: ${modCropW} modCropH: ${modCropH}`);

    const newHeight = croppedWidth - modCropH;
    const newWidth = croppedHeight - modCropW;
    console.log(`newHeight: ${newHeight} newWidth: ${newWidth}`);

    const finalCropW = modCropW + cropW;
    const finalCropH = modCropH + cropH;

    const can = Canvas.createCanvas(newWidth, newHeight);
    let ctx = can.getContext('2d');
    //ctx.drawImage(img, 0, 0);
    ctx.drawImage(
        img,
        finalCropW / 2,
        finalCropH / 2,
        newWidth,
        newHeight,
        0,
        0,
        newWidth,
        newHeight
    );

    let pixelArr = ctx.getImageData(0, 0, newWidth, newHeight).data;

    const sampleSize = newWidth / widthBlocks;


    console.log('Sample Size: ' + sampleSize);
    console.log('Image Width: ' + newWidth);

    const outputCan = Canvas.createCanvas(newWidth, newHeight);
    let outputCtx = outputCan.getContext('2d');

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

            outputCtx.fillStyle =
                'rgba(' + match[0] + ',' + match[1] + ',' + match[2] + ',' + 1 + ')';
            outputCtx.fillRect(x, y, sampleSize, sampleSize);
        }
    }

    const output = outputCan.toBuffer('image/jpeg', { quality: 0.75 });

    console.timeEnd('pixelate');
    console.groupEnd();

    return output;
};

const closestColourInPalette = (r, g, b) => {
    const matcher = nearestColour.from(HEX_COLOUR_PALETTE);
    const hexMatch = matcher(`rgb(${r}, ${g}, ${b})`);
    const rgbOutput = convert.hex.rgb(hexMatch);
    return rgbOutput;
};

export { cartoonifyImage, pixelateImage, closestColourInPalette };
