import { HEX_COLOUR_NUM_MAP } from "../constants.js";
import { JotformSubmissionModel } from "../models/jotform-submission/jotform-submission.model.js";
import { IMosaic } from "../models/mosaic/mosaic.schema.js";


export const getInstructionsForSubmission = async (id: string): Promise<string> => 
    JotformSubmissionModel.findOne({submissionId: id}).populate<{mosaics: [IMosaic]}>('mosaics').orFail().then(sub=> {
        let csvString = '';

        sub.mosaics.forEach(mosaic => {
            let currentString = `${mosaic.originalImageName}(${mosaic.size})\n`;
            mosaic.instructions.forEach(row => {
                row.forEach(column => {
                    const id = HEX_COLOUR_NUM_MAP.get(column)
                    currentString += id + ',';
                })
                currentString += '\n';
            })
            csvString += currentString + '\n';
        })

        return csvString;
    });