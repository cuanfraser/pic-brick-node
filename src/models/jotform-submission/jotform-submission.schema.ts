import { Schema, Types } from 'mongoose';

export interface IJotformSubmission {
    submissionId: number;
    formId: number;
    ip: string;
    email: string;
    size: string;
    imageNames: [string];
    mosaics: [Types.ObjectId];
}

const jotformSubmissionSchema = new Schema<IJotformSubmission>({
    submissionId: Number,
    formId: Number,
    ip: String,
    email: String,
    size: String,
    imageNames: [String],
    mosaics: { type: [Schema.Types.ObjectId], ref: 'Mosaic'}
});

export { jotformSubmissionSchema };
