import { model } from 'mongoose';
import { IMosaic, mosaicSchema } from './mosaic.schema';

const Mosaic = model<IMosaic>('Mosaic', mosaicSchema);

export { Mosaic };
