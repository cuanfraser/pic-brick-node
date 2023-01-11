import { model } from 'mongoose';
import { IMosaic, mosaicSchema } from './mosaic.schema.js';

const Mosaic = model<IMosaic>('Mosaic', mosaicSchema);

export { Mosaic };
