import Canvas from 'canvas';
import { HEX_COLOUR_PALETTE } from '../constants.js';

const brickImgs = {};
// Load images of individual bricks
(async () => {
    for (const hex of HEX_COLOUR_PALETTE) {
        const name = hex.substring(1);
        const blockImgPath = new URL(`../../resources/bricks/${name}_32x32.png`, import.meta.url);
        const blockImg = await Canvas.loadImage(blockImgPath.pathname);
        brickImgs[name] = blockImg;
    }
})();

export { brickImgs };
