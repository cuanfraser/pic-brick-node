import { model } from 'mongoose';
import { IMosaic, mosaicSchema } from './mosaic.schema.js';

const MosaicModel = model<IMosaic>('Mosaic', mosaicSchema);

export { MosaicModel };
