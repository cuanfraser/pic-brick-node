import {
    closestColourInPalette,
    cropImageToBoardSize,
} from '../src/services/image.service.server.js';

describe('closestColourInPalette Tests', () => {
    test('Chooses correct colour if given exact match', () => {
        const output = closestColourInPalette(215, 135, 57, 1);
        expect(output).toEqual('#D78739');
    });
});

describe('cropImageToBoardSize Tests', () => {
    test('No crop on perfect square with no mod', () => {
        const output = cropImageToBoardSize(96, 96, 480, 480);
        expect(output).toEqual({ newWidth: 480, newHeight: 480, widthCrop: 0, heightCrop: 0 });
    });

    test('Various sizes, factor of square board size', () => {
        const boardSize = 96;
        for (let i = 0; i < 10; i++) {
            const width = Math.floor(Math.random() * 1000);
            const height = Math.floor(Math.random() * 1000);
            const output = cropImageToBoardSize(boardSize, boardSize, width, height);
            expect(output.newWidth % boardSize).toBe(0);
            expect(output.newHeight % boardSize).toBe(0);
        }
    });

    test('Various rectangles, cropped to square board size', () => {
        const boardSize = 96;
        for (let i = 0; i < 10; i++) {
            const width = Math.floor(Math.random() * 1000);
            const height = Math.floor(Math.random() * 1000);
            const output = cropImageToBoardSize(boardSize, boardSize, width, height);
            expect(output.newWidth === output.newHeight).toBeTruthy();
        }
    });
});

// describe('makeImageBricks Tests', () => {
//     test('Correct number of bricks used', () => {
//         const output = cropImageToBoardSize(96, 96, 480, 480);
//         expect(output).toEqual({ newWidth: 480, newHeight: 480, widthCrop: 0, heightCrop: 0 });
//     });

//     test('Various sizes, factor of square board size', () => {
//         const boardSize = 96;
//         for (let i = 0; i < 10; i++) {
//             const width = Math.floor(Math.random() * 1000);
//             const height = Math.floor(Math.random() * 1000);
//             const output = cropImageToBoardSize(boardSize, boardSize, width, height);
//             expect(output.newWidth % boardSize).toBe(0);
//             expect(output.newHeight % boardSize).toBe(0);
//         }
//     });
// });
