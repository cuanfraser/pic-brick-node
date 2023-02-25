import { model } from 'mongoose';
import { IMosaic, mosaicSchema } from './mosaic.schema.js';

export const MosaicModel = model<IMosaic>('Mosaic', mosaicSchema);
