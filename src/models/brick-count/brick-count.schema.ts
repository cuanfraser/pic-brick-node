import mongoose from 'mongoose';
const brickCountSchema = mongoose.Schema({
    title: String,
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'QuestionsModel'
    }]
}, { collection: 'brick-counts' })

export { brickCountSchema };