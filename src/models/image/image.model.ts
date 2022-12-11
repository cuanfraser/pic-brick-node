import mongoose from 'mongoose';
import { imageSchema } from './image.schema';

const imageModel = mongoose.model(
    'ImageModel',
    imageSchema
)

export { imageModel };