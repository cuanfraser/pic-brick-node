import { Mosaic } from "../models/mosaic/mosaic.model.js";

export const getHexCountCsv = async (): Promise<string> => {
    const mosaics = await Mosaic.find();
    const hexTotals = new Map<string, [number]>();

    for (const mosaic of mosaics) {
        for (const [hex, count] of mosaic.hexToCountMap) {
            if (hexTotals.has(hex)) {
                hexTotals.get(hex)!.push(count);
            } else {
                hexTotals.set(hex, [count]);
            }
        }
    }

    const header = 'hex,total,imgs_used'
    let csvString = header + '\n';

    for (const [hex, counts] of hexTotals) {
        const total = counts.reduce((prev, current) => prev + current);
        const row = `${hex},${total},${counts.length}\n`;
        csvString += row;
    }

    return csvString;
}