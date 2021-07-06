import fetch from 'node-fetch';
import { closestColourInPalette } from '../src/services/image.service.server.js';

describe('Image Service', () => {
    test('JotForm Sample Image URL Active', () => {
        const output = closestColourInPalette(215, 135, 57, 1)
        expect(output).toEqual([215, 135, 57]);
    });
});
