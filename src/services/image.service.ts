import Sharp from 'sharp';

const processInputImage = async (img: Buffer): Promise<Buffer> => {
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

const processOutputImage = async (img: Buffer): Promise<Buffer> => {
    const outputImg = Sharp(img, {}).withMetadata().jpeg().toBuffer();

    return outputImg;
};

const cropImage = (
    widthBlocks: number,
    heightBlocks: number,
    originalWidth: number,
    originalHeight: number,
): {
    newWidth: number;
    newHeight: number;
    widthCrop: number;
    heightCrop: number;
    newWidthBlocks: number;
    newHeightBlocks: number;
} => {
    console.groupCollapsed(['Crop Image']);

    console.log(`originalWidth: ${originalWidth} originalHeight: ${originalHeight}`);

    // Crop to correct board aspect ratio
    const {
        correctAspectRatioWidth,
        correctAspectRatioHeight,
        widthRemainingPixels,
        heightRemainingPixels,
        newWidthBlocks,
        newHeightBlocks,
    } = cropToBoardSize(widthBlocks, heightBlocks, originalWidth, originalHeight);

    // Crop for equal number of pixels per brick

    const widthRemainingPixelsBricksCrop = correctAspectRatioWidth % newWidthBlocks;
    const heightRemainingPixelsBricksCrop = correctAspectRatioHeight % newHeightBlocks;
    console.log(
        `widthRemainingPixelsBricksCrop: ${widthRemainingPixelsBricksCrop} heightRemainingPixelsBricksCrop: ${heightRemainingPixelsBricksCrop}`,
    );

    const newWidth = correctAspectRatioWidth - widthRemainingPixelsBricksCrop;
    const newHeight = correctAspectRatioHeight - heightRemainingPixelsBricksCrop;
    const widthCrop = widthRemainingPixelsBricksCrop + widthRemainingPixels;
    const heightCrop = heightRemainingPixelsBricksCrop + heightRemainingPixels;
    const output = { newWidth, newHeight, widthCrop, heightCrop, newWidthBlocks, newHeightBlocks };
    console.log('Crop Output: ');
    console.dir(output);

    console.groupEnd();

    return output;
};

// Get values to crop image to aspect ratio of board size
const cropToBoardSize = (
    widthBlocks: number,
    heightBlocks: number,
    originalWidth: number,
    originalHeight: number,
): {
    correctAspectRatioWidth: number;
    correctAspectRatioHeight: number;
    widthRemainingPixels: number;
    heightRemainingPixels: number;
    newWidthBlocks: number;
    newHeightBlocks: number;
} => {
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

    return {
        correctAspectRatioWidth,
        correctAspectRatioHeight,
        widthRemainingPixels,
        heightRemainingPixels,
        newWidthBlocks,
        newHeightBlocks,
    };
};

export { cropImage as cropImageToBoardSize, processInputImage, processOutputImage };
