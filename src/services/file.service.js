import Canvas from 'canvas';
import { HEX_COLOUR_PALETTE } from '../constants.js';

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

export { brickImgs };
