import fetch from 'node-fetch';
import {
    closestColourInPalette,
    cropImageToBoardSize,
} from '../src/services/image.service.server.js';

describe('closestColourInPalette Tests', () => {
    test('Chooses correct colour if given exact match', () => {
        const output = closestColourInPalette(215, 135, 57, 1);
        expect(output).toEqual([215, 135, 57]);
    });
});

describe('cropImageToBoardSize Tests', () => {
    test('No crop on perfect square with no mod', () => {
        const output = cropImageToBoardSize(96, 96, 480, 480);
        expect(output).toEqual({ newWidth: 480, newHeight: 480, widthCrop: 0, heightCrop: 0 });
    });
});
