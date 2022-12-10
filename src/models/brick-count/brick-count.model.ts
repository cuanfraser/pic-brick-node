import mongoose from 'mongoose';
import { brickCountSchema } from './brick-count.schema';

const brickCountModel = mongoose.model(
    'BrickCountModel',
    brickCountSchema
)

export { brickCountModel as quizModel };