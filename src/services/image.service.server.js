import fetch from 'node-fetch';
import FormData from 'form-data';
import { CARTOON_API_URL } from '../constants.js';
import Canvas from 'canvas';

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

const pixelateImage = async (src) => {
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
    let sample_size = 10;

    for (let y = 0; y < h; y += sample_size) {
        for (let x = 0; x < w; x += sample_size) {
            let p = (x + y * w) * 4;
            ctx.fillStyle =
                'rgba(' +
                pixelArr[p] +
                ',' +
                pixelArr[p + 1] +
                ',' +
                pixelArr[p + 2] +
                ',' +
                pixelArr[p + 3] +
                ')';
            ctx.fillRect(x, y, sample_size, sample_size);
        }
    }

    console.timeEnd('pixelate');

    return can.toBuffer('image/jpeg', { quality: 0.75 });
};

export { cartoonifyImage, pixelateImage };
