import { cropToBoardSize } from '../services/image.service.js';

describe('cropImageToBoardSize Tests', () => {
    test('No crop on perfect square', () => {
        const output = cropToBoardSize(96, 96, 480, 480);
        expect(output).toEqual({
            correctAspectRatioWidth: 480,
            correctAspectRatioHeight: 480,
            widthCrop: 0,
            heightCrop: 0,
            newWidthBlocks: 96,
            newHeightBlocks: 96,
        });
    });

    test('Various rectangles, cropped to square board size', () => {
        const boardSize = 96;
        for (let i = 0; i < 10; i++) {
            const width = Math.floor(Math.random() * 1000);
            const height = Math.floor(Math.random() * 1000);
            const output = cropToBoardSize(boardSize, boardSize, width, height);
            expect(output.correctAspectRatioWidth === output.correctAspectRatioHeight).toBeTruthy();
        }
    });
});
