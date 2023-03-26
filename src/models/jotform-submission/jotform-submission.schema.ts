import { Schema, Types } from 'mongoose';

export interface IJotformSubmission {
    _id: Types.ObjectId;
    submissionId: string;
    formId: string;
    ip: string;
    firstName: string;
    lastName: string;
    email: string;
    size: string;
    replaceBackground: string;
    backgroundColor: string;
    imageNames: [string];
    mosaics: [Types.ObjectId];
}

export const jotformSubmissionSchema = new Schema<IJotformSubmission>(
    {
        submissionId: String,
        formId: String,
        ip: String,
        firstName: String,
        lastName: String,
        email: String,
        size: String,
        replaceBackground: String,
        backgroundColor: String,
        imageNames: [String],
        mosaics: { type: [Schema.Types.ObjectId], ref: 'Mosaic' },
    },
    { collection: 'jotform-submissions' },
);
