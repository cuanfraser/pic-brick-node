import { closestColourInPalette } from '../src/services/brick.service.js';

describe('closestColourInPalette Tests', () => {
    test('Chooses correct colour if given exact match', () => {
        const output = closestColourInPalette(215, 135, 57, 1);
        expect(output).toEqual('#D78739');
    });
});
