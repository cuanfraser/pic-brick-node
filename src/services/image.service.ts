import Sharp from 'sharp';

const processInputImage = async (img: Buffer): Promise<Buffer> => {
    const outputImg = Sharp(img, {})
        .sharpen()
        .modulate({
            brightness: 1.2,
        })
        .withMetadata()
        .jpeg()
        .toBuffer();

    return outputImg;
};

const processOutputImage = async (img: Buffer): Promise<Buffer> => {
    const outputImg = Sharp(img, {}).withMetadata().jpeg().toBuffer();

    return outputImg;
};

const cropImageToBoardSize = (
    widthBlocks: number,
    heightBlocks: number,
    originalWidth: number,
    originalHeight: number
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

    // Crop to correct aspect ratio
    const boardRatio = widthBlocks / heightBlocks;
    const horizontalRatio = originalWidth / originalHeight;
    const verticalRatio = originalHeight / originalWidth;

    console.log(
        `boardRatio: ${boardRatio} horizontalRatio: ${horizontalRatio} verticalRatio: ${verticalRatio}`
    );

    let cropW = 0;
    let cropH = 0;
    // landscape
    if (originalWidth >= originalHeight) {
        if (horizontalRatio > boardRatio) {
            const neededWidth = originalHeight * boardRatio;
            cropW = originalWidth - neededWidth;
        } else {
            const neededHeight = originalWidth / boardRatio;
            cropH = originalHeight - neededHeight;
        }
    }
    // vertical
    else if (originalWidth < originalHeight) {
        const temp = widthBlocks;
        widthBlocks = heightBlocks;
        heightBlocks = temp;
        if (verticalRatio > boardRatio) {
            const neededHeight = originalWidth * boardRatio;
            cropH = originalHeight - neededHeight;
        } else {
            const neededWidth = originalHeight / boardRatio;
            cropW = originalWidth - neededWidth;
        }
    }

    cropW = Math.floor(cropW);
    cropH = Math.floor(cropH);

    const ratioCropWidth = originalWidth - cropW;
    const ratioCropHeight = originalHeight - cropH;
    console.log(`ratioCropWidth: ${ratioCropWidth} ratioCropHeight: ${ratioCropHeight}`);
    console.log(`cropW: ${cropW} cropH: ${cropH}`);

    const modCropW = ratioCropWidth % widthBlocks;
    const modCropH = ratioCropHeight % heightBlocks;
    console.log(`modCropW: ${modCropW} modCropH: ${modCropH}`);

    const newWidth = ratioCropWidth - modCropW;
    const newHeight = ratioCropHeight - modCropH;
    const widthCrop = modCropW + cropW;
    const heightCrop = modCropH + cropH;
    const newWidthBlocks = widthBlocks;
    const newHeightBlocks = heightBlocks;
    const output = { newWidth, newHeight, widthCrop, heightCrop, newWidthBlocks, newHeightBlocks };
    console.log('Crop Output: ');
    console.dir(output);

    console.groupEnd();

    return output;
};

export { cropImageToBoardSize, processInputImage, processOutputImage };
