import { Schema, Types } from 'mongoose';

export interface IJotformSubmission {
    _id: Types.ObjectId;
    submissionId: string;
    formId: string;
    ip: string;
    email: string;
    size: string;
    imageNames: [string];
    mosaics: [Types.ObjectId];
}

const jotformSubmissionSchema = new Schema<IJotformSubmission>(
    {
        submissionId: String,
        formId: String,
        ip: String,
        email: String,
        size: String,
        imageNames: [String],
        mosaics: { type: [Schema.Types.ObjectId], ref: 'Mosaic' },
    },
    { collection: 'jotform-submissions' },
);

export { jotformSubmissionSchema };
