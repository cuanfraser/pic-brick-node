import { HEX_COLOUR_NUM_MAP, HEX_COLOUR_PALETTE } from '../constants.js';
import { existsSync } from 'node:fs';

describe('Hex Tests', () => {
    test('All colours in palette have ID in map', () => {
        HEX_COLOUR_PALETTE.forEach(hex => {
            const hasMapping = HEX_COLOUR_NUM_MAP.has(hex);
            expect(hasMapping).toBe(true);
        })
    });

    test('All colours in palette have brick image', () => {
        HEX_COLOUR_PALETTE.forEach(hex => {
            const name = hex.substring(1);
            const blockImgPath = new URL(`../../resources/bricks/${name}.png`, import.meta.url);
            const fileExists = existsSync(blockImgPath);
            expect(fileExists).toBe(true);
        })
    });
});