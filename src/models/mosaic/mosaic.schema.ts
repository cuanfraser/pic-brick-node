import { Schema } from 'mongoose';

export interface IMosaic {
    size: string;
    originalImageName: string;
    buffer: Buffer;
}

const mosaicSchema = new Schema<IMosaic>({
    size: String,
    originalImageName: String,
    buffer: { type: Buffer, required: true },
});

export { mosaicSchema };
