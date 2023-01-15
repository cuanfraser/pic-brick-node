import { HEX_COLOUR_PALETTE } from '../constants.js';
import { closestColourInPalette } from '../services/brick.service.js';

describe('closestColourInPalette Tests', () => {
    test('Chooses correct colour if given exact match', () => {
        const output = closestColourInPalette(215, 135, 57, HEX_COLOUR_PALETTE);
        expect(output).toEqual('#D78739');
    });
});
