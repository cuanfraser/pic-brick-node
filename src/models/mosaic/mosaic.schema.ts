import { Schema } from 'mongoose';

export interface IMosaic {
    size: string;
    originalImageName: string;
    buffer: Buffer;
    hexToCountMap: Map<string, number>;
    instructions: string[][];
    sampleSize: number;
}

export const mosaicSchema = new Schema<IMosaic>({
    size: String,
    originalImageName: String,
    buffer: { type: Buffer, required: true },
    hexToCountMap: { type: Map, of: Number },
    instructions: [[String]],
    sampleSize: Number
});
