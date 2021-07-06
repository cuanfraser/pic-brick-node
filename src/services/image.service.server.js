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

    const w = img.width;
    const h = img.height;

    const can = Canvas.createCanvas(w, h);
    let ctx = can.getContext('2d');
    ctx.drawImage(img, 0, 0);

    let pixelArr = ctx.getImageData(0, 0, w, h).data;

    // Calculate Sample Size based on Physical Size
    console.log(boardSize);
    let sampleSize = 1;
    if (boardSize === 'Small 64x64') {
        sampleSize = 20;
    } else if (boardSize === 'Medium 96x64') {
        sampleSize = 15;
    } else if (boardSize === 'Large 96x96') {
        sampleSize = 10;
    }

    for (let y = 0; y < h; y += sampleSize) {
        for (let x = 0; x < w; x += sampleSize) {
            let p = (x + y * w) * 4;
            // TODO: Change to average RGB Vals
            // Currently first pixel RGB vals in sample is used

            const match = closestColourInPalette(pixelArr[p], pixelArr[p + 1], pixelArr[p + 2]);

            ctx.fillStyle = 'rgba(' + match[0] + ',' + match[1] + ',' + match[2] + ',' + 1 + ')';
            ctx.fillRect(x, y, sampleSize, sampleSize);
        }
    }

    console.timeEnd('pixelate');

    return can.toBuffer('image/jpeg', { quality: 0.75 });
};

const closestColourInPalette = (r, g, b) => {
    const matcher = nearestColour.from(HEX_COLOUR_PALETTE);
    const hexMatch = matcher(`rgb(${r}, ${g}, ${b})`);
    const rgbOutput = convert.hex.rgb(hexMatch);
    return rgbOutput;
};

export { cartoonifyImage, pixelateImage, closestColourInPalette };
