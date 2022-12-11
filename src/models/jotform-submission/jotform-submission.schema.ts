import { Schema } from 'mongoose';

export interface IJotformSubmission {
    submissionId: number;
    formId: number;
    ip: string;
    email: string;
    size: string;
    imageNames: [string];
}

const jotformSubmissionSchema = new Schema<IJotformSubmission>({
    submissionId: Number,
    formId: Number,
    ip: String,
    email: String,
    size: String,
    imageNames: [String],
});

export { jotformSubmissionSchema };