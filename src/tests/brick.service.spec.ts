import { closestColourInPalette } from '../services/brick.service';

describe('closestColourInPalette Tests', () => {
    test('Chooses correct colour if given exact match', () => {
        const output = closestColourInPalette(215, 135, 57);
        expect(output).toEqual('#D78739');
    });
});
