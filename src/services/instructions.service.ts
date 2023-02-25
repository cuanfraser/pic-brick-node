import { JotformSubmission } from "../models/jotform-submission/jotform-submission.model.js";
import { IMosaic } from "../models/mosaic/mosaic.schema.js";


export const getInstructionsForSubmission = async (id: string): Promise<string> => 
    JotformSubmission.findOne({submissionId: id}).populate<{mosaics: [IMosaic]}>('mosaics').orFail().then(sub=> {
        let csvString = '';

        sub.mosaics.forEach(mosaic => {
            let currentString = `${mosaic.originalImageName}(${mosaic.size})\n`;
            mosaic.instructions.forEach(row => {
                row.forEach(column => {
                    // get name/number instead of hex
                    currentString += column + ',';
                })
                currentString += '\n';
            })
            csvString += currentString + '\n';
        })

        return csvString;
    });