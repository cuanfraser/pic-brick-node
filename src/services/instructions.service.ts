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
    // For sorting by colorId
    const colorIdToStringMap = new Map<number, string>();
    const nonMatchedHexes = new Map<string, number>();
    mosaic.hexToCountMap.forEach((count, hex) => {
        const colorId = HEX_COLOUR_NUM_MAP.get(hex)
        if (colorId) {
            const current = `${hex},${count ? count : 0}`;
            colorIdToStringMap.set(colorId, current);
        } else {
            nonMatchedHexes.set(hex, count ? count : 0);
        }
    });

    const sortedMap = new Map([...colorIdToStringMap.entries()].sort());
    sortedMap.forEach((stringVal, colorId) => {
        hexCountString += `${colorId},${stringVal}\n`;
    })
    if (nonMatchedHexes.size > 0) {
        hexCountString += 'No Color ID Hexes:\n';
        nonMatchedHexes.forEach((count, hex) => {
            hexCountString += `Hex: ${hex}, Count: ${count}\n`;
        })
    }

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
