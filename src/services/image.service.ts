import Sharp from 'sharp';

export const processInputImage = async (img: Buffer): Promise<Buffer> => {
    const outputImg = Sharp(img, {})
        .sharpen()
        // .modulate({
        //     brightness: 1.2,
        // })
        .withMetadata()
        .jpeg()
        .toBuffer();

    return outputImg;
};

export const processOutputImage = async (img: Buffer): Promise<Buffer> => {
    const outputImg = Sharp(img, {}).withMetadata().jpeg().toBuffer();

    return outputImg;
};

// Get values to crop image to aspect ratio of board size
export const cropToBoardSize = (
    widthBlocks: number,
    heightBlocks: number,
    originalWidth: number,
    originalHeight: number,
): {
    correctAspectRatioWidth: number;
    correctAspectRatioHeight: number;
    widthCrop: number;
    heightCrop: number;
    newWidthBlocks: number;
    newHeightBlocks: number;
} => {
    console.groupCollapsed(['Crop Image']);
    const boardSizeWidthToHeightRatio = widthBlocks / heightBlocks;
    const imgWidthToHeightRatio = originalWidth / originalHeight;
    const imgHeightToWidthRatio = originalHeight / originalWidth;

    console.log(
        `boardSizeWidthToHeightRatio: ${boardSizeWidthToHeightRatio} imgWidthToHeightRatio: ${imgWidthToHeightRatio} imgHeightToWidthRatio: ${imgHeightToWidthRatio}`,
    );

    let widthRemainingPixels = 0;
    let heightRemainingPixels = 0;
    let newWidthBlocks = widthBlocks;
    let newHeightBlocks = heightBlocks;
    // original image is landscape
    if (originalWidth >= originalHeight) {
        // original image is wider than needed
        if (imgWidthToHeightRatio > boardSizeWidthToHeightRatio) {
            const neededWidth = originalHeight * boardSizeWidthToHeightRatio;
            widthRemainingPixels = originalWidth - neededWidth;
            // original image is taller than needed
        } else {
            const neededHeight = originalWidth / boardSizeWidthToHeightRatio;
            heightRemainingPixels = originalHeight - neededHeight;
        }
    }
    // original image is vertical
    else {
        newWidthBlocks = heightBlocks;
        newHeightBlocks = widthBlocks;
        // original image is taller than needed
        if (imgHeightToWidthRatio > boardSizeWidthToHeightRatio) {
            const neededHeight = originalWidth * boardSizeWidthToHeightRatio;
            heightRemainingPixels = originalHeight - neededHeight;
            // original image is wider than needed
        } else {
            const neededWidth = originalHeight / boardSizeWidthToHeightRatio;
            widthRemainingPixels = originalWidth - neededWidth;
        }
    }

    widthRemainingPixels = Math.floor(widthRemainingPixels);
    heightRemainingPixels = Math.floor(heightRemainingPixels);

    const correctAspectRatioWidth = originalWidth - widthRemainingPixels;
    const correctAspectRatioHeight = originalHeight - heightRemainingPixels;

    console.log(
        `correctAspectRatioWidth: ${correctAspectRatioWidth} correctAspectRatioHeight: ${correctAspectRatioHeight}`,
    );
    console.log(
        `widthRemainingPixels: ${widthRemainingPixels} heightRemainingPixels: ${heightRemainingPixels}`,
    );

    console.groupEnd();

    return {
        correctAspectRatioWidth,
        correctAspectRatioHeight,
        widthCrop: widthRemainingPixels,
        heightCrop: heightRemainingPixels,
        newWidthBlocks,
        newHeightBlocks,
    };
};

export const getPixelForCoords = (
    column: number,
    row: number,
    imageWidth: number,
    pixelArr: Uint8ClampedArray,
): { r: number; g: number; b: number } => {
    const index = (column + row * imageWidth) * 4;
    return { r: pixelArr[index], g: pixelArr[index + 1], b: pixelArr[index + 2] };
};