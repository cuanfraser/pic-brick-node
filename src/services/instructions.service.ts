import { HEX_COLOUR_NUM_MAP } from '../constants.js';
import { JotformSubmissionModel } from '../models/jotform-submission/jotform-submission.model.js';
import { IMosaic } from '../models/mosaic/mosaic.schema.js';

export const getInstructionsForSubmission = async (id: string): Promise<string> =>
    JotformSubmissionModel.findOne({ submissionId: id })
        .populate<{ mosaics: [IMosaic] }>('mosaics')
        .orFail()
        .then((sub) => {
            let csvString = '';

            sub.mosaics.forEach((mosaic) => {
                // Name of mosaic at top
                const headerString = `${mosaic.originalImageName}(${mosaic.size})\n`;

                const hexCountString = getHexCount(mosaic);

                // Convert Hexs to color IDs from map
                const instructionsMapString = getInstructionsAsColorIds(mosaic);

                csvString += `${headerString}\n${hexCountString}\n${instructionsMapString}\n`;
            });

            return csvString;
        });

const getHexCount = (mosaic: IMosaic): string => {
    let hexCountString = 'colorId,hex,count\n';
    HEX_COLOUR_NUM_MAP.forEach((colorId, hex) => {
        const count = mosaic.hexToCountMap.get(hex);
        const current = `${colorId},${hex},${count ? count : 0}\n`;
        hexCountString += current;
    });

    return hexCountString;
};

function getInstructionsAsColorIds(mosaic: IMosaic) {
    let instructionsMapString = '';
    mosaic.instructions.forEach((row) => {
        row.forEach((column) => {
            const id = HEX_COLOUR_NUM_MAP.get(column);
            instructionsMapString += id + ',';
        });
        instructionsMapString += '\n';
    });
    return instructionsMapString;
}
